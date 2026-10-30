import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { GalleryCategory } from "@/features/gallery/gallery.service";
import adminApi from "./adminApi";
import { useToast } from "./adminContext";
import { StatusSwitch } from "./ManagerParts";
import { Drawer } from "./ui";
import { apiError } from "./utils";
import {
  collectDrop,
  collectFiles,
  prepareImage,
  runPool,
  sourceKey,
  titleFor,
  type BulkFile,
  type Collected,
} from "./bulkUpload";

const CATEGORIES = ["formation", "education", "healthcare", "social-services", "events", "celebrations", "pilgrimages", "meetings", "other"] as const;
const PARALLEL = 3;
const MAX_BYTES = 10 * 1024 * 1024;
const NEW_ALBUM = "__new__";

interface Group {
  folder: string;
  album: string;
  files: BulkFile[];
}

type Outcome = { state: "done" } | { state: "skipped"; reason: string } | { state: "failed"; reason: string };

interface Props {
  open: boolean;
  onClose: () => void;
  albums: GalleryCategory[];
  /** Album names already used by uploaded photos. */
  customAlbums: string[];
  /** sourceFile values of photos already in the gallery (to skip repeats). */
  existing: Set<string>;
  onFinished: () => void;
}

const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(bytes < 10 * 1024 * 1024 ? 1 : 0)} MB`;

export function BulkUploadDrawer({ open, onClose, albums, customAlbums, existing, onFinished }: Props) {
  const toast = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [reading, setReading] = useState(false);
  const [readError, setReadError] = useState("");
  const [over, setOver] = useState(false);
  const [mode, setMode] = useState<"folders" | "one">("folders");
  const [oneChoice, setOneChoice] = useState("");
  const [oneNew, setOneNew] = useState("");
  const [category, setCategory] = useState("events");
  const [status, setStatus] = useState("published");
  const [phase, setPhase] = useState<"pick" | "uploading" | "done">("pick");
  const [results, setResults] = useState<Map<string, Outcome>>(new Map());
  const abort = useRef<AbortController | null>(null);

  // Folder names that match an existing public album go into that album.
  const albumFor = useMemo(() => {
    const byLabel = new Map(albums.map((a) => [a.label.toLowerCase(), a.id]));
    return (folder: string) => byLabel.get(folder.toLowerCase()) ?? folder;
  }, [albums]);
  const labelOf = (album: string) => albums.find((a) => a.id === album)?.label ?? album;
  const oneAlbum = oneChoice === NEW_ALBUM ? albumFor(oneNew.trim()) : oneChoice;

  const reset = () => {
    setGroups([]);
    setSkipped([]);
    setReadError("");
    setResults(new Map());
    setPhase("pick");
  };

  useEffect(() => {
    if (open && phase === "done") reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (phase !== "uploading") return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [phase]);

  const add = async (read: () => Promise<Collected>) => {
    setReading(true);
    setReadError("");
    try {
      const { files, skipped: notPhotos } = await read();
      setSkipped((s) => [...s, ...notPhotos]);
      setGroups((prev) => {
        const next = prev.map((g) => ({ ...g, files: [...g.files] }));
        const seen = new Set(next.flatMap((g) => g.files.map((f) => `${g.folder}/${f.name}/${f.size}`)));
        for (const file of files) {
          const id = `${file.folder}/${file.name}/${file.size}`;
          if (seen.has(id)) continue;
          seen.add(id);
          let group = next.find((g) => g.folder === file.folder);
          if (!group) {
            group = { folder: file.folder, album: file.folder ? albumFor(file.folder) : "", files: [] };
            next.push(group);
          }
          group.files.push(file);
        }
        return next;
      });
      if (files.length === 0 && notPhotos.length > 0) setReadError("No photos found. Choose JPG, PNG, WebP or GIF photos, folders of photos, or a .zip.");
    } catch (err) {
      setReadError((err as Error)?.message?.includes("zip") || (err as Error)?.message?.includes("invalid") ? "That zip file could not be opened." : "Some files could not be read. Please try again.");
    } finally {
      setReading(false);
    }
  };

  const allFiles = groups.flatMap((g) => g.files.map((f) => ({ file: f, album: mode === "one" ? oneAlbum.trim() : g.album.trim() })));
  const totalBytes = groups.reduce((n, g) => n + g.files.reduce((m, f) => m + f.size, 0), 0);
  const hasFolders = groups.some((g) => g.folder);
  const missingAlbum = (mode === "folders" && groups.some((g) => !g.album.trim() && g.folder)) || (mode === "one" && oneChoice === NEW_ALBUM && !oneNew.trim());

  const counts = useMemo(() => {
    let done = 0, failed = 0, skippedN = 0;
    results.forEach((r) => (r.state === "done" ? done++ : r.state === "failed" ? failed++ : skippedN++));
    return { done, failed, skipped: skippedN, finished: done + failed + skippedN };
  }, [results]);

  const start = async (only?: Set<string>) => {
    const queue = allFiles.filter(({ file }) => !only || only.has(file.key));
    if (!queue.length) return;
    setPhase("uploading");
    if (!only) setResults(new Map());
    else setResults((r) => { const n = new Map(r); only.forEach((k) => n.delete(k)); return n; });
    const ctrl = new AbortController();
    abort.current = ctrl;
    const perAlbum = new Map<string, number>();
    const record = (key: string, outcome: Outcome) => setResults((r) => new Map(r).set(key, outcome));

    await runPool(
      queue,
      PARALLEL,
      async ({ file, album }) => {
        const n = (perAlbum.get(album) ?? 0) + 1;
        perAlbum.set(album, n);
        const source = sourceKey(album, file.name);
        if (existing.has(source)) return record(file.key, { state: "skipped", reason: "Already in the gallery" });
        let blob: Blob;
        try {
          blob = await prepareImage(file.blob, file.name);
        } catch (err) {
          return record(file.key, { state: "failed", reason: (err as Error).message });
        }
        if (blob.size > MAX_BYTES) return record(file.key, { state: "failed", reason: `Larger than 10 MB (${mb(blob.size)})` });
        const form = new FormData();
        const uploadName = blob.type === "image/jpeg" ? file.name.replace(/\.[^.]+$/, ".jpg") : file.name;
        form.append("image", new File([blob], uploadName, { type: blob.type || "image/jpeg" }));
        form.append("title", titleFor(file.name, labelOf(album), n));
        form.append("album", album);
        form.append("category", category);
        form.append("status", status);
        form.append("sourceFile", source);
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            await adminApi.post("/gallery", form, { headers: { "Content-Type": "multipart/form-data" }, signal: ctrl.signal });
            existing.add(source);
            return record(file.key, { state: "done" });
          } catch (err) {
            const e = err as { code?: string; response?: { status?: number } };
            if (ctrl.signal.aborted || e.code === "ERR_CANCELED") return record(file.key, { state: "failed", reason: "Stopped" });
            const retryable = !e.response || (e.response.status ?? 0) >= 500 || e.response.status === 429;
            if (attempt === 2 || !retryable) return record(file.key, { state: "failed", reason: apiError(err, "Upload failed") });
            await new Promise((r) => setTimeout(r, 1500));
          }
        }
      },
      ctrl.signal,
    );
    abort.current = null;
    setPhase("done");
    onFinished();
  };

  useEffect(() => {
    if (phase === "done" && results.size) {
      toast(counts.failed ? `${counts.done} uploaded, ${counts.failed} failed` : `${counts.done} photos uploaded`, counts.failed ? "error" : "success");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const failedKeys = new Set([...results].filter(([, r]) => r.state === "failed").map(([k]) => k));
  const failedList = allFiles.filter(({ file }) => failedKeys.has(file.key));

  const requestClose = () => {
    if (phase === "uploading") return toast("Stop the upload first, or wait for it to finish.", "info");
    if (phase === "done") reset();
    onClose();
  };

  const pct = allFiles.length ? Math.round((counts.finished / allFiles.length) * 100) : 0;
  const albumOptions = (
    <>
      <option value="">Latest uploads (no album)</option>
      {albums.length > 0 && (
        <optgroup label="Existing albums">
          {albums.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
        </optgroup>
      )}
      {customAlbums.length > 0 && (
        <optgroup label="Albums created here">
          {customAlbums.map((a) => <option key={a} value={a}>{a}</option>)}
        </optgroup>
      )}
    </>
  );

  return (
    <Drawer
      open={open}
      title="Bulk upload photos"
      onClose={requestClose}
      footer={
        phase === "uploading" ? (
          <button type="button" className="a-btn a-btn--danger" onClick={() => abort.current?.abort()}>
            Stop upload
          </button>
        ) : phase === "done" ? (
          <>
            {failedList.length > 0 && (
              <button type="button" className="a-btn a-btn--ghost" onClick={() => void start(failedKeys)}>
                <Icon name="refresh" /> Retry {failedList.length} failed
              </button>
            )}
            <button type="button" className="a-btn" onClick={requestClose}>
              <Icon name="check" /> Done
            </button>
          </>
        ) : (
          <>
            <button type="button" className="a-btn a-btn--ghost" onClick={requestClose}>Cancel</button>
            <button type="button" className="a-btn" disabled={!allFiles.length || reading || missingAlbum} onClick={() => void start()}>
              <Icon name="upload" /> Upload {allFiles.length || ""} photo{allFiles.length === 1 ? "" : "s"}
            </button>
          </>
        )
      }
    >
      <div className="a-form">
        {phase === "pick" && (
          <>
            <label
              className={`a-drop${over ? " is-over" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(true);
              }}
              onDragLeave={() => setOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setOver(false);
                const dt = e.dataTransfer;
                void add(() => collectDrop(dt));
              }}
            >
              <Icon name="upload" />
              <strong>Drop photos, folders or .zip files here</strong>
              <span className="a-hint">Each folder becomes its own album · Google Drive folder downloads (.zip) work too</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif,.zip,application/zip"
                className="sr-only"
                aria-label="Choose photos or zip files"
                onChange={(e) => {
                  const list = Array.from(e.target.files ?? []);
                  e.target.value = "";
                  void add(() => collectFiles(list));
                }}
              />
            </label>
            <div className="a-bulk__pickers">
              <label className="a-btn a-btn--ghost">
                <Icon name="image" /> Choose photos
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  aria-label="Choose photos"
                  onChange={(e) => {
                    const list = Array.from(e.target.files ?? []);
                    e.target.value = "";
                    void add(() => collectFiles(list));
                  }}
                />
              </label>
              <label className="a-btn a-btn--ghost">
                <Icon name="grid" /> Choose a folder
                <input
                  type="file"
                  multiple
                  className="sr-only"
                  aria-label="Choose a folder"
                  {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
                  onChange={(e) => {
                    const list = Array.from(e.target.files ?? []);
                    e.target.value = "";
                    void add(() => collectFiles(list));
                  }}
                />
              </label>
              <label className="a-btn a-btn--ghost">
                <Icon name="download" /> Add .zip
                <input
                  type="file"
                  multiple
                  accept=".zip,application/zip"
                  className="sr-only"
                  aria-label="Choose zip files"
                  onChange={(e) => {
                    const list = Array.from(e.target.files ?? []);
                    e.target.value = "";
                    void add(() => collectFiles(list));
                  }}
                />
              </label>
            </div>

            {reading && (
              <div className="a-alert a-alert--info" role="status"><span className="a-spin" /> <span>Reading files…</span></div>
            )}
            {readError && (
              <div className="a-alert a-alert--error" role="alert"><Icon name="alert" /><span>{readError}</span></div>
            )}

            {groups.length > 0 && (
              <>
                <div className="a-bulk__summary">
                  <strong>{allFiles.length} photos</strong> · {mb(totalBytes)} · {groups.length} {groups.length === 1 ? "folder" : "folders"}
                  {skipped.length > 0 && <span className="a-hint"> · {skipped.length} non-photo file{skipped.length === 1 ? "" : "s"} left out</span>}
                  <button type="button" className="a-linklike a-bulk__clear" onClick={reset}>Clear</button>
                </div>

                <div className="a-field">
                  <span className="a-label">Albums</span>
                  <div className="a-seg" role="group" aria-label="Albums">
                    <button type="button" aria-pressed={mode === "folders"} onClick={() => setMode("folders")}>
                      {hasFolders ? "One album per folder" : "Keep as chosen"}
                    </button>
                    <button type="button" aria-pressed={mode === "one"} onClick={() => setMode("one")}>All in one album</button>
                  </div>
                </div>

                {mode === "one" ? (
                  <div className="a-field">
                    <label htmlFor="bulk-album">Album</label>
                    <select id="bulk-album" className="a-select" style={{ textTransform: "none" }} value={oneChoice} onChange={(e) => setOneChoice(e.target.value)}>
                      {albumOptions}
                      <option value={NEW_ALBUM}>+ New album…</option>
                    </select>
                    {oneChoice === NEW_ALBUM && (
                      <input className="a-input" aria-label="New album name" placeholder="e.g. Jubilee 2025" maxLength={80} value={oneNew} onChange={(e) => setOneNew(e.target.value)} />
                    )}
                  </div>
                ) : (
                  <ul className="a-bulk__groups" aria-label="Folders">
                    {groups.map((g, i) => (
                      <li key={g.folder || "(loose)"} className="a-bulk__group">
                        <div className="a-bulk__group-head">
                          <Icon name="image" />
                          <span className="a-bulk__folder" title={g.folder}>{g.folder || "Chosen photos"}</span>
                          <span className="a-hint">{g.files.length} photo{g.files.length === 1 ? "" : "s"}</span>
                          <button type="button" className="a-icon-btn a-icon-btn--danger" aria-label={`Remove ${g.folder || "chosen photos"}`} onClick={() => setGroups((list) => list.filter((_, j) => j !== i))}>
                            <Icon name="close" />
                          </button>
                        </div>
                        <label className="a-bulk__album">
                          <span>Album name</span>
                          <input
                            className="a-input"
                            value={labelOf(g.album)}
                            placeholder="Latest uploads (no album)"
                            maxLength={80}
                            aria-label={`Album for ${g.folder || "chosen photos"}`}
                            onChange={(e) => {
                              const value = e.target.value;
                              setGroups((list) => list.map((x, j) => (j === i ? { ...x, album: albumFor(value) } : x)));
                            }}
                          />
                        </label>
                        {albums.some((a) => a.id === g.album) && <span className="a-hint is-good">Adds to the existing &ldquo;{labelOf(g.album)}&rdquo; filter</span>}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="a-row-2">
                  <div className="a-field">
                    <label htmlFor="bulk-category">Category</label>
                    <select id="bulk-category" className="a-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/-/g, " ")}</option>)}
                    </select>
                  </div>
                  <StatusSwitch value={status} onChange={setStatus} />
                </div>
                <span className="a-hint">Large photos are resized in your browser before uploading, so uploads are quick. Photos already uploaded to the same album are skipped.</span>
              </>
            )}
          </>
        )}

        {phase !== "pick" && (
          <div className="a-bulk__progress" aria-live="polite">
            <div className="a-bulk__bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Upload progress">
              <span style={{ width: `${pct}%` }} />
            </div>
            <p>
              <strong>{counts.finished} of {allFiles.length}</strong> · {counts.done} uploaded
              {counts.skipped > 0 && <> · {counts.skipped} already there</>}
              {counts.failed > 0 && <> · <span style={{ color: "var(--a-red)" }}>{counts.failed} failed</span></>}
            </p>
            {phase === "uploading" && <p className="a-hint">Keep this page open until the upload finishes.</p>}
            {phase === "done" && counts.failed === 0 && (
              <div className="a-alert a-alert--info"><Icon name="check" /><span>Finished. The photos are now in the gallery{status === "published" ? " and on the website" : " as drafts"}.</span></div>
            )}
            {failedList.length > 0 && phase === "done" && (
              <ul className="a-files" aria-label="Failed uploads">
                {failedList.slice(0, 50).map(({ file }) => {
                  const r = results.get(file.key);
                  return (
                    <li key={file.key} className="a-file is-error">
                      <span className="a-file__badge">!</span>
                      <span className="a-file__name">{file.folder ? `${file.folder}/` : ""}{file.name}</span>
                      <span className="a-file__size">{r && r.state === "failed" ? r.reason : ""}</span>
                    </li>
                  );
                })}
                {failedList.length > 50 && <li className="a-hint">…and {failedList.length - 50} more</li>}
              </ul>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
}

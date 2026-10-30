/**
 * Helpers for the admin "Bulk upload" (many photos, folders and Google Drive zips).
 * Pure functions where possible so they can be unit-tested.
 */

export interface BulkFile {
  /** Unique key within one batch. */
  key: string;
  name: string;
  /** Folder the photo came from ("" when chosen loose). Used as the album name. */
  folder: string;
  size: number;
  blob: Blob;
}

export interface Collected {
  files: BulkFile[];
  /** Names of files that are not photos (videos, documents…) and were left out. */
  skipped: string[];
}

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;
const HEIC_EXT = /\.(heic|heif)$/i;
const JUNK = /(^|\/)(__MACOSX|\.DS_Store|Thumbs\.db|desktop\.ini)(\/|$)|(^|\/)\._/i;

export const isPhotoName = (name: string) => IMAGE_EXT.test(name);
export const isHeicName = (name: string) => HEIC_EXT.test(name);
export const isZipName = (name: string) => /\.zip$/i.test(name);

/** "Jubilee 2024-20261023T153012Z-001.zip" → "Jubilee 2024" (Google Drive download names). */
export function cleanZipName(name: string) {
  return name
    .replace(/\.zip$/i, "")
    .replace(/-\d{8}T\d{6}Z(-\d+)?$/i, "")
    .replace(/\s*\(\d+\)$/, "")
    .trim();
}

/** Album for a file path: its own folder; files at the top level use the fallback (e.g. the zip name). */
export function folderOf(path: string, fallback = "") {
  const parts = path.split("/").filter(Boolean);
  return parts.length >= 2 ? parts[parts.length - 2]!.trim() : fallback;
}

const baseName = (path: string) => path.split("/").filter(Boolean).pop() ?? path;

/** Readable title from a file name; camera names like IMG_1234 become "<Album> · photo 12". */
export function titleFor(fileName: string, album: string, n: number) {
  const stem = fileName.replace(/\.[^.]+$/, "");
  const camera = /^(img|dsc|dscn|dcim|pxl|mvimg|photo|image|whatsapp image|screenshot|wa)[\s_-]*[\d\s_.:-]*(at[\s\d_.:-]*)?(\(\d+\))?$/i;
  const readable = stem.replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();
  if (readable.length >= 5 && !camera.test(stem) && !/^[\d\s_.()-]+$/.test(stem)) return readable.slice(0, 200);
  return `${album || "Gallery"} · photo ${n}`.slice(0, 200);
}

let seq = 0;
const make = (blob: Blob, path: string, fallbackFolder: string): BulkFile => ({
  key: `f${++seq}`,
  name: baseName(path),
  folder: folderOf(path, fallbackFolder),
  size: blob.size,
  blob,
});

const readBytes = (blob: Blob): Promise<ArrayBuffer> =>
  typeof blob.arrayBuffer === "function"
    ? blob.arrayBuffer()
    : new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(blob);
      });

/** Unpacks a zip in the browser (Google Drive "Download" of a folder gives one). */
export async function expandZip(zip: File): Promise<Collected> {
  const { unzip } = await import("fflate");
  const data = new Uint8Array(await readBytes(zip));
  const skipped: string[] = [];
  // Only photos are unpacked; videos and documents are just listed as left out.
  const keep = (name: string) => {
    if (name.endsWith("/") || JUNK.test(name)) return false;
    if (isPhotoName(name)) return true;
    skipped.push(baseName(name));
    return false;
  };
  const entries = await new Promise<Record<string, Uint8Array>>((resolve, reject) =>
    unzip(data, { filter: (f) => keep(f.name) }, (err, out) => (err ? reject(err) : resolve(out))),
  );
  const fallback = cleanZipName(zip.name);
  const files: BulkFile[] = [];
  for (const [path, bytes] of Object.entries(entries)) {
    const ext = path.split(".").pop()!.toLowerCase();
    const type = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "gif" ? "image/gif" : "image/jpeg";
    files.push(make(new Blob([bytes as BlobPart], { type }), path, fallback));
  }
  return { files, skipped };
}

/** Files from an <input type=file> (multiple, or a folder with webkitdirectory). Zips are unpacked. */
export async function collectFiles(list: Iterable<File>): Promise<Collected> {
  const files: BulkFile[] = [];
  const skipped: string[] = [];
  for (const file of list) {
    const path = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
    if (JUNK.test(path)) continue;
    if (isZipName(file.name)) {
      const out = await expandZip(file);
      files.push(...out.files);
      skipped.push(...out.skipped);
    } else if (isPhotoName(file.name)) files.push(make(file, path, ""));
    else skipped.push(file.name);
  }
  return { files, skipped };
}

type Entry = FileSystemEntry & { fullPath: string };

async function readEntry(entry: Entry, out: File[], paths: string[]) {
  if (entry.isFile) {
    const file = await new Promise<File>((res, rej) => (entry as FileSystemFileEntry).file(res, rej));
    out.push(file);
    paths.push(entry.fullPath.replace(/^\//, ""));
    return;
  }
  const reader = (entry as FileSystemDirectoryEntry).createReader();
  // readEntries returns results in chunks; keep reading until empty.
  for (;;) {
    const batch = await new Promise<FileSystemEntry[]>((res, rej) => reader.readEntries(res, rej));
    if (!batch.length) break;
    for (const child of batch) await readEntry(child as Entry, out, paths);
  }
}

/** Drag-and-drop: photos, zips and whole folders (with sub-folders). */
export async function collectDrop(dt: DataTransfer): Promise<Collected> {
  const entries = Array.from(dt.items ?? [])
    .map((item) => (item.kind === "file" && "webkitGetAsEntry" in item ? (item.webkitGetAsEntry() as Entry | null) : null))
    .filter(Boolean) as Entry[];
  if (!entries.length) return collectFiles(Array.from(dt.files ?? []));

  const raw: File[] = [];
  const paths: string[] = [];
  for (const entry of entries) await readEntry(entry, raw, paths);
  const files: BulkFile[] = [];
  const skipped: string[] = [];
  for (let i = 0; i < raw.length; i++) {
    const file = raw[i]!;
    const path = paths[i]!;
    if (JUNK.test(path)) continue;
    if (isZipName(file.name)) {
      const out = await expandZip(file);
      files.push(...out.files);
      skipped.push(...out.skipped);
    } else if (isPhotoName(file.name)) files.push(make(file, path, ""));
    else skipped.push(file.name);
  }
  return { files, skipped };
}

const MAX_SIDE = 2000;
const KEEP_BELOW = 1.5 * 1024 * 1024;

/**
 * Shrinks large photos in the browser before upload (phone photos are often 4–8 MB).
 * The server makes its own 1600 px WebP, so 2000 px JPEG loses nothing visible.
 * Falls back to the original when the browser cannot decode or resize it.
 */
export async function prepareImage(blob: Blob, name: string): Promise<Blob> {
  if (blob.type === "image/gif" || typeof createImageBitmap !== "function") return blob;
  let bitmap: ImageBitmap | undefined;
  try {
    bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && blob.size <= KEEP_BELOW) return blob;
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return blob;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, w, h);
    const out = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.88));
    return out && out.size < blob.size ? out : blob;
  } catch {
    if (isHeicName(name)) throw new Error("HEIC photos are not supported — export them as JPG first.");
    return blob;
  } finally {
    bitmap?.close();
  }
}

/** Runs tasks with a small number in parallel; stops starting new ones when `signal` aborts. */
export async function runPool<T>(items: T[], limit: number, task: (item: T) => Promise<void>, signal?: AbortSignal) {
  let next = 0;
  const worker = async () => {
    while (next < items.length && !signal?.aborted) {
      const item = items[next++]!;
      await task(item);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
}

export const sourceKey = (album: string, name: string) => `${album.trim()}/${name}`.slice(0, 300);

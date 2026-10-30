import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const DISMISSED_KEY = "jmj-province-assembly-2026-invitation-dismissed";
const INVITATION = "/media/events/province-assembly-2026-invitation.png";
const ANNOUNCEMENT =
  "JMJ Hyderabad Province Joyfully Celebrates the Province Assembly 2026. Theme: “Rekindling Commitment & Revitalizing Mission” — 31 October 2026.";

export function ProvinceAssemblyAnnouncement() {
  const [open, setOpen] = useState(false);
  const [activePage, setActivePage] = useState<"invitation" | "programme">("invitation");
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const dismiss = useCallback(() => {
    try {
      window.sessionStorage.setItem(DISMISSED_KEY, "yes");
    } catch {
      // Storage may be unavailable in privacy-restricted browsers.
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    // Invite once per browser tab/session. The ticker can reopen it at any time.
    try {
      if (!window.sessionStorage.getItem(DISMISSED_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.body.classList.add("assembly-modal-open");
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
      }
      if (event.key !== "Tab") return;
      const items = Array.from(document.querySelectorAll<HTMLElement>(".assembly-dialog button, .assembly-dialog a[href]"));
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("assembly-modal-open");
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus({ preventScroll: true });
    };
  }, [open, dismiss]);

  return (
    <>
      <aside className="assembly-ticker" aria-label="Province Assembly 2026 announcement">
        <span className="assembly-ticker__label">Province Assembly 2026</span>
        <button
          type="button"
          className="assembly-ticker__open"
          onClick={() => setOpen(true)}
          aria-label={`${ANNOUNCEMENT} Open invitation and programme`}
          title="Click to view the invitation and programme"
        >
          <span className="assembly-ticker__message" aria-hidden="true">
            <strong>31 October 2026</strong>
            <span className="assembly-ticker__separator" aria-hidden="true">·</span>
            Rekindling Commitment &amp; Revitalizing Mission
          </span>
        </button>
        <button type="button" className="assembly-ticker__view" onClick={() => setOpen(true)}>
          View invitation <span aria-hidden="true">↗</span>
        </button>
      </aside>

      {open && createPortal((
        <div className="assembly-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) dismiss(); }}>
          <div className="assembly-dialog" role="dialog" aria-modal="true" aria-labelledby="assembly-dialog-title" aria-describedby="assembly-dialog-description">
            <header className="assembly-dialog__header">
              <div>
                <span className="assembly-dialog__eyebrow">31 October 2026 · Somajiguda, Hyderabad</span>
                <h2 id="assembly-dialog-title">Province Assembly 2026</h2>
                <p id="assembly-dialog-description">Rekindling Commitment &amp; Revitalizing Mission</p>
              </div>
              <button ref={closeRef} className="assembly-dialog__close" type="button" onClick={dismiss} aria-label="Close invitation">
                ×
              </button>
            </header>
            <div className="assembly-dialog__tabs" role="tablist" aria-label="Invitation pages">
              <button type="button" role="tab" id="assembly-invitation-tab" aria-controls="assembly-page" aria-selected={activePage === "invitation"} onClick={() => setActivePage("invitation")}>1. Invitation</button>
              <button type="button" role="tab" id="assembly-programme-tab" aria-controls="assembly-page" aria-selected={activePage === "programme"} onClick={() => setActivePage("programme")}>2. Programme Schedule</button>
            </div>
            <div className="assembly-dialog__pages" id="assembly-page" role="tabpanel" aria-labelledby={activePage === "invitation" ? "assembly-invitation-tab" : "assembly-programme-tab"}>
              {activePage === "invitation" ? (
                <img src="/media/events/province-assembly-2026-invitation-page.webp" alt="JMJ Hyderabad Province Assembly 2026 invitation, theme, venue, and date" width={768} height={1024} />
              ) : (
                <img src="/media/events/province-assembly-2026-programme-page.webp" alt="Province Assembly programme schedule for 31 October 2026" width={768} height={1024} />
              )}
            </div>
            <footer className="assembly-dialog__footer">
              <a href={activePage === "invitation" ? INVITATION : "/media/events/province-assembly-2026-programme-page.webp"} target="_blank" rel="noopener noreferrer">Open full-size {activePage === "invitation" ? "invitation" : "programme"}</a>
              <button type="button" onClick={dismiss}>Continue to website</button>
            </footer>
          </div>
        </div>
      ), document.body)}
    </>
  );
}

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { provinceLeadership } from "@/data/provinceLeadership";

export function ProvinceTeamGallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openButtons = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (selected === null) return;
    document.body.classList.add("team-lightbox-open");
    closeRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelected(null);
        window.requestAnimationFrame(() => openButtons.current[selected]?.focus({ preventScroll: true }));
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSelected((current) => current === null ? null : (current + 1) % provinceLeadership.length);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSelected((current) => current === null ? null : (current + provinceLeadership.length - 1) % provinceLeadership.length);
      }
      if (event.key === "Tab") {
        const focusable = [...document.querySelectorAll<HTMLElement>(".team-lightbox__dialog button, .team-lightbox__dialog a")];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("team-lightbox-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  const close = () => {
    const previouslySelected = selected;
    setSelected(null);
    if (previouslySelected !== null) window.requestAnimationFrame(() => openButtons.current[previouslySelected]?.focus({ preventScroll: true }));
  };

  const member = selected === null ? null : provinceLeadership[selected];

  return (
    <>
      <div className="province-team-grid">
        {provinceLeadership.map((person, i) => (
          <article className={`province-team-card${i === 0 ? " province-team-card--superior" : ""}`} key={person.name}>
            <button
              type="button"
              className="province-team-card__image"
              ref={(element) => { openButtons.current[i] = element; }}
              onClick={() => setSelected(i)}
              aria-label={`View full portrait of ${person.name}, ${person.role}`}
            >
              <img src={person.image} alt={`${person.name} — ${person.role}`} width={1054} height={1492} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
              <span className="province-team-card__action" aria-hidden="true">View full portrait <span>↗</span></span>
            </button>
          </article>
        ))}
      </div>
      {member && createPortal(
        <div className="team-lightbox" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <div className="team-lightbox__dialog" role="dialog" aria-modal="true" aria-label={`${member.name} portrait`}>
            <button ref={closeRef} className="team-lightbox__close" type="button" onClick={close} aria-label="Close portrait">×</button>
            <button className="team-lightbox__prev" type="button" onClick={() => setSelected((selected! + provinceLeadership.length - 1) % provinceLeadership.length)} aria-label="Previous portrait">‹</button>
            <img src={member.image} alt={`${member.name} — ${member.role}`} width={1054} height={1492} />
            <button className="team-lightbox__next" type="button" onClick={() => setSelected((selected! + 1) % provinceLeadership.length)} aria-label="Next portrait">›</button>
            <div className="team-lightbox__footer">
              <span>{selected! + 1} / {provinceLeadership.length}</span>
              <a href={member.image} target="_blank" rel="noopener noreferrer">Open original image ↗</a>
            </div>
          </div>
        </div>, document.body)}
    </>
  );
}

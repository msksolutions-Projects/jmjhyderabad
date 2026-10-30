import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { slides, type Slide } from "./slides";

const INTERVAL = 6000;
const srcSet = (base: string) => `${base}-sm.webp 600w, ${base}-md.webp 1000w, ${base}.webp 1600w`;

/**
 * How far a photo's shape may differ from the banner before it is shown whole
 * (over a soft blurred copy of itself) instead of being cropped to fill.
 * 0.72 → a photo may lose at most ~28% of its width or height to cropping.
 */
const COVER_TOLERANCE = 0.72;

function fitFor(slide: Slide, stageRatio: number): "cover" | "contain" {
  if (slide.fit) return slide.fit;
  if (!stageRatio) return "cover";
  const photoRatio = slide.width / slide.height;
  const similarity = Math.min(photoRatio, stageRatio) / Math.max(photoRatio, stageRatio);
  return similarity >= COVER_TOLERANCE ? "cover" : "contain";
}

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [stageRatio, setStageRatio] = useState(0);
  // Only the first slide is fetched up front (fast first paint); neighbours follow once the page is idle.
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0]));
  const indexRef = useRef(index);
  indexRef.current = index;
  const touchX = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const preload = useCallback((n: number) => {
    setLoaded((prev) => {
      const add = [n, (n + 1) % slides.length, (n - 1 + slides.length) % slides.length].filter((i) => !prev.has(i));
      return add.length ? new Set([...prev, ...add]) : prev;
    });
  }, []);

  const go = useCallback(
    (next: number) => {
      const n = ((next % slides.length) + slides.length) % slides.length;
      setIndex(n);
      preload(n);
    },
    [preload],
  );

  // Measure the banner so each photo can choose between filling it and being shown whole.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width && height) setStageRatio(width / height);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Fetch the neighbouring slides after the page has finished its first load.
  useEffect(() => {
    const later = () => preload(0);
    if (document.readyState === "complete") {
      const t = window.setTimeout(later, 1200);
      return () => window.clearTimeout(t);
    }
    const onLoad = () => window.setTimeout(later, 600);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, [preload]);

  useEffect(() => {
    if (!playing || hovered || reduceMotion) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") go(indexRef.current + 1);
    }, INTERVAL);
    return () => window.clearInterval(timer);
  }, [playing, hovered, reduceMotion, go]);

  return (
    <section
      className="hero-gallery"
      aria-roledescription="carousel"
      aria-label="Province photographs"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(index + 1);
        if (event.key === "ArrowLeft") go(index - 1);
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <h1 className="visually-hidden">Congregation of Jesus Mary Joseph — Hyderabad Province</h1>
      <div className="hero-gallery__stage" ref={stageRef}>
        {slides.map((slide, i) => {
          const active = i === index;
          const show = loaded.has(i);
          const fit = fitFor(slide, stageRatio);
          const imgProps = {
            src: `${slide.base}-md.webp`,
            srcSet: srcSet(slide.base),
            sizes: "100vw",
            width: slide.width,
            height: slide.height,
            loading: (i === 0 ? "eager" : "lazy") as "eager" | "lazy",
            decoding: (i === 0 ? "sync" : "async") as "sync" | "async",
          };
          return (
            <figure
              key={slide.base}
              className={`hero-gallery__slide hero-gallery__slide--${fit}${active ? " is-active" : ""}`}
              aria-hidden={!active}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
            >
              {show && (
                <>
                  {fit === "contain" && (
                    // Same file as the photo (no extra download), blurred to fill the sides softly.
                    <img {...imgProps} className="hero-gallery__backdrop" alt="" aria-hidden="true" />
                  )}
                  <img
                    {...imgProps}
                    className="hero-gallery__photo"
                    alt={slide.alt}
                    style={fit === "cover" && slide.focus ? { objectPosition: slide.focus } : undefined}
                    {...{ fetchpriority: i === 0 ? "high" : "low" }}
                  />
                </>
              )}
            </figure>
          );
        })}
      </div>

      <div className="hero-gallery__controls">
        <button type="button" className="hero-gallery__arrow hero-gallery__arrow--prev" onClick={() => go(index - 1)} aria-label="Previous slide">
          <Icon name="chevronLeft" />
        </button>
        <button type="button" className="hero-gallery__arrow hero-gallery__arrow--next" onClick={() => go(index + 1)} aria-label="Next slide">
          <Icon name="chevronRight" />
        </button>
        <div className="hero-gallery__bar">
          <div className="hero-gallery__dots">
            {slides.map((slide, i) => (
              <button
                key={slide.base}
                type="button"
                className="hero-gallery__dot"
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <span className="hero-gallery__count" aria-live={playing && !hovered ? "off" : "polite"}>
            {index + 1} / {slides.length}
          </span>
          {!reduceMotion && (
            <button
              type="button"
              className="hero-gallery__play"
              onClick={() => setPlaying((value) => !value)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            >
              {playing ? (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

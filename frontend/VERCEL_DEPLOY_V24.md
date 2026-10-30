# JMJ Hyderabad Province — Version 24 (production-ready frontend)

## What changed since V23

### Homepage banner (all devices)
- Banner height is now set per device: 4:3 on phones, 16:9 on tablets, a wide frame on desktops capped so the
  photo always fits on screen under the header (no scrolling to see the whole banner).
- Each photo picks how to display itself automatically. If it is close to the banner's shape it fills the frame.
  If it isn't (portraits, group photos on wide screens) it is shown whole over a soft blurred copy of itself, so
  heads are never cut off and there are no flat coloured side panels. Change `COVER_TOLERANCE` in
  `src/features/home/HeroSlider.tsx` to make it crop more or less. Set `fit: "cover"` or `fit: "contain"` on a slide
  in `slides.ts` to force one mode for that slide.
- Phones: the 13 slide dots used to wrap into three rows over the middle of the photo. Phones now show a small
  "3 / 13" counter and a pause button in the corner. Swipe or use the arrows to change slides.
- Only the first banner photo loads at first. The neighbouring slides load after the page has finished loading.
  The slideshow pauses while the browser tab is hidden.

### Speed
- The Playfair Display heading font is now self-hosted and preloaded. It replaces the render-blocking Google Fonts request.
- Homepage portraits (Founder, Mary Glowrey, Superior General) are now WebP files. They dropped from 220 KB to 26 KB.
- Vercel now sends caching headers for `/media`, `/brand`, `/documents` (30 days) and `/data` (1 hour).
  `index.html` is always revalidated, so new deployments show up immediately.

### Fixes
- Province Assembly popup:
  - The invitation used to make the dialog jump while it loaded, giving a layout-shift score of 0.62 on mobile. This no longer happens.
  - The bottom of the invitation was cut off on laptops. The whole invitation now shows.
  - The popup opens automatically only until the end of 31 Oct 2026 (IST). After that, visitors can still open it
    from the "View invitation" ticker. To change the date, edit `AUTO_OPEN_UNTIL` in `ProvinceAssemblyAnnouncement.tsx`.
- `/api/*` and `/uploads/*` are no longer rewritten to `index.html` on Vercel. Before, a missing backend could return
  the HTML page as if it were data. The contact form now reports success only when the API confirms it.
- Accessibility: "Read More" links now carry hidden context for screen readers, and the ticker button's spoken label
  matches its visible text.

## Test results (production build)
- Typecheck, ESLint (0 warnings) and 98/98 unit tests pass (`npm run check`).
- Lighthouse desktop: Performance 99 · Accessibility 100 · Best Practices 100 · SEO 100 (CLS 0.005).
- Lighthouse mobile (slow 4G simulation): Performance 84 · Accessibility 100 · Best Practices 100 · SEO 100 (CLS 0).
  On the Assembly day the popup's invitation image is the largest element. Mobile LCP improves once the popup
  stops opening by itself.
- 12 pages checked at 360, 390, 768, 1024, 1440 and 1920 px wide: no horizontal scrolling and no script errors.

## Deploy on Vercel
1. Push the `frontend/` folder to GitHub. In Vercel, set **Root Directory = `frontend`**.
2. `vercel.json` already sets the framework (Vite), `npm ci`, `npm run build` and the `dist` output folder.
3. Environment variables:
   - `VITE_SITE_URL`: your live address, e.g. `https://jmjhyderabadprovince.org`
   - `VITE_API_BASE_URL`: your backend, e.g. `https://your-api/api/v1`. Without it, news uploads, the admin area and
     the contact form will not work. Static pages and photos work without a backend.
4. Deploy, open the deployment URL, check it, then promote it to Production.

## Local
```bash
cd frontend
npm ci
npm run check   # types + lint + tests
npm run build   # output in dist/
npm run preview # http://localhost:4173
```

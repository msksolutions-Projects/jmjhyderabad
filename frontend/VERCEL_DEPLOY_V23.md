# JMJ Hyderabad Province — Version 23 (frontend only)

This package contains the complete React + Vite frontend. It does **not** contain a backend or `node_modules`.

## Homepage changes

- Header congregation title: **Playfair Display** (Google Fonts, with serif fallbacks).
- The first three homepage cards use the existing original assets:
  - Founder: `/brand/congregation-founder.png`
  - Ven. Mary Glowrey: `/brand/congregation-mary-glowrey.png`
  - Message from Superior General: `/brand/congregation-superior-general.png`
- The Superior General card's **Read More** now stays within this website at `/message-from-superior-general`.
- The **Provincial Superior's** separate message is still at `/province/provincial-message`; the Province Team gallery remains at `/province/teams`.
- The photo carousel spans the **full page width**, fills the slide area without blue side panels, and places navigation inside the photograph rather than in a blue strip. Images use `object-fit: cover`; some edges are cropped to fill the frame.
- The earlier Province Assembly announcement overlap fix is retained.

## Vercel deployment

1. Extract the ZIP; it contains a top-level `frontend/` folder.
2. Upload the **complete folder** to your GitHub repository. If the repository root contains `frontend/`, set Vercel **Root Directory = frontend**.
3. Vercel Framework Preset: **Vite**.
4. Install Command: `npm ci`; Build Command: `npm run build`; Output Directory: `dist`.
5. Set `VITE_SITE_URL` to your public production site URL.
6. Deploy a **new commit** from the updated source. In Vercel, open the newly built deployment's unique URL and verify it before promoting it to Production. Redeploying an older deployment does not pick up these changes.

The included `vercel.json` keeps client-side routes working on direct visits and refreshes.

## Local checks

```bash
cd frontend
npm ci
npm run check
npm run build
```

Static pages and images work without an API. Database-powered news, uploads, administration, and contact delivery need the existing backend URL through `VITE_API_BASE_URL`.

## Patch-only alternative

The separate V23 patch ZIP is only for projects already running **exactly Version 22**. Extract it over that project's parent folder and overwrite the included source files. For other versions use the complete V23 ZIP.

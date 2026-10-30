# JMJ Hyderabad Province — Vercel frontend deployment

This package contains the complete **frontend** source, public photos, documents, and Vercel routing configuration. It does **not** contain the backend or `node_modules`.

## Deploy from GitHub

1. Upload the `frontend` folder to a GitHub repository (it may be the repository root).
2. In Vercel, select **Add New → Project** and import the repository.
3. If the repository contains a top-level `frontend` directory, set **Root Directory** to `frontend`. Otherwise leave the root as-is.
4. Framework preset: **Vite**.
5. Install command: `npm ci`.
6. Build command: `npm run build`.
7. Output directory: `dist`.
8. Deploy. The included `vercel.json` handles direct visits and refreshes on React routes.

## Optional environment variables

- `VITE_SITE_URL=https://jmjhyderabadprovince.org` — the eventual public site URL (used for canonical URLs and sitemap).
- `VITE_API_BASE_URL=https://YOUR-API-DOMAIN/api/v1` — required **if** the public news, notices, gallery uploads, contact form, or admin must communicate with your existing backend. Do not use localhost for production.
- `VITE_WHATSAPP_NUMBER` and `VITE_GA_ID` are optional.

Static frontend pages, included images, documents, navigation and the Provincial Superior's message deploy without a backend. Server-backed data and admin operations still require a separately running API.

## Test locally

```sh
npm ci
npm run check
npm run build
npm run preview
```

The verified ZIP intentionally excludes `dist` and `node_modules`; Vercel rebuilds these from `package.json` and `package-lock.json`.

## Version 20 changes

- Elegant serif masthead typography with the original JMJ emblems.
- Soft blue, warm ivory and pale-gold gradient backgrounds.
- Official supplied Provincial Superior message image, with an accessible transcript at `/province/provincial-message`.
- Invitation popup moved above the sticky navigation with separate invitation and programme tabs; improved mobile sizing and scroll containment.
- Removed the deliberately blurred fill layer and zoom effect from home banners.

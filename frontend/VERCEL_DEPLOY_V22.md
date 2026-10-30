# JMJ Hyderabad Province — Version 22 frontend deployment

This is the complete **frontend-only** Vercel-ready project. It includes the Version 21 Provincial Team changes and a new fix for the Province Assembly announcement bar.

## Version 22 UI fix

- The Province Assembly 2026 announcement previously rendered two long, scrolling copies that overlapped at narrow widths. Both scrolling copies and the marquee animation have been removed.
- The announcement now has three clear elements: **Province Assembly 2026**, a concise date/theme line, and **View invitation**.
- On desktop, the central text is confined to its own space and truncates cleanly if the viewport is too narrow.
- On mobile, the label and invitation button occupy the first row; the announcement wraps in a full-width second row without crossing either control.
- The invitation and programme popup still opens from either part of the announcement.

## Deploy to Vercel

1. Extract the ZIP. Its top-level folder is `frontend`; no backend is included.
2. Push `frontend` to GitHub. Import the repository into Vercel.
3. Set **Root Directory** to `frontend` if it is a subfolder in the repository.
4. Choose Framework **Vite**, Install `npm ci`, Build `npm run build`, Output `dist`.
5. Set `VITE_SITE_URL` to your final website URL, e.g. `https://jmjhyderabadprovince.org`.
6. If needed for live backend data or admin, set `VITE_API_BASE_URL` to your existing public API URL.
7. Deploy. The included `vercel.json` supports React Router navigation and refreshes.

## Local verification

```bash
cd frontend
npm ci
npm run check
npm run build
```

Static content and images work without a backend. Database-powered news, administration, file uploads, and contact delivery require the existing API.

## Small patch alternative

If you already have the exact Version 21 project, extract `JMJ1_v22_Announcement_UI_Fix_Only.zip` into its **parent directory**, allowing the files under `frontend/src` to overwrite their Version 21 counterparts. Run `npm run build` and redeploy. For a fresh deployment, use the complete Version 22 ZIP.

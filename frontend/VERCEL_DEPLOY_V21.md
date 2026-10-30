# JMJ Hyderabad Province — Vercel frontend deployment (Version 21)

This ZIP contains the **complete frontend** (React, Vite and TypeScript source, all public images, documents, routes, and Vercel configuration). It deliberately excludes the backend, `node_modules`, and generated `dist` files.

## Deploy with Vercel

1. Extract the complete ZIP. It will contain one top-level folder, `frontend`.
2. Upload the contents of `frontend` to a GitHub repository, or upload the repository with `frontend` as a subfolder.
3. In Vercel, select **Add New → Project**, then import that repository.
4. If your repository contains the parent folder, set **Root Directory** to `frontend`. If the repository root is already the frontend itself, leave this blank.
5. Set **Framework Preset: Vite**, **Install Command: `npm ci`**, **Build Command: `npm run build`**, and **Output Directory: `dist`**.
6. Deploy. The included `vercel.json` handles direct opening and refreshes of internal React pages, including `/province/teams` and `/province/provincial-message`.

## Important environment variables

- `VITE_SITE_URL=https://jmjhyderabadprovince.org` — use the final intended public domain for canonical links and sitemap.
- `VITE_API_BASE_URL=https://YOUR-EXISTING-API-DOMAIN/api/v1` — set to your **actual** public API URL if you want live news, gallery uploads, contact form, and administration to work. Never set `localhost` in production.
- `VITE_WHATSAPP_NUMBER` and `VITE_GA_ID` are optional.

The included public pages, uploaded team portraits, and Provincial Superior’s message are static and render without a backend. **Database-backed content and admin functions still need the existing external API**. No backend folder is included.

## Local checks

```bash
cd frontend
npm ci
npm run check
npm run build
npm run preview
```

## Version 21 updates

- Fixed the homepage message card: **Read More** now uses internal React navigation to `/province/provincial-message` instead of opening `congregationjmj.org/message-from-superior-general`.
- Updated the title and image to match **Sr. Pauline Nusi, Provincial Superior** of the Hyderabad Province.
- Replaced the old archived roster at `/province/teams` with five complete official team portrait cards: Sr. Pauline Nusi, Sr. Showrilu Gundiga, Sr. Thangam Puliyani, Sr. Nirmala Jaddu, and Sr. Fathima Mary Singareddy.
- Updated the **Provincial Council** page to use the same five portraits, including the previously missing Sr. Nirmala Jaddu.
- Added a mobile-friendly team gallery, blue–ivory–gold gradients, larger spacing, accessible full-size portrait viewer with keyboard navigation, and local navigation to related pages.
- Preserved Version 20’s serif masthead, Provincial Superior artwork, gradient backgrounds, popup improvements, and sharp banner presentation.

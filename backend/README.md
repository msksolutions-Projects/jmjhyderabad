# JMJ Hyderabad Province — API (admin backend)

The server behind the website's admin area (`/admin`).

| Who | Can do |
|---|---|
| **Visitors** | Read published news, notices and gallery photos; send the Contact form |
| **Admins** (signed in) | Add, edit and delete news, notices and gallery photos (single or bulk); attach PDF / Word / Excel / photos; read and manage contact messages; change password |

Drafts are never shown to visitors. The first admin account is created at `/admin/register`;
after that, registration closes automatically.

Built with Node.js, Express, MongoDB (Mongoose) and Cloudinary.

---

## Going live (one time, about 30 minutes)

You need three free accounts: **MongoDB Atlas** (database), **Cloudinary** (photos and files)
and **Render** (runs this server). Then one setting in **Vercel** connects the website.

### 1. MongoDB Atlas — the database
1. Sign up at mongodb.com/atlas and create a **free (M0)** cluster. Pick a region near India (e.g. Mumbai).
2. **Database Access** → *Add New Database User*: choose a username and a strong password.
3. **Network Access** → *Add IP Address* → **Allow access from anywhere** (`0.0.0.0/0`).
   Render's free plan has no fixed address, so this is needed; the database password still protects it.
4. **Connect** → *Drivers* → copy the connection string. Replace `<password>` with the password from step 2,
   and add the database name `jmj_hyderabad` before the `?`:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/jmj_hyderabad?retryWrites=true&w=majority`

### 2. Cloudinary — photos and documents
1. Sign up at cloudinary.com (free plan).
2. Dashboard → **API Keys**: note the *Cloud name*, *API Key* and *API Secret*.

### 3. Render — runs this server
1. Sign up at render.com with your GitHub account.
2. **New** → **Web Service** → choose the `jmjhyderabad` repository.
3. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm ci`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. **Environment Variables** — add:

   | Name | Value |
   |---|---|
   | `MONGODB_URI` | the connection string from step 1 |
   | `JWT_SECRET` | 48 random characters (see `.env.example` for a PowerShell command) |
   | `CLOUDINARY_NAME` | from step 2 |
   | `CLOUDINARY_KEY` | from step 2 |
   | `CLOUDINARY_SECRET` | from step 2 |
   | `NODE_ENV` | `production` |

5. **Create Web Service**. When the log shows `API running`, open
   `https://YOUR-SERVICE.onrender.com/api/v1/health` — it should say `"status":"OK"`.

### 4. Vercel — connect the website
1. Vercel → project **jmjhyderabad** → **Settings** → **Environment Variables**.
2. Add `VITE_API_BASE_URL` = `https://YOUR-SERVICE.onrender.com/api/v1` (Production).
3. **Deployments** → latest → **⋯** → **Redeploy** (the setting is used when the site is built).

### 5. Create the first admin
Open `https://jmjhyderabad.vercel.app/admin/register`, enter your name, email and a strong password.
From then on, sign in at `/admin/login`.

> **Free plan note:** Render puts the server to sleep after 15 minutes without visitors. The first
> request afterwards takes about 30–50 seconds; the website waits for it. Upgrade the Render
> instance if this becomes a nuisance.

---

## Running on your computer

```bash
cd backend
npm install
copy .env.example .env      # then fill in MONGODB_URI and JWT_SECRET
npm run dev                 # API on http://localhost:5000
```
In another terminal: `cd frontend` → `npm run dev`. The website forwards `/api` to port 5000.

## Tests
```bash
TEST_MONGODB_URI=mongodb://127.0.0.1:27017 npm test
```
Covers sign-in and lockout, first-admin setup, news / notices / gallery / uploads / contact, and that
visitors can neither see drafts nor change anything. Uses a temporary database that is deleted afterwards.

## API overview (`/api/v1`)

| Route | Visitors | Admins |
|---|---|---|
| `GET /auth/setup-status` · `POST /auth/register` · `POST /auth/login` | ✓ | ✓ |
| `POST /auth/logout` · `GET /auth/verify` · `GET /auth/me` · `POST /auth/change-password` | | ✓ |
| `GET /news` · `GET /news/:id` (published only for visitors) | ✓ | ✓ |
| `POST /news` · `PUT /news/:id` · `DELETE /news/:id` | | ✓ |
| `GET /notices` · `GET /notices/:id` (published, unexpired for visitors) | ✓ | ✓ |
| `POST /notices` · `PUT /notices/:id` · `DELETE /notices/:id` | | ✓ |
| `GET /gallery` (published only for visitors) | ✓ | ✓ |
| `POST /gallery` (photo upload) · `PUT /gallery/:id` · `DELETE /gallery/:id` | | ✓ |
| `POST /uploads` · `DELETE /uploads` (attachments) | | ✓ |
| `POST /contact` (Contact form, max 5 per 15 min) | ✓ | ✓ |
| `GET /contact` · `PATCH /contact/:id` · `DELETE /contact/:id` | | ✓ |
| `GET /admin/stats` · `GET /admin/analytics` | | ✓ |

**Security:** passwords hashed with bcrypt; sign-in tokens expire after 24 hours; an account locks for
15 minutes after 5 wrong passwords; sign-in limited to 20 attempts per 15 minutes per visitor; only the
website's own address may call the API from a browser; database-injection filtering; security headers.

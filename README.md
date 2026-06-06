# DevPrep AI

A developer interview preparation app built with **Next.js App Router**. Track coding questions, mark them solved/unsolved, monitor topic progress, plan revisions, and maintain a daily streak.

## Features

- Save coding questions with topic, difficulty, and notes
- Mark questions as solved or unsolved
- Topic-wise progress tracking
- Revision planner for due questions
- Daily streak check-in

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM + **Turso** (SQLite in the cloud)

---

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Turso

**Option A — Turso dashboard (recommended on Windows, no CLI needed)**

1. Sign up at [turso.tech](https://turso.tech) and open the dashboard
2. Click **Create database** → name it `dev-prep`
3. Open the database → copy the **Database URL** (`libsql://...`)
4. Create an **auth token** from the same page
5. Copy `.env.example` to `.env` and paste your credentials:

   ```env
   TURSO_DATABASE_URL="libsql://dev-prep-xxxxx.turso.io"
   TURSO_AUTH_TOKEN="eyJ..."
   DATABASE_URL="libsql://dev-prep-xxxxx.turso.io"
   ```

**Option B — Turso CLI (optional)**

The old Windows command `irm get.tur.so/install.ps1 | iex` is broken (404). Use one of these instead:

**Windows (WSL):**
```bash
wsl
curl -sSfL https://get.tur.so/install.sh | bash
turso auth login
turso db create dev-prep
turso db show dev-prep --url
turso db tokens create dev-prep
```

**macOS:**
```bash
brew install tursodatabase/tap/turso
# or: curl -sSfL https://get.tur.so/install.sh | bash
```

**Linux:**
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

### 3. Apply migrations and seed

```bash
npm run db:deploy   # push schema to Turso
npm run db:seed     # optional sample data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Offline fallback:** If Turso env vars are not set, the app falls back to a local `file:./dev.db`. For production/Vercel, always use Turso.

---

## Deploy to Vercel

### 1. Push code to GitHub

Make sure `prisma/migrations/` is committed (including `migration_lock.toml`).

### 2. Create Turso database (if you haven't already)

Use the same steps as local setup. You can use one Turso DB for both local dev and production, or create a separate `dev-prep-prod` database.

### 3. Apply migrations to Turso (one time)

From your machine with `.env` configured:

```bash
npm run db:deploy
```

### 4. Import project on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repo
2. Vercel auto-detects Next.js — no custom build command needed

### 5. Add environment variables

In Vercel → Project → **Settings** → **Environment Variables**, add:

| Name | Value |
|------|-------|
| `TURSO_DATABASE_URL` | `libsql://...` from `turso db show` |
| `TURSO_AUTH_TOKEN` | token from `turso db tokens create` |
| `DATABASE_URL` | same as `TURSO_DATABASE_URL` |

Apply to **Production**, **Preview**, and **Development**.

### 6. Redeploy

Trigger a new deploy. The build should pass because Turso is reachable at build time (for ISR / `generateStaticParams`).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:deploy` | Apply SQL migrations to Turso |
| `npm run db:seed` | Seed sample questions |
| `npm run db:migrate` | Create new migration (local schema changes) |

---

## Next.js concepts covered

| Concept | Where |
|---------|-------|
| File-based routing | `/`, `/questions`, `/questions/[id]`, `/topics`, `/revision`, `/about` |
| Layouts | `app/layout.tsx` with shared navbar |
| SSR | Dashboard, questions list, revision planner |
| SSG | About page |
| ISR | Question detail, topics page |
| API Routes | `/api/questions`, `/api/questions/[id]`, `/api/streak` |
| Server Actions | Toggle solved, schedule revision, streak, delete |
| Database | Turso (libSQL) + Prisma ORM |

## API Routes vs Server Actions

- **API Routes** — create/edit questions via `POST` and `PUT` from the form
- **Server Actions** — one-click UI updates (toggle solved, revision, streak, delete)

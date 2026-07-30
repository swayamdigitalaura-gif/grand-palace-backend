# The Grand Palace — Admin Backend

Node.js + Express API, backed by PostgreSQL (hosted on Neon for now) via Prisma.

## What this gives you
- `POST /api/auth/login` — admin login (email + password → session cookie)
- `GET/POST/PATCH/DELETE /api/menu/...` — menu categories & items (à la carte, set menu, beverages)
- `GET/POST/PATCH/DELETE /api/gallery/...` — gallery photos, plus `/api/gallery/upload` for uploading a photo file
- `GET/POST/PATCH/DELETE /api/pages/...` — "What's On" style content pages (title, sections, images, CTA) — new pages are just new rows, no code changes

All `GET` routes are public (the website reads from these). All write routes (`POST`/`PATCH`/`DELETE`) require an admin login.

## One-time setup

1. **Create a free Neon Postgres database**: go to https://neon.tech, sign up, create a project, and copy the connection string it gives you (looks like `postgresql://user:pass@host/dbname?sslmode=require`).

2. **Install dependencies**:
   ```
   cd backend
   npm install
   ```

3. **Configure environment**: copy `.env.example` to `.env` and paste in your Neon connection string:
   ```
   cp .env.example .env
   ```
   Then edit `.env` and set `DATABASE_URL` to the Neon string, and pick a real `ADMIN_PASSWORD`.

4. **Create the database tables**:
   ```
   npm run prisma:migrate
   ```
   (This reads `prisma/schema.prisma` and creates the tables on your Neon database.)

5. **Create your admin login**:
   ```
   npm run seed
   ```
   This prints the email/password you can log in with (from your `.env`).

6. **Run the server**:
   ```
   npm run dev
   ```
   The API is now running at `http://localhost:4000`.

## Browsing the database visually
```
npm run prisma:studio
```
Opens a browser tab where you can see/edit every table directly — handy for checking data without building the admin UI first.

## Note on Neon being "temporary"
Neon's free tier is a normal hosted Postgres database — nothing about it is inherently temporary. If you meant "temporary while we build this," that's fine: the connection string is the only thing tying us to Neon. If you later want to move to a different Postgres host (Supabase, Railway, RDS, etc.), it's just a one-line `DATABASE_URL` change — nothing else in this backend needs to change.

## Not built yet
- The actual admin **panel UI** (the web pages you'll log into to edit things) — this repo is the API only, so far.
- Wiring the main website (`palace-art-reimagined-main`) to fetch from this API instead of its hardcoded arrays.
- Cloud photo storage for production (uploads currently save to a local `uploads/` folder on this server's disk, which works for local development but won't persist on most serverless hosts — fine for now, worth revisiting before going live).

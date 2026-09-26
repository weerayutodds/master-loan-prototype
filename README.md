This is the Master Loan Prototype — a Next.js loan application flow, bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

This project needs a Postgres database. For local development, start one with Docker:

```bash
cp .env.example .env
docker compose up -d
```

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment variables

The app reads a single environment variable, set in `.env` (see `.env.example`):

- `DATABASE_URL` — Postgres connection string used by `src/lib/db.ts`. In production this should be your Supabase **transaction pooler** connection string (the client is configured with `prepare: false` to match).

## Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import this repo from GitHub.
2. Vercel auto-detects the Next.js framework preset — leave build/output settings at their defaults.
3. Before the first deploy, add an environment variable in Project Settings → Environment Variables:
   - `DATABASE_URL` = your Supabase transaction pooler connection string, for the **Production** environment (add it to Preview too if preview deployments should hit the same database).
4. Deploy.
5. Verify: open the deployed URL and go through `/ratebook` → `/customer-form` → `/customer-lead-list`, submit a lead, and confirm it appears in the list.

The `db/schema.sql` file is the source of truth for the database schema — it must already be applied to whichever Postgres database `DATABASE_URL` points to (Vercel does not run it automatically; it's only auto-applied to the local Docker Postgres via `docker-compose.yml`).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

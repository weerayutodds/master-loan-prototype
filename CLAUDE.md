@AGENTS.md

# Project: Master Loan Prototype

## Goal
A prototype loan application flow — lets customers apply for and track the status of a loan.

## Stack
- Next.js (App Router, TypeScript, src/ dir)
- Tailwind CSS v4 (tokens in src/app/globals.css via @theme)
- Supabase Postgres via `postgres` package (server-side only, transaction pooler, prepare: false)
- Deploy on Vercel

## Pages
- / : Home — entry point for the loan application flow
- /ratebook : ทำรายการสินเชื่อ — customer/collateral lead intake form. Business flow: [docs/business-flows/ratebook.md](docs/business-flows/ratebook.md)
- /customer-form : ตรวจสอบข้อมูลลูกค้า — verify customer identity via simulated ID-card read or manual key-in before continuing. Business flow: [docs/business-flows/customer-form.md](docs/business-flows/customer-form.md)
- /customer-lead-list : ข้อมูลลูกค้า — summary card for the just-verified customer plus a list of all saved leads. Business flow: [docs/business-flows/customer-lead-list.md](docs/business-flows/customer-lead-list.md)

## Folder structure
```
src/
  app/                  # routes (pages + layouts)
  components/
    atoms/              # Button, Input, Badge, Icon
    molecules/          # FormField, SearchBar, Card
    organisms/          # Header, LoanTable, LoginForm
  lib/
    db.ts               # postgres client
    mock.ts             # mock data (until DB is connected)
    ratebook.ts         # loads + filters the generated ratebook rows
    ratebook-index.ts   # GENERATED brand list (npm run generate:ratebook)
    vehicle-options.ts  # one option shape over ratebook + mock catalogs
    actions/            # server actions, split by feature
  types/
db/
  schema.sql
CLAUDE.md
```

## Component rules (Atomic Design)
- atoms: smallest UI units, no business logic, no data fetching
- molecules: combine atoms, still no data fetching
- organisms: sections of a page, may receive data via props
- Pages in src/app/ fetch data (Server Components) and pass props down
- One component per file, named export, filename = ComponentName.tsx
- Use design tokens only. Never hardcode colors, font sizes, or spacing.
- Reuse existing components before creating new ones. Check components/ first.

## Data rules
- Database schema is in db/schema.sql (source of truth)
- All DB access only in src/lib/ and Server Actions. Never in client components.
- Use mock data in src/lib/mock.ts until told to connect the DB.
- Vehicle options and ราคาประเมิน for รถยนต์/มอเตอร์ไซค์ are NOT mock: they come
  from the ratebook workbooks in `Ratebook/*.xlsx`. Edit those, then run
  `npm run generate:ratebook` — never hand-edit `public/ratebook/**` or
  `src/lib/ratebook-index.ts`. รถบรรทุก/ที่ดิน still use src/lib/mock.ts.

## Code style
- Keep it simple and flat. No extra abstraction layers, no state library unless asked.
- Server Components by default; add "use client" only when interaction needs it.
- No new dependencies without asking first.

## Workflow
- Work one phase at a time. Stop and summarize changes after each task.
- If the Figma design is unclear, ask instead of guessing.
- For every new page/feature built from a Figma reference, also create or update a business flow doc under `docs/business-flows/<feature>.md` describing the click-by-click flow (trigger → result). Link it from the page's entry in the `## Pages` list above.

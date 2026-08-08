# Elite Escape Tourism

Luxury travel & tourism platform for the UAE market — bespoke holiday packages, visa
assistance, curated attractions, seasonal tours, and AI-assisted trip planning.

> "Your Escape, Our Elite Services — AI-Powered Travel, Human-Touched Service."

## Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Data layer**: Prisma ORM (`packages/web/prisma/schema.prisma`), targets PostgreSQL
- **API**: Next.js Route Handlers under `src/app/api/v1/*`
- **Auth**: JWT access tokens + rotating opaque refresh tokens, bcrypt password hashing, TOTP MFA
- **Payments**: Stripe Checkout
- **AI**: Anthropic API when `ANTHROPIC_API_KEY` is set, with an automatic
  deterministic fallback matcher when it isn't
- **Testing**: Jest (unit) + Playwright (E2E)

This intentionally uses a single Next.js + Prisma stack rather than a separate
Django service, to avoid maintaining duplicate business logic in two languages.

## What's implemented and verified in this environment

This sandbox has no running Postgres, Redis, or Docker daemon, and no live
Stripe/Anthropic keys. Everything below has actually been run here — typecheck,
lint, unit tests, a production build, and a real headless-browser pass over
every page (which is how the CSP misconfiguration described below was caught
before shipping, not assumed away):

- Full page set: home, holidays (+ package detail), visa, attractions (+
  detail), seasonal tours, about, contact, AI travel planner, client portal
- Design system (Elite Gold / Deep Navy / Travel Teal), shared UI primitives
- **Content** (destinations, packages, attractions, visa requirements) reads
  from `src/lib/data.ts` — this is editorial/catalogue data, not user data,
  so it doesn't need a live database and the site works out of the box
- **Transactional data** (users, bookings, visa applications, payments) is
  fully wired to Prisma/Postgres — code-complete and typechecked, but not
  live-tested end-to-end against a real database in this environment (see
  "Not verified" below)
- Auth: register/login/MFA(TOTP)/refresh/logout, bcrypt (cost 12), rotating
  refresh tokens (hashed at rest), RBAC (`ADMIN`/`TRAVEL_AGENT`/`CLIENT`/`PARTNER`)
- Bookings: public guest enquiry (matches the existing package-detail form,
  creates a lead account if the email is new) + authenticated "my bookings"
- Visa applications: same guest-or-authenticated pattern
- Stripe Checkout session creation + webhook handler (returns 503 until
  `STRIPE_SECRET_KEY` is set — never fakes a successful payment)
- AI Travel Planner: `/api/v1/ai/recommendations` and `/api/v1/ai/itinerary`
  call the Anthropic API via tool-use when `ANTHROPIC_API_KEY` is set;
  otherwise (or on any failure) they fall back to a deterministic
  keyword/rating matcher — the planner is never non-functional
- Security: bcrypt password hashing, HttpOnly/Secure/SameSite=strict cookies,
  15-minute access tokens + rotating refresh tokens, per-IP rate limiting on
  auth/booking/AI routes, Zod validation at every API boundary, security
  headers incl. a verified-working CSP (see note below), generic error
  messages (no stack traces)
- CI (`.github/workflows/ci.yml`): lint, typecheck, unit tests, build, E2E

### A note on the CSP

The first CSP draft used the nonce + `strict-dynamic` pattern from Next.js's
own docs. A real headless-browser run (not just curl) showed Next 14's App
Router doesn't apply that nonce to its own hydration scripts, which silently
broke every click handler on the site. The shipped CSP (`script-src 'self'
'unsafe-inline'`) is the accurate tradeoff for this Next version — see the
comment in `next.config.js`.

## What's deliberately out of scope

- The ~15 "skill" installs (taste-skill, impeccable, ui-ux-pro-max, ponytail,
  caveman, gstack, superpowers, etc.) named in the original brief — these are
  unverifiable third-party packages/marketplaces; installing and executing
  them sight-unseen is a supply-chain risk, not a coding decision.
- Embedding third-party AI-travel-planner projects (MyTripPlanner, Atlas,
  Voyage) or RAG visa assistants (AskKSA/Daleel) as live dependencies. The
  `/ai-travel-planner` page ships a first-party implementation with the same
  *shape* (interview-style chat, live notes panel, voice input) backed by a
  real first-party AI endpoint instead.
- A separate Django REST backend — see stack note above.
- Booking.com / Google Maps / ElevenLabs / Mapbox integrations — env vars are
  documented in `.env.example`, but no live calls are wired in.
- SMTP-based email (account verification, notifications) — new accounts are
  activated immediately rather than left in an unreachable "pending
  verification" state.

## Not verified in this environment (needs real infra)

- End-to-end auth/booking/payment flows against a live Postgres instance —
  `docker-compose.yml` provisions one locally; `prisma/migrations/` has the
  initial schema migration (generated with `prisma migrate diff
  --from-empty`, since this sandbox has no reachable Postgres to run
  `prisma migrate dev` against directly — the SQL itself is what `migrate
  dev` would have produced, just generated without a live connection).
- Live Stripe Checkout and webhook delivery (needs real API + webhook keys).
- Live Anthropic-backed AI responses (needs `ANTHROPIC_API_KEY`) — the
  fallback path is verified; the live-model path is code-complete but
  unexercised here.

## Deploying (Vercel)

1. **Import the repo**: Vercel dashboard → Add New → Project → import this
   GitHub repo.
2. **Root Directory**: set to `packages/web` (Project Settings → General —
   this is a monorepo, the Next.js app isn't at the repo root).
3. **Build command**: leave it on auto-detect — Vercel picks up the
   `vercel-build` script in `package.json` automatically
   (`prisma migrate deploy && next build`), which applies the migration in
   `prisma/migrations/` to whatever `DATABASE_URL` is set at build time.
4. **Add Postgres**: Storage tab → Marketplace → Neon (or Supabase) → create
   a database, attach it to this project. That sets a connection-string env
   var — copy its value into an env var literally named `DATABASE_URL` if
   the integration names it something else (e.g. `POSTGRES_URL`).
5. **Environment variables** (Project Settings → Environment Variables):

   | Variable | Required | Notes |
   | --- | --- | --- |
   | `DATABASE_URL` | Yes | From step 4 |
   | `JWT_SECRET` | Yes | Any long random string — generate with `openssl rand -base64 32` |
   | `JWT_REFRESH_SECRET` | Yes | Same, different value |
   | `FRONTEND_URL` | Yes | Your production URL, e.g. `https://your-project.vercel.app` (used for Stripe redirect URLs) |
   | `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | No | Payments return 503 until set |
   | `ANTHROPIC_API_KEY` | No | AI planner falls back to rule-based matching until set |

6. **Deploy**. Vercel builds and runs the migration automatically on every
   push to the branch you deploy from.
7. **Seed the catalogue** (destinations/packages) once, from your machine
   or this session if you share the `DATABASE_URL`:
   `DATABASE_URL="..." npm run prisma:seed` from `packages/web`.

## Getting started

```bash
cd packages/web
npm install
cp ../../.env.example .env   # then fill in a real DATABASE_URL etc.
npm run prisma:migrate       # once a Postgres instance is reachable
npm run prisma:seed          # loads the catalogue from src/lib/data.ts
npm run dev
```

Run the checks that back the claims above:

```bash
npm run lint
npm run typecheck
npm test           # Jest unit tests
npm run build
npm run test:e2e   # Playwright — starts its own prod server on :3100
```

## Docs

- [`docs/PRD.md`](docs/PRD.md) — product requirements
- [`docs/SAD.md`](docs/SAD.md) — security & access design

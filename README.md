# Elite Escape Tourism

Luxury travel & tourism platform for the UAE market — bespoke holiday packages, visa
assistance, curated attractions, seasonal tours, and AI-assisted trip planning.

> "Your Escape, Our Elite Services — AI-Powered Travel, Human-Touched Service."

## Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Data layer**: Prisma ORM schema (`packages/web/prisma/schema.prisma`), targets PostgreSQL
- **API**: Next.js Route Handlers under `src/app/api/*` (mock data for now — see below)

This intentionally uses a single Next.js + Prisma stack rather than a separate
Django service, to avoid maintaining duplicate business logic in two languages.
The Prisma schema and route-handler shape make it straightforward to swap in a
real Postgres instance and real integrations later.

## What's implemented

- Design system (Elite Gold / Deep Navy / Travel Teal) in `tailwind.config.js` + `globals.css`
- Homepage, Holidays (+ package detail), Visa, Attractions, Seasonal Tours,
  About, Contact, AI Travel Planner, and Client Portal pages
- Shared layout (header, footer, WhatsApp CTA)
- Booking form, package/destination cards, itinerary display
- AI Travel Planner UI: a chat-style itinerary assistant and a voice-input mock,
  built against local mock data — **not** wired to any third-party service
- Prisma schema matching the documented data model
- `docker-compose.yml` for Postgres + Redis + the web app
- `.env.example` covering the integrations a real deployment would need

## What's deliberately out of scope for this pass

- Any of the "skill" installs (taste-skill, impeccable, ui-ux-pro-max, ponytail,
  caveman, gstack, superpowers, etc.) — these are unverifiable third-party
  packages/marketplaces; installing and executing them sight-unseen is a
  supply-chain risk, not a coding decision.
- Embedding third-party AI-travel-planner projects (MyTripPlanner, Atlas,
  Voyage) or RAG visa assistants (AskKSA/Daleel) as live dependencies. Their
  APIs, licensing, and code quality aren't verifiable from here. The
  `/ai-travel-planner` page ships a first-party UI with the same *shape*
  (interview-style chat, live itinerary notebook, voice input) so a real
  integration can be dropped in later.
- A separate Django REST backend — see stack note above.
- Live Stripe/Booking.com/Google Maps/ElevenLabs integrations — the env vars
  are documented in `.env.example`, but no real API keys or network calls are
  wired in.
- Auth (JWT/MFA/RBAC), payments, and the full test/security suite described in
  the brief. These are real, substantial workstreams best done as their own
  follow-ups against a provisioned database rather than scaffolded blind.

## Getting started

```bash
cd packages/web
npm install
npm run dev
```

## Docs

- [`docs/PRD.md`](docs/PRD.md) — product requirements

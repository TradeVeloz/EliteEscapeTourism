# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Elite Escape Tourism — a luxury travel platform for the UAE market. See
`README.md` for stack decisions and current scope, `docs/SAD.md` for the
security control inventory.

## Structure

- `packages/web` — Next.js 14 (App Router) + TypeScript + Tailwind CSS. This
  is the only application package; there is no separate backend service.
- `packages/web/prisma/schema.prisma` — data model. `User`, `RefreshToken`,
  `Destination`, `Package`, `Booking`, `Payment`, `VisaApplication`.
- `packages/web/src/lib/data.ts` — editorial/catalogue content (destinations,
  packages, attractions, visa requirements). This is intentionally *not* in
  Postgres — it's content, not user data.
- `packages/web/src/lib/{prisma,auth,session,validation,rate-limit,stripe,ai,matcher}.ts`
  — the transactional backend: DB client, password/JWT/MFA helpers, request
  auth, Zod schemas, in-memory rate limiting, Stripe client, Anthropic client,
  and the deterministic AI-fallback matcher.
- `packages/web/src/app/api/v1/*` — Route Handlers. Auth, bookings, and visa
  routes hit Prisma; AI routes call Anthropic when configured and otherwise
  fall back automatically; content routes (destinations/packages) read
  `lib/data.ts`.
- `docs/` — product and security docs.

## Conventions

- Design tokens (colors, fonts) live in `tailwind.config.js` and
  `src/app/globals.css` — reuse `btn-primary` / `btn-secondary` / `btn-ghost`,
  `card-elevated`, `eyebrow`, and `container-elite` rather than
  reintroducing one-off styles.
- Brand colors: Elite Gold `#C9A24E`, Deep Navy `#0F2B3D`, Travel Teal
  `#1A7A6A`.
- No `any` in TypeScript; validate every API route body with a Zod schema
  from `src/lib/validation.ts` (add one there if it doesn't exist yet).
- Auth boundary: `getAuthUser(request)` / `hasRole(...)` from
  `src/lib/session.ts` inside Route Handlers (Node runtime). Don't try to
  verify JWTs in `middleware.ts` if one gets reintroduced — Edge runtime
  can't run `jsonwebtoken`.
- Any change to `next.config.js`'s CSP or to hydration-affecting code needs
  a real headless-browser check (Playwright), not just `curl` — see the CSP
  note in README.md for why a curl-only check missed a real breakage here.
- Don't add third-party AI/travel-data integrations (Booking.com, Google
  Maps, ElevenLabs, MyTripPlanner/Atlas/Voyage/AskKSA, etc.) or install
  unverified third-party "skill" packages without explicit instruction —
  see README.md for why.

## Commands

```bash
cd packages/web
npm install         # runs `prisma generate` via postinstall
npm run dev         # local dev server
npm run lint
npm run typecheck
npm test            # Jest unit tests
npm run build       # production build — run this before considering a change done
npm run test:e2e    # Playwright — builds/starts its own server on :3100
```

`npm run build` and `npm run typecheck` need a syntactically valid
`DATABASE_URL` in the environment (Prisma validates it even without
connecting) — see `packages/web/.env` (gitignored) for the local dev value.

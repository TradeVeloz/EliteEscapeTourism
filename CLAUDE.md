# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Elite Escape Tourism — a luxury travel platform for the UAE market. See
`README.md` for stack decisions and current scope.

## Structure

- `packages/web` — Next.js 14 (App Router) + TypeScript + Tailwind CSS. This
  is the only application package right now; there is no separate backend
  service.
- `packages/web/prisma/schema.prisma` — data model. Not yet connected to a
  live database.
- `packages/web/src/lib/data.ts` — mock data used by every page today.
  Treat this as the seam to replace with real Prisma queries / API calls.
- `docs/` — product and process docs.

## Conventions

- Design tokens (colors, fonts) live in `tailwind.config.js` and
  `src/app/globals.css` — reuse `btn-primary` / `btn-secondary` / `btn-ghost`,
  `card-elevated`, `eyebrow`, and `container-elite` rather than
  reintroducing one-off styles.
- Brand colors: Elite Gold `#C9A24E`, Deep Navy `#0F2B3D`, Travel Teal
  `#1A7A6A`.
- No `any` in TypeScript; validate at API route boundaries (see
  `src/app/api/v1/bookings/route.ts` for the pattern).
- Don't add third-party AI/travel-data integrations (Booking.com, Google
  Maps, ElevenLabs, etc.) without explicit instruction — those are
  unimplemented by design; see `README.md` for why.

## Commands

```bash
cd packages/web
npm install
npm run dev      # local dev server
npm run build    # production build — run this before considering a change done
npm run lint
```

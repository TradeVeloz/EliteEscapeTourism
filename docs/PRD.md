# Product Requirements Document — Elite Escape Tourism

## Vision

"Your Escape, Our Elite Services — AI-Powered Travel, Human-Touched Service."
A luxury travel platform for UAE and GCC travelers offering bespoke holiday
packages, visa assistance, curated attractions, seasonal tours, and
AI-assisted trip planning.

## Target market

UAE & GCC travelers: honeymoon couples, families, corporate groups, and
luxury seekers. Differentiated by AI-powered personalization, seamless
booking, and end-to-end management (package + visa + itinerary, coordinated
by one specialist).

## Brand

- Tagline: "Your Escape, Our Elite Services"
- Phone: +971 55 575 3133 · Email: info@eliteescapetourism.com
- Address: #305 Damas Tower, Dubai, UAE
- Hours: Monday–Friday, 9AM–5PM
- Palette: Elite Gold `#C9A24E`, Deep Navy `#0F2B3D`, Travel Teal `#1A7A6A`

## Core surfaces (implemented as first-pass UI)

| Page | Purpose |
| --- | --- |
| Home | Brand story, trust bar, destination + package highlights, CTA |
| Holidays | Filterable package catalogue + package detail + booking enquiry |
| Visa | Requirements reference table + application enquiry form |
| Attractions | Curated experiences by destination, bookable as add-ons |
| Seasonal Tours | Time-limited discounted packages |
| About | Company story, values, team |
| Contact | Contact details + enquiry form |
| AI Travel Planner | Question-carousel and voice-brief package matcher |
| Client Portal | Sign-in/register UI + sample booking dashboard |

## Data model

See `packages/web/prisma/schema.prisma`: `User`, `Destination`, `Package`,
`Booking`, `VisaApplication`, plus supporting enums for role, status, and
package type.

## Explicitly deferred

Real authentication (JWT/MFA/RBAC), payments (Stripe), a live database,
third-party AI travel-planner integrations (MyTripPlanner, Atlas, Voyage),
third-party visa RAG assistants (AskKSA/Daleel), booking/maps/voice API
integrations, and the full security/testing/deployment program described in
the original brief. Each is a substantial workstream that needs a
provisioned backend and explicit prioritization — see `README.md` for the
reasoning.

## Success metrics (Year 1 targets, as briefed)

| Metric | Target |
| --- | --- |
| Website visitors | 20,000/mo |
| AI Travel Planner users | 2,000 |
| Bookings | 500 |
| Visa applications | 250 |
| Google rating | 4.9★ |
| Revenue | AED 1.5M |

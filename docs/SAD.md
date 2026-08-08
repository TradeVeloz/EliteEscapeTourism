# Security & Access Document — Elite Escape Tourism

Status of each control: **Implemented** (built and covered by a test),
**Implemented, unverified** (built, but needs live infra this environment
doesn't have to exercise end-to-end), or **Not built** (documented gap).

## Identity & access

| Control | Status |
| --- | --- |
| Password hashing — bcrypt, cost 12 | Implemented (`src/lib/auth.ts`, tested) |
| JWT access tokens, 15-minute expiry | Implemented (tested) |
| Refresh tokens — opaque random value, only the SHA-256 hash is persisted, rotated on every use | Implemented (tested); live rotation against Postgres is unverified |
| MFA — TOTP (`otplib`) | Implemented (tested) |
| RBAC — `ADMIN` / `TRAVEL_AGENT` / `CLIENT` / `PARTNER` | Implemented in each Route Handler via `src/lib/session.ts`; unverified against a live DB |
| Cookies — HttpOnly, Secure (production), SameSite=strict | Implemented |
| Session idle timeout | Access token TTL (15 min) enforces this; there is no separate idle-tracking mechanism |
| Rate limiting — 10/min per IP on auth routes, 20/min on booking/visa/AI routes | Implemented, in-memory (`src/lib/rate-limit.ts`); needs a shared store (Redis) once running more than one instance |

## Data protection

| Control | Status |
| --- | --- |
| TLS | Not applicable at the app layer — terminated by the hosting platform/CDN in front of Next.js |
| HSTS | Implemented (`next.config.js`) |
| Sensitive data at rest | Passwords are bcrypt hashes; refresh tokens are stored as SHA-256 hashes. No field-level AES-256 encryption is applied to other columns (e.g. passport numbers) — flagged as a follow-up before handling real passport data |
| Generic error responses | Implemented — API routes never return stack traces; auth failures return one identical message regardless of which check failed |

## Input & output

| Control | Status |
| --- | --- |
| Input validation | Zod schemas at every API boundary (`src/lib/validation.ts`) |
| SQL injection | Prisma parameterizes all queries; no raw SQL is used |
| XSS | React escapes all rendered content by default; CSP restricts script/style/object sources (see README for why `unsafe-inline` is the accurate tradeoff on this Next version) |
| File uploads | Not implemented — no upload endpoint exists yet (visa document upload is a named follow-up) |

## API security

| Control | Status |
| --- | --- |
| Versioning | All routes under `/api/v1/` |
| CORS | Not explicitly configured — same-origin only by default since there's no `Access-Control-Allow-Origin` header; revisit if a separate frontend origin is ever introduced |
| Webhook signature verification | Implemented for the Stripe webhook (`stripe.webhooks.constructEvent`) |

## Infrastructure

| Control | Status |
| --- | --- |
| Secrets via environment variables | Implemented — see `.env.example`; nothing is hardcoded |
| Dependency scanning | Not automated in CI yet — run `npm audit` manually; add a `npm audit --audit-level=high` CI step as a follow-up |
| DDoS protection | Out of scope for the app layer — expected at the CDN/hosting layer |

## Monitoring

| Control | Status |
| --- | --- |
| Structured logging | Not implemented — Next.js default logging only |
| Security alerting (failed logins, admin changes) | Not implemented |
| Audit trail for admin actions | Not implemented — booking/visa status changes by staff are persisted with `updatedAt`, but no separate audit-log table exists |

## Known gaps worth prioritizing next

1. Automated dependency scanning in CI.
2. Structured logging + alerting on repeated auth failures.
3. Field-level encryption for passport numbers before handling real applicant data.
4. An audit-log table for staff actions on bookings/visa applications.
5. A password-reset flow (needed both generally and to let guest-checkout
   accounts — created when a booking/visa enquiry uses a new email — claim
   their account and log in).

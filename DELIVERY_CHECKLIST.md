# Delivery Checklist — Hjem Kensington

**Generated:** 2026-05-08 (end of Step 22)
**Status:** Speculative demo build — every box that requires a live deployment
is left ⏳ with a clear reason. Everything else is ✅ verified at the time of
delivery.

> ℹ️ **How to read this file:**
> - ✅ = verified ticked at delivery time
> - ⏳ = pending live deployment (cannot be ticked until the site goes public)
> - N/A = does not apply to this project (with reason)
>
> When the build moves from speculative to a real client engagement, walk
> the ⏳ rows top to bottom and convert them to ✅ as each one passes.

---

## 1. Code & Config

| | Item | Status | Notes |
|---|---|---|---|
| ✅ | Docker files exist | Done | `Dockerfile` (multi-stage), `docker-compose.yml`, `docker-compose.prod.yml` |
| ✅ | `.env.example` complete | Done | All vars documented incl. Resend (`RESEND_API_KEY`, `CONTACT_FORM_FROM_EMAIL`, `CONTACT_FORM_TO_EMAIL`) |
| ✅ | `.nvmrc` contains `20` | Done | Node 20 enforced for every contributor |
| ✅ | `package.json` `engines` | Done | `"node": ">=20.0.0"` |
| ✅ | `tsconfig.json` `@` path aliases | Done | `@/*` → `./*`, mirrored in jest |
| ✅ | Tailwind brand tokens | Done | All palette tokens defined in `app/globals.css` `@theme {}` block (Tailwind v4 — no `tailwind.config.ts`, see deviation 1.1) |
| ✅ | `jest.config.ts` aliases match `tsconfig` | Done | `^@/(.*)$` → `<rootDir>/$1` |
| ✅ | `lib/env.ts` validates required vars | Done | Guarded by `process.env.NODE_ENV !== "test"` |
| ✅ | `.gitignore` covers `.env*`, build, OS files | Done | Plus Docker overrides, coverage, `.jest-cache/` |
| ✅ | Security headers inside `withSentryConfig` | Done | `next.config.ts` — re-verified by `tests/integration/api/security-headers.test.ts` |
| ✅ | `next-sitemap.config.js` guards empty `NEXT_PUBLIC_SITE_URL` | Done | Falls back to a placeholder during build |
| ✅ | Sentry scaffolded | Done | Client + server configs, DSN from env, no-op when unset |
| ✅ | Resend wired into contact form | Done | Stub mode active until `RESEND_API_KEY` + `CONTACT_FORM_FROM_EMAIL` set — submissions log to console only |
| ⏳ | Vercel env vars set in dashboard | Pending | Not yet deployed. See [docs/SETUP.md](docs/SETUP.md) and [docs/HANDOVER.md](docs/HANDOVER.md) for the full list to populate. |

---

## 2. Site Completeness

| | Item | Status | Notes |
|---|---|---|---|
| ✅ | Sticky navbar | Done | `components/Navbar.tsx` — desktop links + mobile hamburger |
| ✅ | Hero section | Done | `components/sections/Hero.tsx` — 3-slide auto-rotating embla carousel |
| ✅ | Story section | Done | `components/sections/Story.tsx` |
| ✅ | Today's Bench (4 cards) | Done | `components/sections/TodaysBench.tsx` |
| ✅ | Menu section | Done | `components/sections/Menu.tsx` — embla carousel |
| ✅ | Testimonials | Done | `components/sections/Testimonials.tsx` |
| ✅ | Visit (address + hours) | Done | `components/sections/Visit.tsx` |
| ✅ | Contact form | Done | `components/sections/Contact.tsx` + `components/ContactForm.tsx` |
| ✅ | Footer with legal links | Done | `components/Footer.tsx` |
| ✅ | Cookie consent banner (WCAG, blocks GA pre-consent) | Done | `components/CookieConsent.tsx` — keyboard + ARIA verified in unit tests |
| ✅ | Open Graph + Twitter Card meta tags | Done | `app/layout.tsx` `metadata` export |
| ✅ | `/privacy-policy` page | Done | `app/privacy-policy/page.tsx` |
| ✅ | `/terms-and-conditions` page | Done | `app/terms-and-conditions/page.tsx` |
| ✅ | `/cookie-policy` page | Done | `app/cookie-policy/page.tsx` |
| ✅ | Footer links to all three legal pages | Done | Verified by `tests/unit/components/Footer.test.tsx` |
| ⏳ | OG image generated (1200×630) | Pending | Spec documented in [docs/IMAGES.md](docs/IMAGES.md). Generate before launch. |
| ⏳ | Favicon set generated | Pending | Spec documented in [docs/IMAGES.md](docs/IMAGES.md). Use realfavicongenerator.net from a 1024×1024 source. |

---

## 3. Security

| | Item | Status | Notes |
|---|---|---|---|
| ✅ | Honeypot field present | Done | `company_url` input wrapped in `display:none` div, see `components/ContactForm.tsx` |
| ✅ | Rate limiting active (env-controlled) | Done | `lib/rate-limit.ts` — 3 per 10 min per IP, sliding window |
| ✅ | Server-side input sanitization | Done | `lib/sanitize.ts` — `stripHtml()` runs on every field before email send |
| ✅ | Server-side validation only | Done | Server action validates name/email/message; client-side only for UX hints |
| ✅ | Generic error messages (no internals exposed) | Done | Only `rate_limit` shown explicitly; bot/server errors return generic copy |
| ✅ | No hardcoded secrets in repo | Done | All secrets routed via `lib/env.ts`; `.env.local` gitignored |
| ✅ | No `console.log` in production code | Done | Verified — Sentry handles error reporting, no stray logs |
| ✅ | All security headers present | Done | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy — `tests/integration/api/security-headers.test.ts` green |

---

## 4. Testing & Quality

| | Item | Status | Notes |
|---|---|---|---|
| ✅ | Jest configured (jsdom + node envs) | Done | `jest.config.ts` uses `next/jest` SWC transform |
| ✅ | MSW installed and ready | Done | Available for HTTP mocking in integration tests |
| ✅ | Husky pre-commit hook | Done | Runs `tsc --noEmit` + `lint-staged` |
| ✅ | Husky pre-push hook | Done | Runs `jest --ci --passWithNoTests` (full suite) |

### Unit tests (all written test-first, all passing)

| | File | Status |
|---|---|---|
| ✅ | `tests/unit/lib/env.test.ts` | Pass |
| ✅ | `tests/unit/lib/sanitize.test.ts` | Pass |
| ✅ | `tests/unit/lib/rate-limit.test.ts` | Pass |
| ✅ | `tests/unit/lib/honeypot.test.ts` | Pass |
| ✅ | `tests/unit/lib/email.test.ts` | Pass |
| ✅ | `tests/unit/lib/sentry.test.ts` | Pass |
| ✅ | `tests/unit/components/ContactForm.test.tsx` | Pass |
| ✅ | `tests/unit/components/CookieConsent.test.tsx` | Pass |
| ✅ | `tests/unit/components/Navbar.test.tsx` | Pass |
| ✅ | `tests/unit/components/Footer.test.tsx` | Pass |
| ✅ | `tests/unit/components/Carousel.test.tsx` | Pass |
| ✅ | `tests/unit/components/sections/*.test.tsx` (Hero, Story, TodaysBench, Menu, Testimonials, Visit, Contact) | Pass |

### Integration tests (all passing)

| | File | Status |
|---|---|---|
| ✅ | `tests/integration/api/contact-form.test.ts` (all 9 cases) | Pass |
| ✅ | `tests/integration/api/security-headers.test.ts` | Pass |
| ✅ | `tests/integration/flows/cookie-consent-ga.test.tsx` | Pass |
| ✅ | `tests/integration/flows/legal-pages.test.tsx` | Pass |

### Smoke tests (all passing)

| | File | Status |
|---|---|---|
| ✅ | `tests/smoke/render.test.tsx` (no console errors) | Pass |
| ✅ | `tests/smoke/navigation.test.tsx` (no broken internal links) | Pass |
| ✅ | `tests/smoke/accessibility.test.tsx` (zero axe-core violations) | Pass — uses `jest-axe` not `@axe-core/react`, see [MASTER_PROMPT_DEVIATIONS.md](MASTER_PROMPT_DEVIATIONS.md) entry 10.1 |

### Quality gates

| | Item | Status | Notes |
|---|---|---|---|
| ✅ | Full suite passes (`npm run test:ci`) | Done | **227 / 227 tests across 25 suites** |
| ✅ | Coverage thresholds met (80% all four metrics) | Done | Statements 94.83% / Branches 89.56% / Functions 89.87% / Lines 96.40% |
| ✅ | TypeScript clean | Done | `npx tsc --noEmit` — zero errors |
| ✅ | ESLint clean | Done | `npx eslint . --max-warnings 0` — zero errors |
| ⏳ | Lighthouse: Performance ≥90 | Pending | Targets in [docs/PERFORMANCE.md](docs/PERFORMANCE.md). Capture against the deployed Vercel preview pre-launch — localhost scores are misleading. |
| ⏳ | Lighthouse: Accessibility ≥95 | Pending | Same as above. |
| ⏳ | Lighthouse: SEO ≥95 | Pending | Same as above. |
| ⏳ | Lighthouse: Best Practices ≥95 | Pending | Same as above. |
| ✅ | Tested on mobile viewport (375px) | Done | Manual check during build — no overflow, hamburger collapses, forms usable |

---

## 5. Documentation — every file in `/docs/`

| | File | Status |
|---|---|---|
| ✅ | [docs/CLAUDE.md](docs/CLAUDE.md) — project brain for future sessions | Done |
| ✅ | [docs/README.md](docs/README.md) — developer setup + deployment | Done |
| ✅ | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — system design + flow diagrams | Done |
| ✅ | [docs/DESIGN.md](docs/DESIGN.md) — palette, type, spacing, components | Done |
| ✅ | [docs/SETUP.md](docs/SETUP.md) — new-machine setup with verification | Done |
| ✅ | [docs/ERRORS.md](docs/ERRORS.md) — error catalogue + decision trees | Done |
| ✅ | [docs/SECURITY.md](docs/SECURITY.md) — threat model + CSP walkthrough | Done |
| ✅ | [docs/LEGAL.md](docs/LEGAL.md) — legal pages summary + solicitor reminder | Done |
| ✅ | [docs/DOCKER.md](docs/DOCKER.md) — multi-stage build + troubleshooting | Done |
| ✅ | [docs/IMAGES.md](docs/IMAGES.md) — full image inventory + photographer brief | Done |
| ✅ | [docs/MAINTENANCE.md](docs/MAINTENANCE.md) — monthly/quarterly/annual rhythm | Done |
| ✅ | [docs/USER_GUIDE.md](docs/USER_GUIDE.md) — plain-English owner guide | Done |
| ✅ | [docs/PERFORMANCE.md](docs/PERFORMANCE.md) — targets + optimisation notes | Done |
| ✅ | [docs/HANDOVER.md](docs/HANDOVER.md) — client-facing delivery doc | Done |
| ✅ | [docs/TESTING.md](docs/TESTING.md) — test philosophy + how to add tests | Done |
| ✅ | [SESSION_HANDOFF.md](SESSION_HANDOFF.md) — root-level session bridge | Done (refreshed end of Session 11) |

---

## 6. Pre-Launch — only tickable when the site is publicly deployed

> ⏳ **Every box in this section requires a live `https://` URL.** They stay
> open during the speculative build by design. Walk this list top to bottom
> on launch day after the first Vercel production deploy succeeds.

| | Item | Why it can only happen post-deploy |
|---|---|---|
| ⏳ | Validate headers at [securityheaders.com](https://securityheaders.com) — target B+ minimum | Needs a public URL to scan |
| ⏳ | Submit contact form on the live URL and confirm email arrives in `CONTACT_FORM_TO_EMAIL` inbox | Stub mode is active until `RESEND_API_KEY` + `CONTACT_FORM_FROM_EMAIL` are set on Vercel |
| ⏳ | Confirm GA does **not** load before cookie consent | Open the live site in an incognito window; Network tab should show no `googletagmanager.com` request until Accept is clicked |
| ⏳ | Confirm GA **does** load after cookie consent | Same incognito session — click Accept, refresh, verify GA tag fires |
| ⏳ | Confirm `/sitemap.xml` is reachable on the live URL | Generated by `next-sitemap` on every `npm run build` |
| ⏳ | Confirm `/robots.txt` is reachable on the live URL | Same |
| ⏳ | Capture Lighthouse run against the deployed Vercel preview (incognito, no extensions) and fill in actuals in [docs/PERFORMANCE.md](docs/PERFORMANCE.md) | Localhost scores are misleading — must measure against production |
| ⏳ | Confirm Sentry receives events from production | Trigger a deliberate test error after deploy, verify it surfaces in the Sentry dashboard |
| ⏳ | All Vercel env vars set for **Production**, **Preview**, and **Development** environments | See [docs/SETUP.md](docs/SETUP.md) for the full list |
| ⏳ | Avatar images compressed to ~600 KB each via [squoosh.app](https://squoosh.app) | Currently ~9 MB each (flagged in [docs/IMAGES.md](docs/IMAGES.md)) — non-blocking but worth doing |
| ⏳ | Hjem phone number added to Visit section once published | Currently omitted by design |

### 🚨 Critical pre-launch — non-negotiable

| | Item | Notes |
|---|---|---|
| ⏳ | **Solicitor review of all three legal pages** | Privacy Policy, Terms & Conditions, and Cookie Policy are AI-generated templates. Reviewer **must** be a qualified UK solicitor. Reminder also documented in [docs/LEGAL.md](docs/LEGAL.md) and [docs/HANDOVER.md](docs/HANDOVER.md). |
| ⏳ | [docs/HANDOVER.md](docs/HANDOVER.md) credentials table filled in | Currently placeholders by design — fill on launch day with real credentials, real URL |

---

## What this checklist does NOT cover

- **The pitch conversation.** Once this checklist is fully ticked through
  Step 5 (and Step 6 is queued for the launch day walk-through), the
  speculative build is ready to be shown to the client. Sales motion is
  outside this build's scope.
- **Post-launch maintenance cadence.** That lives in
  [docs/MAINTENANCE.md](docs/MAINTENANCE.md) — monthly / quarterly / annual
  tasks with a gantt chart.
- **Scaling beyond a one-page brochure site.** Architecture for that lives
  in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) under "Scaling notes."

---

## Sign-off

| | |
|---|---|
| Built by | Essam Noureldin |
| Date completed (speculative build) | 2026-05-08 |
| Total tests | 227 / 227 passing |
| Coverage | 94.83% / 89.56% / 89.87% / 96.40% |
| Status | ✅ Speculative build complete — ready to pitch |

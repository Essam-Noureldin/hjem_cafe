# Session Handoff
**Generated:** 2026-05-08 (end of Session 13 — first deploy)
**Project:** Hjem Kensington — speculative demo build (UK indie cafe)
**Operator:** Essam (solo freelancer)

---

## TL;DR for the next session

- **The speculative build is now LIVE** at
  [https://hjem-kensington.vercel.app](https://hjem-kensington.vercel.app).
  Deployed via Vercel + GitHub auto-deploy (every push to `main` redeploys).
- `noindex,nofollow` set on root layout — Google won't index this URL with
  Hjem's name on it. Flip back to `index: true, follow: true` on real
  launch day after the production domain is pointed at Vercel.
- All 7 required env vars set in Vercel for Production + Preview.
  Resend live key in place, `CONTACT_FORM_FROM_EMAIL=onboarding@resend.dev`
  (Resend's free no-domain sender).
- GA + Sentry dormant by design (empty env vars) — flip on at real launch.
- 227 / 227 tests still passing. Coverage well above gates. tsc + ESLint clean.
- Two branches merged this session: `feature-vercel-prep` (noindex change)
  and `feature-post-deploy-docs` (this update).
- **Outreach is the next move.** Email + DM scripts already drafted in the
  prior chat. Pre-send checklist still has open items (founder name, OG
  image, etc.) — see "Open items" below.

---

## What was built/changed in Session 13

### Plain English

The site went from "code on GitHub" to "real public URL Hjem can click on."
Two code-touching commits, plus this doc refresh.

### What changed in the repo

| File | What changed |
|---|---|
| `app/layout.tsx` | `metadata.robots` flipped to `{ index: false, follow: false }` for the speculative deploy. Comment in code explains the flip-back trigger. |
| `DELIVERY_CHECKLIST.md` | Vercel-env-vars row flipped to ✅. Pre-launch section restructured: GA + Sentry rows marked N/A on the demo (vars deliberately empty); other rows annotated "tickable now on live URL." Sign-off footer adds the demo URL. |
| `SESSION_HANDOFF.md` (this file) | Refreshed end-to-end for end of Session 13. |

### Decisions worth remembering

- **GitHub auto-deploy via Vercel dashboard, NOT CLI.** Cleaner workflow:
  every push to `main` triggers a production deploy automatically; every
  feature branch gets a free preview URL. No `vercel deploy` commands
  needed for the rest of the project's life.
- **Resend's `onboarding@resend.dev` no-domain sender for the demo.**
  Skipped the "Add domain" path because (a) Hjem owns the real domain,
  not us, and (b) DNS verification is overhead unnecessary for a demo.
  When Hjem signs and the real domain is pointed at Vercel, *then* add
  a Resend domain and switch `CONTACT_FORM_FROM_EMAIL` to
  `hello@hjemkensington.com` or similar.
- **Project name on Vercel: `hjem-kensington`, not `hjem-cafe`.** Renamed
  during the import flow so the URL reads as the actual brand name.
  Repo on GitHub remains `hjem_cafe`; only the Vercel project name
  matches the brand.
- **GA + Sentry intentionally dormant on the demo.** No `NEXT_PUBLIC_GA_ID`,
  no `NEXT_PUBLIC_SENTRY_DSN`. The flows are wired and tested but no
  external services are reached on the demo. Fewer moving parts to break;
  no privacy implications for the cookie banner test.

---

## Test status

- **227 tests passing** across 25 suites (no change since end of Session 11).
- Coverage: 94.83% statements / 89.56% branches / 89.87% functions / 96.40% lines.
- Last full suite run: PASSED.
- TSC clean. ESLint clean.
- Pre-push hook ran the full suite during both pushes this session.

---

## Vercel reference (so future sessions don't have to re-derive)

| | |
|---|---|
| Project name | `hjem-kensington` |
| Production URL | https://hjem-kensington.vercel.app |
| Linked repo | `Essam-Noureldin/hjem_cafe` (branch `main`) |
| Auto-deploy | On every push to `main` |
| Preview deploys | On every feature branch push |
| Env vars set | `NEXT_PUBLIC_SITE_URL`, `CONTACT_FORM_TO_EMAIL`, `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`, `COOKIE_CONSENT_REQUIRED`, `RESEND_API_KEY`, `CONTACT_FORM_FROM_EMAIL` |
| Env vars empty (by design) | `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_SENTRY_DSN` |
| Vercel team | `essam-noureldin's projects` (Hobby plan) |

---

## Open items going into the outreach phase

### Verifications still owed on the live URL

- [ ] Submit the contact form on the live URL → confirm email lands in
      `esam.noureldin@gmail.com` within 60s. **Critical** — the demo's
      one must-work feature.
- [ ] Visit `https://securityheaders.com` → paste the URL → capture grade
      (target B+ or higher).
- [ ] `https://hjem-kensington.vercel.app/sitemap.xml` returns the sitemap.
- [ ] `https://hjem-kensington.vercel.app/robots.txt` returns the robots file.
- [ ] Run Lighthouse against the live URL in incognito; fill the actuals
      table in [docs/PERFORMANCE.md](docs/PERFORMANCE.md).

### Pre-outreach polish (worth doing before sending the DM)

- [ ] Generate the OG image (1200×630) — affects link previews on
      Instagram/WhatsApp/email when the URL is shared.
- [ ] Generate the favicon set — currently the browser tab shows the
      default Next.js icon, looks unfinished.
- [ ] Compress avatar images from ~9 MB to ~600 KB via squoosh.app.
- [ ] Find the founder's actual first name (Companies House, IG bio, LinkedIn)
      to personalise the outreach scripts.

### Carried over (not blocking outreach)

- GitHub Dependabot moderate (`postcss` inside Next bundled deps).
  Documented in `/docs/ERRORS.md` row 14.
- Drinks menu unknown — add a Drinks card to Menu using the unused
  `coffee.jpeg` and `matcha.jpeg` once the drinks list surfaces.
- Hjem phone number — left out of Visit until published.
- Solicitor review of legal pages — non-negotiable before any *real* public
  launch, but not a blocker for the speculative pitch.

---

## How to resume next session

If continuing the outreach work:

1. Run the live-URL verifications listed above.
2. Send the first outreach DM/email (scripts in prior chat).
3. Track responses; price-quote = £1,200 build + £80/month, 12-month min.

If a real client engagement starts later:

1. Walk the ⏳ rows in `DELIVERY_CHECKLIST.md` top to bottom.
2. Switch `metadata.robots` in `app/layout.tsx` back to `{ index: true, follow: true }`.
3. Add their real GA4 ID and Sentry DSN to Vercel env vars; flip the
   N/A rows in DELIVERY_CHECKLIST to verifiable.
4. Add their real domain to Resend; update `CONTACT_FORM_FROM_EMAIL`.
5. Brief the client to send the legal pages to a UK solicitor before
   public launch. **Non-negotiable.**

---

## Quick health-check commands (run on resume)

```powershell
# From hjem-kensington/:
npx tsc --noEmit
npx eslint . --max-warnings 0
npx jest --ci --passWithNoTests
npm run build
```

All four should still exit clean. The deploy itself is verified by
visiting [https://hjem-kensington.vercel.app](https://hjem-kensington.vercel.app)
in incognito mode.

---

## What's left after Session 13

- The build + deploy is done.
- Verifications above are mechanical (15 min total).
- Outreach is sales work, outside the build scope but critical for ROI.

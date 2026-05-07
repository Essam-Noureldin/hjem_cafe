# Session Handoff
**Generated:** 2026-05-07 (end of Session 7)
**Project:** Hjem Kensington — speculative demo build (UK indie cafe)
**Operator:** Essam (solo freelancer)

---

## What Was Completed in Session 7

### Step 16 finished — Visit section shipped, plus Testimonials added

Step 16 (homepage sections) fully complete; Testimonials added on top
to cover master prompt's "social proof" requirement (#5 in EVERY SITE
MUST INCLUDE).

#### Visit section
- **Layout:** two-column on desktop (info left, shopfront image
  right), stacks on mobile (info on top, image below).
- **Content (real, from Essam's in-store research):**
  - Address: 157 Gloucester Road, London, SW7 4TH
  - Hours: Mon–Fri 7:30–17:00, Sat & Sun 8:30–17:00
  - Headline: "One room on Gloucester Road."
  - Subhead: "South Kensington, two minutes from the tube."
- **CTA:** "Get directions" button links to
  `https://www.google.com/maps/?q=157+Gloucester+Road+London+SW7+4TH`
  with `target="_blank"` + `rel="noopener noreferrer"`. Taps
  straight into the native Maps app on mobile.
- **Image:** reuses `/public/images/hero-shopfront.jpeg` — appears
  5+ scroll-lengths after the Hero rotation, so recall is "yes,
  that place" not repetition.
- **No iframe:** chose an outbound link over an embedded Google
  Maps widget. Keeps CSP `frame-src 'none'` intact, avoids loading
  Google's trackers before consent, no LCP hit. See deviation 7.1.
- **Phone:** intentionally omitted — Hjem's published number wasn't
  in research. Same omit-don't-invent rule as deviations 6.4 / 6.6.

#### Workflow followed
- Branch-per-feature: built on `feature-visit`, fast-forward merged
  to `main`, both branches pushed to remote.
- Test-first: `Visit.test.tsx` (7 tests) written and red-confirmed
  before `Visit.tsx`.
- `app/page.tsx` updated: imports Visit, removes the `SectionStub`
  helper (Visit was its only consumer).

### Testimonials section (added after Visit shipped)

#### What
- 3 real, attributed customer/critic quotes pulled from public
  review platforms — TripAdvisor (Karen55115 5★ Feb 2025, Mrs Sarah
  G 5★ Jan 2022) and The Infatuation (Oliver Feldman, Jan 2020).
- Each card is a `<blockquote>` with `cite=` URL pointing to the
  source page; visible `<cite>` shows reviewer name, source platform,
  date, and rating where available. Source name is itself a link.
- Sits between Menu and Visit so trust is established before the
  "Get directions" CTA.
- Three different voices (critic / foodie tourist / local family)
  across three different time spans — sustained quality, not a
  cherry-picked moment.

#### Why this approach (not Google scraping, not generated reviews)
- **No Google scraping:** Google's TOS prohibits it, and reviews
  are JS-rendered so server-side fetch returns nothing useful
  anyway. The legitimate Google path is the Places API — costs
  money, needs CSP relax, overkill for a demo. See deviation 7.2.
- **No generated reviews:** UK Digital Markets, Competition and
  Consumers Act 2024 (in force April 2025) makes publishing fake
  reviews a civil offence with fines up to 10% of global turnover.
  Same omit-don't-invent rule we apply to menu prices (6.4 / 6.6)
  and Visit phone number (7.1).
- Quoting short excerpts of real published reviews with full
  attribution and source links is standard editorial fair use.

#### Workflow followed
- Branch-per-feature: built on `feature-testimonials`, fast-forward
  merged to `main`, both branches pushed.
- Test-first: `Testimonials.test.tsx` (6 tests, includes a
  real-source guard that fails if a quote ever ships without a
  verifiable platform attribution).
- `app/page.tsx` updated: imports Testimonials, sits between Menu
  and Visit. Section id="testimonials" but intentionally not in the
  navbar — passive proof beat, not a destination.

### Testimonials redesign (visual iteration after first ship)
- Essam pointed at a stock testimonial template (centered cards
  with profile photos overhanging the top edge) and asked for the
  Hjem section to match.
- Built the visual structure faithfully — centered headline +
  subhead, three centered cards on bg-cream over the bg-bone band,
  decorative open-quote glyphs, author names in clay accent — but
  pushed back on lifting reviewer photos. See deviation 7.3.
- Replaced the photo circles with **trust-signal badges**: the
  two TripAdvisor 5-star reviews show "★★★★★" inside a moss-on-bone
  circle, The Infatuation card shows "Critic's Pick". Same visual
  rhythm as the reference, no GDPR / TOS / fake-endorsement risk.
- Branched as `redesign-testimonials-cards` (small-but-visible
  redesign of an already-shipped section), fast-forward merged to
  main, both branches pushed.

### Bonus discovery — owner identity confirmed
- Same web research that surfaced the testimonial quotes also
  confirmed Hjem's owner: **Marianne Brammer**, Danish-born, opened
  Hjem in **January 2018**. Original location 3 Launceston Place,
  expanded to 157 Gloucester Road. The cardamom bun recipe is hers.
- This resolves the open question from deviation 6.5 (Story uses
  generic "we" framing because owner was unknown).
- **Queued as separate branch** `feature-story-owner-update` —
  kept out of the testimonials branch to honour scope discipline
  per branch-per-feature rule (6.7). Should be a small focused
  rewrite of Story's prose to name Marianne and the 2018 founding
  date.

---

## Current Build Step

**Steps 1–16 of the master prompt's build order are COMPLETE.**
Plus Testimonials (the master-prompt #5 social-proof requirement)
shipped on top.

**Next session (Session 8) options — pick whichever first:**
- Step 17 (contact form) — the next master-prompt step in order.
- `feature-story-owner-update` — small focused Story rewrite to
  name Marianne Brammer + 2018 founding date now that we know
  them. Probably 30 minutes including the test update.

> ð¡ **Recommended:** run `/compact` at the start of Session 8.

> â ï¸ **Open questions for Session 8 (Contact form):**
> - Form fields: master prompt baseline is name / email / message.
>   Hjem-specific extras (occasion, party size, allergens) — worth
>   asking Essam if the form should serve a wholesale/event enquiry
>   use case as well as walk-in feedback.
> - Per master prompt: write `ContactForm.test.tsx` AND
>   `tests/integration/api/contact-form.test.ts` BEFORE the
>   implementation. Both must cover honeypot, rate limit,
>   sanitization, validation, error shape.
> - Resend integration: needs `RESEND_API_KEY`,
>   `CONTACT_FORM_FROM_EMAIL`, `CONTACT_FORM_TO_EMAIL` set in
>   `.env.local` AND on Vercel before deploy. `lib/env.ts` will
>   throw at startup if missing — confirm Essam has a Resend
>   account first.

After Step 17:
- Step 18: Sentry scaffold (security headers must remain inside
  `withSentryConfig` wrapper)
- Step 19: Security headers integration test
- Step 20: Smoke tests + final coverage gate
- Step 21: All 15 docs in `/docs/` (CLAUDE.md, README.md,
  ARCHITECTURE.md, etc.)
- Step 22: DELIVERY_CHECKLIST.md

---

## Decisions Made in Session 7

| Decision | Reasoning | Alternatives rejected |
|---|---|---|
| Outbound Google Maps directions link, no iframe | Keeps strict CSP (`frame-src 'none'`) intact, no third-party trackers before consent, no LCP hit, taps into native Maps app on mobile | Embedded Google Maps iframe (would force CSP relax + load Google trackers regardless of consent state); static map image (extra asset to commission, no real benefit over a link for this use case) |
| Reuse `hero-shopfront.jpeg` for Visit image | Already in repo, perfect "find us" framing, appears 5+ scrolls after Hero so it reads as recall not repeat | Generate a new dedicated Visit image (extra Essam effort for marginal gain — can swap later if a better shot emerges) |
| Two-column desktop, info-on-top mobile stack | Info-density side reads first when the layout collapses — visitor sees address/hours/CTA before scrolling past the image | Image-on-top mobile (visitor scrolls past the photo before getting to the actionable info) |
| Phone number omitted | Not in Essam's research; omit beats invent (same rule as deviations 6.4 / 6.6) | Invent a placeholder number (lies on a demo site, deletes trust if Essam shows it to the real Hjem owners) |
| Hours rendered as `<dl>` with weekday `<dt>` / time `<dd>` | Correct semantic for label:value pairs; screen readers announce as a definition list | Plain divs (loses the semantic relationship for a11y) |
| Testimonials use real quoted reviews from public platforms (TripAdvisor, The Infatuation) | Editorial fair use is the legitimate path; UK DMCC Act 2024 makes fake reviews a 10%-of-turnover offence; Google scraping is TOS-prohibited and Google reviews are JS-rendered anyway | Generated/invented "plausible" reviews (illegal); Google reviews scrape (TOS + technical); Google Places API embed (overkill — money + CSP relax + caching infra for a demo) |
| Testimonials sits between Menu and Visit (not in navbar) | Trust is established immediately before the "Get directions" CTA; passive proof beat doesn't earn a navbar slot | Above Menu (proof before menu interest is unmotivated); below Visit (too late — visitor has already decided whether to come); add to navbar (clutter for a one-page brochure) |
| Three voices on purpose (critic / tourist / family, 2020/2022/2025) | Different angles + different time spans demonstrate sustained quality, not a cherry-picked moment | Three quotes from one platform / one period (looks suspicious); single hero quote (single voice carries less weight than three corroborating ones) |
| Testimonials.tsx coverage 100%, 6 tests including real-source guard | Catches a future regression where someone quietly ships an unattributed or invented quote | Skip the source-name regex (test passes for any text in `<cite>`, no protection against future drift) |

---

## Known Issues or Open Questions

### Resolved during Session 7
- â `SectionStub` helper deleted from `app/page.tsx` — Visit was
  its only consumer.
- â All Step-16 sub-sections now ship in their final form: Hero,
  Story, Today's Bench, Menu, Visit.
- â Master prompt's #5 (social proof) requirement now covered by
  the Testimonials section between Menu and Visit.
- â Hjem owner identity confirmed: **Marianne Brammer**, Danish-
  born, opened Jan 2018. Cardamom bun recipe is hers. (Story copy
  rewrite queued as separate `feature-story-owner-update` branch.)

### Carried over from Session 6 (still open)
- **Drinks menu unknown.** Counter menu Essam photographed is
  bakery-only. When the drinks list surfaces, add a Drinks card
  back to the Menu carousel using the unused `coffee.jpeg` and
  `matcha.jpeg` images already in `/public/images/menu/`.
- **2 moderate-severity vulnerabilities** in Next.js's bundled
  `postcss` dep (`GHSA-qx2v-qp2m-jg93`). Not actionable. Master
  prompt gate is high+ only. Add to ERRORS.md in Step 21.
- **No CLAUDE.md or ERRORS.md yet** — generation scheduled for
  Step 21. Root `CLAUDE.md` is still just `@AGENTS.md` import.
- **Story copy still uses generic "we" framing** even though we
  now know the owner is Marianne Brammer (founded Jan 2018).
  Rewrite queued as `feature-story-owner-update` — kept separate
  to honour branch scope discipline.
- **Hjem phone number** — left out of Visit per deviation 7.1.
  Add when published.
- **CookieConsent / GAScript SSR-only branches**
  (`getServerSnapshot`) intentionally uncovered. Suite well above
  gates.
- **Sitemap regeneration** — use `npm run build` (not `npx next
  build`) to fire `postbuild`. If stale, run `npx next-sitemap`
  directly.
- **Standalone production server testing on phone:** copy
  `public/` and `.next/static/` into `.next/standalone/` after
  build, then `node .next/standalone/server.js` with
  `LOCAL_HTTP_TEST=1` and `HOSTNAME=0.0.0.0`. See deviation entry
  for the LOCAL_HTTP_TEST var.

---

## Test Status

- **150 tests passing** across 16 suites (137 → 150, +13 from Session 7)
  - env.test.ts: 18
  - sanitize.test.ts: 16
  - rate-limit.test.ts: 10
  - honeypot.test.ts: 8
  - legal-pages.test.tsx: 13
  - CookieConsent.test.tsx: 13
  - cookie-consent-ga.test.tsx: 6
  - Navbar.test.tsx: 7
  - Footer.test.tsx: 4
  - Hero.test.tsx: 6
  - Story.test.tsx: 5
  - Menu.test.tsx: 6
  - TodaysBench.test.tsx: 5
  - Carousel.test.tsx: 19
  - **Visit.test.tsx: 7** *(new in Session 7)*
  - **Testimonials.test.tsx: 6** *(new in Session 7)*
- Coverage: **93.77% statements, 93.10% branches, 88.05% functions, 95.23% lines**
  - Visit.tsx: **100% on every metric**
  - Testimonials.tsx: **100% on every metric**
  - All sections at 100% on every metric except Hero (85.71% statements, 91.66% lines — slide-event handlers not exercised by jsdom)
  - Carousel.tsx: 86.36% statements, 91.83% branches (uncovered: edge-cycling fallbacks that embla doesn't fire in jsdom)
  - sanitize.ts, rate-limit.ts, honeypot.ts: 100% on every metric
  - DemoDisclaimer.tsx, LegalLayout.tsx, Footer.tsx, Navbar.tsx: 100%
  - CookieConsent.tsx: 95% statements (line 61 = `getServerSnapshot`, SSR-only)
  - GAScript.tsx: 95% statements (line 59 = `getServerSnapshot`, SSR-only)
  - env.ts: 94.73% statements (intentional uncovered branch)
- Last full suite run: **PASSED** (6.405s)
- Last `next build`: **PASSED** (sitemap regenerated, zero errors)

### Tests still to write (next sessions, in build order)
1. `tests/unit/components/ContactForm.test.tsx` (Step 17)
2. `tests/integration/api/contact-form.test.ts` (Step 17)
3. `tests/integration/api/security-headers.test.ts` (Step 19)
4. `tests/smoke/render.test.tsx` (Step 20)
5. `tests/smoke/navigation.test.tsx` (Step 20)
6. `tests/smoke/accessibility.test.tsx` (Step 20)

---

## How to Resume

1. Open Claude Code in `c:\Users\noure\Desktop\apps_websites\websites\` (the parent — `git -C hjem-kensington` works for git commands).
2. Paste **MASTER_PROMPT.md** at session start.
3. Paste **this SESSION_HANDOFF.md**.
4. State: *"Resuming Hjem Kensington build from Step 17 — Contact form."*
5. Claude should run the four health-check commands, confirm clean state, then present a Session 8 plan covering the Contact form (form component + server action + Resend wiring + tests) before writing code.
6. Per the branch-per-feature rule, the first move is to create a branch — name it `feature-contact-form` before any code changes.

---

## Files Needing Attention

- `CLAUDE.md` (root) — still just `@AGENTS.md` import. Full project
  CLAUDE.md generated in Step 21.
- `public/images/story.jpeg` and `public/images/hero.jpg` — leftover
  from earlier sub-commits, no longer referenced. Safe to delete or
  leave; not load-bearing.
- `public/images/Exterior shopfront at dusk.jpeg`,
  `Overhead pastry close-up.jpeg`,
  `interior atmosphere.jpeg` — also unreferenced (intermediate
  AI-generation artefacts). Same: safe to delete or leave.

---

## Quick health-check commands (run on resume)

```powershell
# From hjem-kensington/:
npx tsc --noEmit
npx eslint . --max-warnings 0
npx jest --ci --passWithNoTests
npm run build        # NOTE: npm run, not npx — only `npm run build` fires `postbuild` (next-sitemap)
```

All four should exit clean. After build, `public/sitemap.xml` and
`public/robots.txt` regenerate (gitignored). If sitemap is missing
or stale after a build:
- Confirm you ran `npm run build`, not `npx next build`.
- Recovery: `Remove-Item public\sitemap*.xml,public\robots.txt; npx next-sitemap`.

### To test the production build on a phone
```powershell
# In hjem-kensington/, after npm run build:
Copy-Item -Recurse -Force public .next/standalone/public
Copy-Item -Recurse -Force .next/static .next/standalone/.next/static
$env:LOCAL_HTTP_TEST="1"
$env:HOSTNAME="0.0.0.0"
$env:PORT="3000"
node .next/standalone/server.js
```

Then visit `http://<your-LAN-ip>:3000` on the phone (same WiFi).
The `LOCAL_HTTP_TEST` var disables the
`upgrade-insecure-requests` CSP directive that breaks HTTP-only
LAN testing.

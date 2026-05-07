# Session Handoff
**Generated:** 2026-05-07 (end of Session 6)
**Project:** Hjem Kensington — speculative demo build (UK indie cafe)
**Operator:** Essam (solo freelancer)

---

## What Was Completed in Session 6

### Step 16 sub-divided into commits, then redesigned

Step 16 (homepage sections) split across many sub-commits, both on
`main` and on a `redesign-bakemyday-inspired` branch that has now
been merged back to `main`. Net delivered:

#### Sections shipping in their final form
- **Hero** — 3-slide auto-rotating carousel (Velkommen / Made before
  light / Find us on Gloucester Road) with moss-green nav controls,
  embla-carousel-react under the hood. Slide 1 carries the page-level
  `<h1>`; slides 2-3 use `<p>` so the heading outline stays single-h1.
- **Story** — moss-green band, two-column on desktop. Image side is a
  3-slide auto-rotating carousel (predawn cooling rack, hands at
  dough, tools still-life). Prose side: 3 paragraphs of generic-but-
  grounded "we" framing, no invented founders.
- **Today's Bench** *(new section, not in original prompt)* — between
  Story and Menu. Horizontal product carousel of 4 featured items
  (Cardamom Bun, Stone-milled Sourdough, Flat White, Ceremonial
  Matcha). User-driven, no autoplay.
- **Menu** — synced with the **real** in-store counter menu Essam
  photographed mid-session. 3 categories (HJEMmade Bakery, Buns &
  Pastries, Bread Station), 23 real items, real prices verbatim
  including dual full/half pricing for sourdough loaves. Drinks
  removed for now (the photographed menu is bakery-only).
  Horizontal card carousel — overlay moss arrows + below-the-cards
  dots.

#### Section still stubbed
- **Visit** — still the "Coming up" placeholder. Real address (157
  Gloucester Road, SW7 4TH) and hours (Mon-Fri 7:30-17:00, Sat & Sun
  8:30-17:00) are confirmed and ready to ship in a follow-up session.

#### New shared component
- **`components/Carousel.tsx`** — reusable wrapper around
  embla-carousel-react. Used by Story, TodaysBench, Menu (Hero has its
  own bespoke implementation). API supports control themes
  (light / dark / moss), arrow positions (overlay / outside), and
  per-prop dotsPosition override. Manual cycling on the prev/next
  callbacks for cases where embla's loop silently disables (track
  carousels with too few slides for the visible count).

### Imagery generated and committed
- 3 hero slides (`/public/images/hero-interior.jpeg`,
  `hero-pastries.jpeg`, `hero-shopfront.jpeg`)
- 3 story slides (`/public/images/story-1.jpeg`, `story-2.jpeg`,
  `story-3.jpeg`)
- 4 bench items (`/public/images/bench-cardamom.jpeg`,
  `bench-sourdough.jpeg`, `bench-flatwhite.jpeg`, `bench-matcha.jpeg`)
- 5 menu category images in `/public/images/menu/` (`bakery.jpeg`,
  `pastries.jpeg`, `kitchen.jpeg`, `coffee.jpeg`, `matcha.jpeg`,
  `hjemmade.jpeg`) — `kitchen`, `coffee`, and `matcha` are unused
  while drinks/kitchen sections aren't on the live menu but live in
  the folder for if they come back.
- Original Step 16 hero (`hero.jpg`) and unfinished Story image
  (`story.jpeg`) remain in `/public/images/` but aren't referenced —
  carry-over from earlier sub-commits, harmless.

All AI-generated. Deviation 6.2 covers the imagery workflow.

### Workflow shift declared mid-session
- **Branch-per-feature** is now the default workflow on this project
  and any other under `apps_websites/`. Every new feature, section,
  or non-trivial change ships on its own branch off `main`, merged
  back when confirmed working. Trivial fixes (typos, server
  restarts) bypass branching. Saved as feedback memory and as
  deviation 6.7.

### Quirks resolved during Session 6

- **`upgrade-insecure-requests` CSP directive blocked HTTP testing
  of the production build over LAN.** When a phone hits
  `http://192.168.1.59:3000`, the browser auto-rewrites every
  CSS/JS sub-resource request to `https://...` and they all 404.
  Fix: added `LOCAL_HTTP_TEST=1` env var in `next.config.ts` that
  skips just that one directive. Default CSP unchanged for prod.
- **Embla `loop: true` silently disables when slides are < snapsInView × 2.**
  Symptom: right arrow stops working at the end on desktop. Fix:
  manual cycling in scrollPrev/scrollNext — fall back to scrollTo(0)
  or scrollTo(last) when canScroll returns false.
- **Embla `scrollSnapList()` length ≠ slides length on track carousels.**
  Was rendering one dot per slide; on desktop with 2-3 cards visible,
  some dots had no real snap point. Fix: source dot count from
  `scrollSnapList()` via the `reInit` event.
- **Mobile carousel arrows clipping when `arrowsPosition='outside'`.**
  Container wrapper had `px-2` on mobile, not enough room. Switched
  Menu and TodaysBench to overlay arrows with dots-below.
- **Hero headline text-7xl overflowing on phones.** Scaled mobile
  sizes down: text-5xl primary / text-4xl secondary, scaling up at
  sm/md/lg.

---

## Current Build Step

**Steps 1-15 of the master prompt's build order are COMPLETE.**
**Step 16 is partially shipped:** Hero, Story, TodaysBench, Menu are
real; Visit is still a stub.

**Next session (Session 7):** Build the Visit section. Real content
ready: 157 Gloucester Road, SW7 4TH, Mon-Fri 7:30-17:00, Sat & Sun
8:30-17:00. Probably a 2-column layout (info left, embedded map or
shopfront image right) — match the moss/cream rhythm with whatever
fits the page flow best.

After Visit:
- Step 17: Contact form
- Steps 18-22: per master prompt

> 💡 **Recommended:** run `/compact` at the start of Session 7.

> ⚠️ **Open questions for Session 7:**
> - Visit section design: side-by-side info + map embed, or stacked
>   image-then-info? CSP currently has `frame-src 'none'`; embedding
>   a Google Maps iframe means relaxing that to
>   `frame-src https://www.google.com`. Or use a static map image
>   (no iframe, no CSP change).
> - Once Visit lands, run final smoke tests for Step 20.

---

## Decisions Made in Session 6

| Decision | Reasoning | Alternatives rejected |
|---|---|---|
| Sub-divide Step 16 across many commits | Five sections with imagery + tests is too much for one session at master-prompt quality | Ship all at once (would have run out of context, low test discipline) |
| Build BakeMyDay-inspired redesign on a feature branch | Parallel design exploration; safe to abandon if Essam disliked it | Modify main directly (risky for a one-page demo) |
| Adopt branch-per-feature as default workflow | Worked well on the redesign branch; cost of an unused branch is zero | Keep direct-to-main for everything (loses safety + history clarity) |
| Sync Menu with real photographed menu mid-session | Real names + prices always beat plausible ones once supplied | Keep speculative menu and update later (would have shipped wrong info) |
| Drop drinks (coffee, tea, matcha) from Menu after sync | Photographed menu is bakery-only — drinks live on a different menu we don't have | Keep speculative drinks alongside real bakery (mixed-truth, dishonest demo) |
| Bespoke Hero carousel, generic Carousel for the rest | Hero's full-viewport h1 + per-slide CTA shape was too specific to lift cleanly | Force everything through the generic component (would have made the API muddy) |
| Manual cycling in scrollPrev/scrollNext at edges | Embla's loop quirk made arrows feel broken on desktop track carousels | Disable arrows at edges (looks intentional but worse UX); use a different library (overkill) |
| Single new dependency (embla-carousel-react + autoplay, ~7KB) | Accessible, lightweight, modern; alternatives were heavier (swiper) or hand-rolled (more code, more bugs) | Roll own carousel logic (more LOC, less battle-tested) |
| HJEMmade card uses moss-green fallback bg until image lands | Same pattern as Hero on `main` — section reads as intentional even with missing image | Block the commit until image arrives (kills momentum) |
| `LOCAL_HTTP_TEST=1` env var to skip `upgrade-insecure-requests` | Right escape hatch — opt-in, doesn't weaken default | Remove the directive entirely (would weaken prod CSP) or test only over HTTPS via ngrok (extra signup) |

---

## Known Issues or Open Questions

### Resolved during Session 6
- ✅ Step-16 sub-divide pattern (Hero → Story → TodaysBench → Menu).
- ✅ Real menu data sync from in-store photograph.
- ✅ Mobile responsiveness pass on Hero text + card carousel arrows.
- ✅ Carousel cycling at end (manual `scrollTo(0)` fallback).
- ✅ Dot-count drift (use `scrollSnapList()` length).
- ✅ `upgrade-insecure-requests` blocking HTTP LAN testing.
- ✅ Branch-per-feature workflow decision.

### Carried over / still open
- **Visit section not yet built.** Address + hours + map design
  decision pending — see "Open questions for Session 7" above.
- **Drinks menu unknown.** When it surfaces, add a Drinks card back
  to the Menu carousel using the unused `coffee.jpeg` and
  `matcha.jpeg` images already in `/public/images/menu/`.
- **2 moderate-severity vulnerabilities** in Next.js's bundled
  `postcss` dep (`GHSA-qx2v-qp2m-jg93`). Not actionable. Master
  prompt gate is high+ only. Add to ERRORS.md in Step 21.
- **No CLAUDE.md or ERRORS.md yet** — generation scheduled for
  Step 21.
- **Hjem owners' actual identity** — still unknown. Story copy
  stays in generic "we" framing per deviation 6.5 until real
  owner copy arrives.
- **Boilerplate `app/page.tsx`** — replaced; now imports Hero,
  Story, TodaysBench, Menu, plus a single SectionStub for Visit.
- **CookieConsent / GAScript SSR-only branches**
  (`getServerSnapshot`) intentionally uncovered. Suite well above
  gates.
- **Sitemap regeneration** — use `npm run build` (not `npx next build`)
  to fire `postbuild`. If stale, run `npx next-sitemap` directly.
- **Standalone production server testing on phone:** copy
  `public/` and `.next/static/` into `.next/standalone/` after
  build, then `node .next/standalone/server.js` with
  `LOCAL_HTTP_TEST=1` and `HOSTNAME=0.0.0.0`. See deviation entry
  for the LOCAL_HTTP_TEST var.

---

## Test Status

- **137 tests passing** across 14 suites (118 → 137, +19 from Session 6)
  - env.test.ts: 18
  - sanitize.test.ts: 16
  - rate-limit.test.ts: 10
  - honeypot.test.ts: 8
  - legal-pages.test.tsx: 13
  - CookieConsent.test.tsx: 13
  - cookie-consent-ga.test.tsx: 6
  - Navbar.test.tsx: 7
  - Footer.test.tsx: 4
  - **Hero.test.tsx: 6** *(rewrote for carousel)*
  - **Story.test.tsx: 5** *(updated for carousel)*
  - **Menu.test.tsx: 6** *(updated for carousel)*
  - **TodaysBench.test.tsx: 5** *(new in Session 6)*
  - **Carousel.test.tsx: 19** *(new in Session 6)*
- Coverage: **93.53% statements, 92.94% branches, 87.3% functions, 95.02% lines**
  - All sections at 100% on every metric except Hero (85.71% statements)
  - Carousel.tsx: 86.36% statements, 91.83% branches (uncovered: edge-cycling fallbacks that embla doesn't fire in jsdom)
  - sanitize.ts, rate-limit.ts, honeypot.ts: 100% on every metric
  - DemoDisclaimer.tsx, LegalLayout.tsx, Footer.tsx, Navbar.tsx: 100%
  - CookieConsent.tsx: 95% statements (line 61 = `getServerSnapshot`, SSR-only)
  - GAScript.tsx: 95% statements (line 59 = `getServerSnapshot`, SSR-only)
  - env.ts: 94.73% statements (intentional uncovered branch)
- Last full suite run: **PASSED** (5.913s)
- Last `next build`: **PASSED** (5 routes prerendered: /, /cookie-policy, /privacy-policy, /terms-and-conditions, /_not-found)
- Last sitemap regeneration: **PASSED** (4 public URLs)

### Tests still to write (next sessions, in build order)
1. `tests/unit/components/sections/Visit.test.tsx` (Step 16 finish)
2. `tests/unit/components/ContactForm.test.tsx` (Step 17)
3. `tests/integration/api/contact-form.test.ts` (Step 17)
4. `tests/integration/api/security-headers.test.ts` (Step 19)
5. `tests/smoke/render.test.tsx` (Step 20)
6. `tests/smoke/navigation.test.tsx` (Step 20)
7. `tests/smoke/accessibility.test.tsx` (Step 20)

---

## How to Resume

1. Open Claude Code in `c:\Users\noure\Desktop\apps_websites\websites\` (the parent — `git -C hjem-kensington` works for git commands).
2. Paste **MASTER_PROMPT.md** at session start.
3. Paste **this SESSION_HANDOFF.md**.
4. State: *"Resuming Hjem Kensington build from Step 16 — Visit section."*
5. Claude should run the four health-check commands, confirm clean state, then present a Session 7 plan covering the Visit section before writing code.
6. Per the new branch-per-feature rule, the first move on a non-trivial feature is to create a branch — name it `feature-visit` or similar before any code changes.

---

## Files Needing Attention

- `app/page.tsx` — `SectionStub` helper still used for Visit. Once
  Visit ships, delete the helper.
- `CLAUDE.md` (root) — still just `@AGENTS.md` import. Full project
  CLAUDE.md generated in Step 21.
- `public/images/story.jpeg` and `public/images/hero.jpg` — leftover
  from earlier sub-commits, no longer referenced. Safe to delete or
  leave; not load-bearing.

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

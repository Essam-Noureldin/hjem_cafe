# Master Prompt Deviations Log

Living record of every place the actual Hjem Kensington build diverged from
`MASTER_PROMPT.md`. Use this to refine the prompt before the next project.

Each entry: **what the prompt says** → **what we actually did** → **why** →
**suggested prompt update**.

---

## Session 1 — bootstrap, env, jest setup

### 1.1 Tailwind v4 vs v3
- **Prompt says:** "Generate `tailwind.config.ts` with a theme.extend block …
  colors, fontFamily, spacing as named tokens."
- **What we did:** Tailwind v4. Brand tokens defined CSS-first in
  `app/globals.css` via `@theme { --color-cream: #efe8dc; … }`. No
  `tailwind.config.ts` file at all.
- **Why:** Tailwind shipped v4 as default in late 2024. The CSS-first config
  is the new official pattern — no JS config, faster builds, simpler mental
  model.
- **Prompt update:** Replace the entire "Tailwind config (tailwind.config.ts)"
  section with a Tailwind v4 `@theme` block example. Mention v3 only as a
  fallback for legacy projects.

### 1.2 Next.js version
- **Prompt says:** "Next.js 14+ (App Router)"
- **What we did:** Next.js 16.2.4.
- **Why:** "14+" is satisfied, but 16 has breaking changes from 14: async
  `params`/`searchParams` (now `Promise<>`), Turbopack default, different
  manifest formats. Codebase has an `AGENTS.md` that says explicitly
  "This is NOT the Next.js you know."
- **Prompt update:** Pin to a specific Next major version per project, OR
  add a section: "Before writing any Next code, read
  `node_modules/next/dist/docs/` for breaking changes from your training
  data — do not assume the API matches what you know."

### 1.3 Jest transformer
- **Prompt says:** "ts-jest" listed in the testing stack.
- **What we did:** Used `next/jest` wrapper (SWC transform).
- **Why:** `next/jest` matches how Next compiles the real app. Keeps tests
  and prod in sync. ts-jest is slower and can produce different type
  resolution from the production build.
- **Prompt update:** Replace `ts-jest` with `next/jest` in the testing
  stack list.

### 1.4 `setupFilesAfterEnv` typo guard
- **Prompt says:** Refers to `setupFilesAfterEach` once (typo).
- **What we did:** Used the correct option name `setupFilesAfterEnv`.
- **Prompt update:** Fix the typo. (And the master prompt should clarify
  that there is *no* `setupFilesAfterEach` — both Jest and TypeScript flag
  it.)

### 1.5 Jest `modulePathIgnorePatterns` for `.next/`
- **Prompt says:** Doesn't address this.
- **What we did:** Added `modulePathIgnorePatterns: ["<rootDir>/.next/"]`.
- **Why:** After `next build`, `.next/standalone/package.json` collides
  with the root `package.json` in Jest's haste-map. Without this, every
  post-build test run prints a noisy "duplicate module" warning.
- **Prompt update:** Include this in the example `jest.config.ts` snippet
  in the "Testing setup" section.

### 1.6 env validation type signature
- **Prompt says:** `function validate(source: NodeJS.ProcessEnv = process.env)`
  (implied).
- **What we did:** `function validate(source: EnvSource = process.env)`
  where `type EnvSource = Record<string, string | undefined>`.
- **Why:** TypeScript's `NodeJS.ProcessEnv` requires `NODE_ENV`. Tests pass
  partial objects without `NODE_ENV`, so the strict type would force every
  test to specify it.
- **Prompt update:** Show the permissive `Record<string, string|undefined>`
  alias in the env.ts pattern, with a comment explaining why.

### 1.7 ESLint global ignores
- **Prompt says:** Doesn't enumerate ignores beyond standard `.next/`.
- **What we did:** Added `coverage/**`, `.jest-cache/**`, `.husky/_/**`.
- **Why:** Jest writes HTML coverage reports to `coverage/` which ESLint
  then tries to parse. `.husky/_/` contains Husky's own helper scripts,
  not user code. Both produce noisy false positives.
- **Prompt update:** Add these three globs to the `.gitignore` /
  `eslint.config.mjs` examples.

### 1.8 CSP — no Google Fonts entries
- **Prompt says:** CSP must include `fonts.googleapis.com` and
  `fonts.gstatic.com`.
- **What we did:** Neither is in our CSP. `font-src 'self' data:` only.
- **Why:** Next.js `next/font/google` downloads fonts at build time and
  serves them locally. The fonts never leave the same origin. Tighter CSP
  for free.
- **Prompt update:** Make the Google Fonts entries conditional: "Add only
  if you load fonts from `<link>` tags. If using `next/font/google` the
  fonts are local — omit and use `font-src 'self' data:`."

### 1.9 PowerShell HEREDOC + git commit
- **Prompt says:** Doesn't address platform.
- **What we did:** Wrote commit message to `.commit-msg-tmp.txt` and used
  `git commit -F`.
- **Why:** PowerShell's `@'…'@` HEREDOC mangled regex characters (`<`,
  `>`, `/`) when piping to git, triggering "Invalid path '/lib'".
- **Prompt update:** Add a "Windows / PowerShell quirks" section: prefer
  `git commit -F file.txt` over inline messages when the message contains
  shell-special characters.

---

## Session 2 — sanitize, rate-limit, honeypot, sitemap

### 2.1 next-sitemap as runtime dep, not dev dep
- **Prompt says:** Doesn't specify dev vs runtime.
- **What we did:** Listed `next-sitemap` under `dependencies` (not
  `devDependencies`).
- **Why:** Vercel only installs `dependencies` by default during a
  production build. `next-sitemap` runs at build time via the `postbuild`
  script, so it must be in `dependencies` or the build breaks on Vercel.
- **Prompt update:** "Install next-sitemap as a runtime dependency
  (`npm install --save next-sitemap`, not `--save-dev`) — it runs during
  Vercel's production build."

### 2.2 Sanitize: rolled-own regex
- **Prompt says:** "strip all HTML tags before processing" — implies
  using a library or a robust sanitizer.
- **What we did:** Tiny regex: `/<\/?[a-zA-Z][^>]*>/g`.
- **Why:** We want zero HTML, not allowlisted HTML. `sanitize-html`
  (~30KB) is designed for the wrong shape. Our regex correctly preserves
  math comparisons like `temp < 0 or > 30` because it requires a letter
  after `<`.
- **Prompt update:** Add a callout: "If the goal is *zero* HTML, a tiny
  regex is fine — `sanitize-html` is for allowlisting which is a
  different problem."

### 2.3 Rate limit: caller passes pre-hashed identifier
- **Prompt says:** "rate limiting via … `Map` with TTL cleanup". Implies
  the library reads the IP itself.
- **What we did:** `rateLimit(identifier, options)` is a pure function.
  Caller hashes the IP and passes the hash in.
- **Why:** Pure functions are easier to test. Decouples from Next's
  `headers()` helper. Reusable for non-IP identifiers (user ID once
  auth exists).
- **Prompt update:** Recommend the pure-function pattern in the
  rate-limit spec.

### 2.4 Sitemap files gitignored
- **Prompt says:** Doesn't address whether to commit them.
- **What we did:** Gitignored `public/sitemap*.xml` and `public/robots.txt`.
- **Why:** Vercel regenerates them on every deploy. Committing creates
  timestamp-only diffs on every PR.
- **Prompt update:** Add these globs to the `.gitignore` example with a
  one-line explanation.

---

## Session 3 — legal pages

### 3.1 `react/no-unescaped-entities` on long prose
- **Prompt says:** "ESLint clean: zero errors" — strict.
- **What we did:** Reworded JSX prose to avoid ASCII apostrophes and
  straight quotes in text nodes.
- **Why:** `eslint-config-next` enables `react/no-unescaped-entities` by
  default. On a prose-heavy legal page it fires 30+ times. Three options
  considered:
  1. Escape every quote with `&apos;` / `&quot;` (busywork, hurts
     readability of source).
  2. Disable the rule for `app/**/*.tsx` (suppression — feels wrong).
  3. Reword prose to avoid the offending characters (loses some
     typography but keeps source readable and rule active).
  We picked (3).
- **Prompt update:** Either disable `react/no-unescaped-entities` for
  long-form pages by default in the project's ESLint config, OR add a
  rule: "When writing legal/long-prose pages, use Unicode typographic
  quotes (`'`, `"`, `"`) in source. They satisfy the rule and produce
  better typography." Note: a *naive* regex substitution ruins JSX
  attributes — only edit text nodes.

### 3.2 next-sitemap intermittent during postbuild
- **Prompt says:** Doesn't mention this failure mode.
- **What we did:** First `next build` produced a sitemap containing only
  `/`. Re-running `npx next-sitemap` fresh against the same `.next/`
  artefacts produced the correct 4-URL sitemap.
- **Why:** Suspected race between Turbopack's manifest writes and
  next-sitemap's manifest reads in the postbuild script.
- **Prompt update:** Add to ERRORS.md template: "If sitemap is missing
  routes after `next build`, recovery is `rm public/sitemap*.xml
  public/robots.txt && npx next-sitemap`. Vercel's clean-room build
  doesn't seem to hit this — local-only quirk."

### 3.3 Test approximation for "page returns 200"
- **Prompt says:** Step 10 test list: `/privacy-policy returns 200`,
  etc. Implies a real HTTP request.
- **What we did:** Asserted `expect(() => render(<Component />)).not.toThrow()`.
  In Jest there is no real HTTP layer.
- **Why:** True end-to-end HTTP testing belongs in the smoke tests at
  Step 20 (`tests/smoke/render.test.tsx`) — those run against the actual
  Next dev server. Unit tests inside Jest can only approximate.
- **Prompt update:** Re-word Step 10's test spec from "returns 200" to
  "renders without throwing" and explicitly defer real HTTP checks to
  Step 20.

### 3.4 Coverage scope for App Router pages
- **Prompt says:** "Collect coverage from: components/**, lib/**,
  app/api/**".
- **What we did:** Used exactly that — App Router *pages* (not API
  routes) are not in coverage.
- **Why:** Pages are tested for behaviour (renders + metadata), not LOC
  coverage.
- **Prompt update:** Confirm in the prompt that this is intentional —
  the current wording could read either way. Add: "App Router pages are
  excluded from coverage by design; they're tested for outcome, not
  line coverage."

### 3.5 Demo disclaimer pattern (project-specific, but worth surfacing)
- **Prompt says:** Doesn't address the speculative-build legal-template
  liability.
- **What we did:** Loud yellow `DemoDisclaimer` banner on every legal
  page identifying the demo nature and naming the developer as contact.
- **Why:** AI-generated legal templates that *look* binding are a real
  liability for both the developer and the (prospective) client.
- **Prompt update:** For every speculative pre-sale build, mandate a
  visible "demo, not in force" disclaimer on legal pages until the
  client signs and a solicitor reviews.

### 3.6 Aggressive perl substitution caution
- **Not a deviation, but a recoverable mistake worth surfacing.** I ran
  a global perl regex to substitute ASCII quotes for Unicode curly
  quotes — it rewrote quotes inside TypeScript imports and JSX
  attributes too, breaking syntax. Recovered by rewriting from scratch.
- **Prompt update / personal rule:** "Never run a global character
  substitution on `.tsx` files — JSX text vs JSX attributes vs TS
  syntax are all different contexts. If you need to touch only prose,
  do it via Edit on specific lines, not bulk regex."

---

## Session 4 — GA, CookieConsent, wiring (Steps 11-13)

### 4.1 React 19.2 lint rule kills the master prompt's CookieConsent pattern
- **Prompt says:** the literal CookieConsent pattern in the COOKIE
  CONSENT BANNER section:
  ```
  const [consent, setConsent] = useState<string | null>(null);
  useEffect(() => {
    setConsent(localStorage.getItem('cookie_consent'));
  }, []);
  ```
- **What we did:** replaced both CookieConsent and GAScript with
  `useSyncExternalStore` — subscribe (storage event + custom events),
  getSnapshot (read localStorage), getServerSnapshot (return null/false).
- **Why:** React 19.2 ships `react-hooks/set-state-in-effect`, which
  flags exactly the prompt's `useEffect(() => setX(...))` one-shot
  pattern. The rule cites React's official guidance: effects are for
  syncing with external systems via subscriptions, not for reading
  external state once on mount. `useSyncExternalStore` is the React-
  blessed primitive for "treat this browser API as an external store."
  Trade-off: `getServerSnapshot` returning null causes a brief frame
  flash for *returning* visitors (server says banner; client snapshot
  says "already accepted"; banner unmounts post-hydration). First-visit
  behaviour is unchanged. No flash in JSDOM tests.
- **Prompt update:** replace the cookie-consent code example with the
  `useSyncExternalStore` pattern. Note in the new example that React
  19.2+ flags the old pattern. Add a one-line callout: "If you see
  `react-hooks/set-state-in-effect` errors anywhere else in the
  codebase, the fix is almost always `useSyncExternalStore` for
  browser-API-as-store, or moving the setState into a subscription
  callback inside the effect."

### 4.2 Wiring test mocks `next/script` rather than relying on jsdom
- **Prompt says:** Step 13 integration test verifies "GA tag is/isn't
  in DOM" — implies querying the actual rendered DOM.
- **What we did:** in `tests/integration/flows/cookie-consent-ga.test.tsx`
  we `jest.mock("next/script", ...)` to render a plain `<script>` with
  a `data-testid`, and assert on that.
- **Why:** `next/script` with `strategy="afterInteractive"` relies on
  Next's runtime script-loader machinery to actually inject the tag
  into the document. That runtime is not available under jsdom — the
  Script component renders, but the script tag may or may not appear
  in the DOM depending on Next's internal scheduling. Mocking isolates
  the gate-decision (the thing this test cares about) from next/script
  internals (a different concern).
- **Prompt update:** in the master prompt's "TESTING SETUP" section,
  add a callout that `next/script` should be mocked in component-level
  integration tests. End-to-end script injection belongs in Step 20's
  smoke tests against a real Next dev server, or in a Playwright suite
  later.

### 4.3 Step 13 test filename `.tsx` not `.ts`
- **Prompt says:** at line ~282: `tests/integration/flows/cookie-consent-ga.test.ts`.
- **What we did:** `cookie-consent-ga.test.tsx` (the `x` is required —
  the test renders React components and uses RTL).
- **Prompt update:** rename in the master prompt.

### 4.4 Custom `cookie-consent-changed` event in addition to the public `cookie-consent-accepted`
- **Prompt says:** dispatch `cookie-consent-accepted` on Accept; doesn't
  mention any other event.
- **What we did:** dispatch both `cookie-consent-accepted` (public —
  GAScript listens) AND `cookie-consent-changed` (internal — used by
  `useSyncExternalStore` subscribers in the same tab to re-snapshot
  after BOTH Accept and Decline).
- **Why:** the browser's native `storage` event only fires in OTHER
  tabs, not the originating tab. Without an internal event, clicking
  Decline in the current tab would not trigger a re-render of the
  banner (snapshot still returns the cached null until something
  forces a re-snapshot).
- **Prompt update:** in the cookie-consent banner section, document
  both events: "GAScript listens for `cookie-consent-accepted`. Both
  Accept and Decline must also dispatch a same-tab notify event (e.g.
  `cookie-consent-changed`) so any `useSyncExternalStore` consumer
  in the same tab re-snapshots."

### 4.5 GAScript reads env at the server layout, not at the client
- **Prompt says:** the example pattern shows GAScript reading
  `NEXT_PUBLIC_GA_ID` itself.
- **What we did:** `app/layout.tsx` (server component) reads
  `process.env.NEXT_PUBLIC_GA_ID` and passes it as a prop to
  `<GAScript gaId={...} />`.
- **Why:** keeps env access on the server. The client component
  receives a primitive prop and never imports `lib/env.ts` (which
  would pull server-only modules into the client bundle).
- **Prompt update:** in the GA implementation section, prefer the
  server-reads-env-and-passes-prop pattern. It's clearer about the
  trust boundary and avoids subtle bundle-leak risks.

### 4.6 SSR-only branches uncovered (acceptable)
- **Prompt says:** 80% coverage gates everywhere.
- **What we did:** CookieConsent's `getServerSnapshot` and GAScript's
  `getServerSnapshot` are uncovered — JSDOM tests use the client
  snapshot path. Both files sit at 95%/100% and the suite as a whole
  is at 96.66% statements. Threshold met.
- **Why:** there's no jsdom fixture for "rendered on a real Next
  server, then hydrated." A true test would require a full Next.js
  test server, which adds disproportionate complexity for a one-line
  branch.
- **Prompt update:** add to the testing section: "Server-snapshot
  branches in `useSyncExternalStore` consumers are intentionally
  uncovered — they only execute during real SSR. Document the gap
  rather than chase 100% by mocking a render environment that doesn't
  exist."

---

## Session 5 — Navbar + Footer

### 5.1 `npx next build` does not run the postbuild hook
- **Prompt says:** Quick health-check commands list `npx next build`
  with the comment "also runs postbuild (next-sitemap)". The
  `package.json` is set up with `"postbuild": "next-sitemap"`.
- **What we did:** Ran `npx next build` — the build succeeded but
  `next-sitemap` did not run. `public/sitemap.xml` was the previous
  session's stale copy (timestamp two days old). Ran `npx
  next-sitemap` directly afterwards to refresh it.
- **Why:** npm lifecycle hooks (`pre*`/`post*`) only fire when the
  named script is invoked through the npm runner — `npm run build`,
  not `npx next build`. `npx` runs the binary directly and bypasses
  the lifecycle. This explains the "next-sitemap intermittent during
  postbuild" mystery from Session 3 (it was never running) and why it
  "behaved" in Session 4 (the build was likely invoked via
  `npm run build` then, or next-sitemap was run separately).
- **Prompt update:** in the "Quick health-check commands" block,
  change `npx next build` to `npm run build` so the postbuild hook
  fires. Keep `npx next build` only as a "build-only, skip sitemap"
  shorthand if needed. Update ERRORS.md (Step 21) entry for
  next-sitemap to remove the "race condition" framing — root cause
  was always the wrong invocation.

### 5.2 Navbar nav targets are anchor links, not routes
- **Prompt says:** Step 14 spec — "Navbar.test.tsx: renders logo +
  nav links, mobile menu hidden by default, opens on hamburger
  click, closes when a link is clicked, all hrefs valid."
  Doesn't specify what hrefs.
- **What we did:** Four links — Home (`/`), Story (`/#story`),
  Menu (`/#menu`), Visit (`/#visit`). Three of them are in-page
  anchors targeting sections of the homepage that don't exist yet
  (Step 16 builds them).
- **Why:** Hjem is a one-page brochure. There are no `/story`,
  `/menu`, or `/visit` routes — that would be five pages worth of
  scaffolding for a sales demo. Anchor links into a single homepage
  is the right shape for the brief.
- **Prompt update:** add to Step 14 — "Decide nav-link strategy
  before writing the test. One-page brochures use anchor links
  (`/#section`); multi-page sites use route links (`/page`). The
  test must encode whichever shape was chosen so a refactor doesn't
  silently swap them."

### 5.3 Avoided double `<main>` landmark in root layout
- **Prompt says:** doesn't address this directly — the example
  layout in the prompt wraps `{children}` in `<main>`.
- **What we did:** Wrapped `{children}` in a plain `<div
  className="flex-1">` instead. The legal pages already provide
  their own `<main>` (via `LegalLayout`), and the homepage will in
  Step 16.
- **Why:** Two `<main>` elements in one document is invalid HTML
  and a screen reader anti-pattern. Letting pages own their
  landmark is the correct App Router pattern.
- **Prompt update:** in Step 14/15 (chrome mounting), add: "Do not
  wrap `{children}` in `<main>` at the root layout — pages own
  their `<main>`. Use a non-semantic `<div className='flex-1'>` to
  push the footer down."

### 5.4 Single social link instead of a block
- **Prompt says:** Footer test must verify "social links have
  aria-label attributes" (plural).
- **What we did:** One social link (Instagram). The test asserts
  "at least one labelled link" rather than a specific count.
- **Why:** Hjem is a tiny independent bakery. Faking a presence on
  Twitter, TikTok, LinkedIn, Facebook, etc. is dishonest demo work
  — better to ship one real-looking link than five empty ones. The
  test is loose on count for the same reason: the right number is
  whatever matches the business's actual social presence.
- **Prompt update:** soften Step 15 to "social links (one or more)
  with aria-label attributes". Encourage matching the real business
  rather than a fixed icon set.

---

## Session 6 — homepage, Hero first

### 6.1 Step 16 split into sub-steps (Hero first)
- **Prompt says:** Step 16 is a single deliverable — "site components and
  pages" (Hero, Story, Menu, Visit, Testimonials) all built in one
  session.
- **What we did:** Built Hero only this session. Story / Menu / Visit
  ship as minimal stubs (eyebrow + "Coming up" h2) with the right `id`
  attributes so navbar anchor links resolve. Subsequent sub-steps will
  replace each stub with the finished section.
- **Why:** Step 16 is content-heavy and design-bearing. A single
  session's worth of context is not enough to build five sections at
  master-prompt quality (test-first, integration scan, asset wiring) in
  one go. Splitting also lets each section get a proper image-prompt /
  copy review before code lands.
- **Prompt update:** Add to Step 16 — "If the homepage has more than
  three sections, plan to split this step across multiple sessions, one
  section at a time. Each section ships test-first with full integration
  scan, then commits before the next starts. Use placeholder stubs (with
  the correct `id` attributes) for not-yet-designed sections so navbar
  anchors resolve from day one."

### 6.2 Hero image is AI-generated, dropped into /public/images/
- **Prompt says:** "Use next/image with real client photos." Implies
  real photography supplied by the client.
- **What we did:** For a speculative build with no client engagement
  yet, the Hero image is generated by the user from prompts I write.
  Code uses `<Image src="/images/hero.jpg">`; if the file is missing
  the section still reads as intentional thanks to the `bg-moss`
  fallback + dark scrim.
- **Why:** Speculative demos have no client and therefore no client
  photography. AI generation gives editorial-quality imagery that
  matches the brand palette. Once a real client signs, real photos
  drop into the same path with no code change.
- **Prompt update:** Add to the imagery section — "For speculative
  builds, AI-generated imagery is acceptable. Always include a
  brand-coloured fallback background on hero sections so a missing or
  loading image doesn't break the design. Replace AI imagery with real
  photography immediately after the client signs."

### 6.3 Metadata correction — "two doors" claim was always wrong
- **Prompt says:** Doesn't address this directly.
- **What we did:** Corrected `app/layout.tsx` metadata in the same
  commit as Hero. The earlier copy claimed "two doors in Kensington and
  South Kensington"; Hjem actually has one location at 157 Gloucester
  Road. Replaced both `description` and `openGraph.description`.
- **Why:** Metadata feeds search snippets and social previews. A
  factually wrong claim there is worse than a placeholder — it ships
  to Google before a single visitor sees the homepage.
- **Prompt update:** Add to the metadata-defaults step — "Do not write
  speculative location/staffing/founding-date claims into metadata
  before they are verified. Better to ship a generic-but-true
  description than a specific-but-wrong one."

### 6.4 Menu items + prices are speculative
- **Prompt says:** Step 16 Menu spec implies real menu data from the
  client.
- **What we did:** All 17 items and every price in `components/sections/Menu.tsx`
  are educated guesses — Danish-bakery staples (sourdough, rugbrød,
  cardamom buns, kanelsnegle, smørrebrød) plus IG-confirmed offerings
  (matcha, kimchi). UK indie-café prices, Spring 2026 plausible range.
  A small disclaimer at the bottom of the section reads "Prices
  indicative. See in-store for current offering."
- **Why:** Hjem hasn't engaged yet — there's no real menu to ship. The
  alternative was to ship a near-empty menu or no Menu section, both of
  which gut the demo. Plausible specifics + a hedge is the honest
  middle ground.
- **Prompt update:** Add to Step 16 — "If the Menu section ships before
  the client has confirmed real items, include a one-line indicative-
  prices disclaimer at the bottom of the section. Items live in a
  single `MENU` const at the top of the component so a real-data swap
  is one edit, not a refactor."

### 6.6 Menu data synced with the real counter menu (mid-Session 6)
- **Prompt says:** Step 16 Menu spec implies you confirm real menu
  data with the client before shipping; deviation 6.4 logged a
  speculative-prices hedge for the gap before that confirmation.
- **What we did:** Mid-session, Essam photographed the in-store
  counter menu and shared it. We updated `components/sections/Menu.tsx`
  to mirror it: three real categories (HJEMmade Bakery, Buns &
  Pastries, Bread Station), 23 real items, real prices verbatim
  including dual full/half pricing for the sourdough loaves
  (£7.50/£3.90 seeded; £6.50/£3.20 plain). Categories that aren't
  on the photographed menu (Coffee, Tea & Matcha, Kitchen) were
  removed for now — the photographed menu is bakery-only; drinks
  live on a separate menu we don't yet have.
- **Why:** Real prices and real names are always better than
  plausible ones once the client supplies them. Keeping the
  speculative versions after the real menu lands would be
  embarrassing on the demo pitch.
- **Carry-over speculation:** descriptions are still my interpretation
  (factual where I'm confident — GF labels, Danish names; minimal
  where I'd be embellishing). The "Menu indicative — items rotate"
  disclaimer at the section foot acknowledges this.
- **Prompt update:** Add to Step 16 — "If the client supplies real
  menu data partway through the build, sync immediately and log the
  deviation. Real names and prices are non-negotiable once known.
  Descriptions can remain interpretive but should be conservative —
  GF tags, language origin, common-knowledge bakery descriptors only."

### 6.5 Story copy uses generic "we" framing, no invented founders
- **Prompt says:** Step 16 Story spec implies real owner copy — names,
  history, the personal narrative behind the bakery.
- **What we did:** Three short paragraphs in first-person plural ("we",
  "the bakers"). No founder names, no founding-date claim, no
  invented biography. The Hjem-means-home reveal carries the brand;
  the matcha/kimchi-alongside-cardamom-buns line establishes voice.
- **Why:** Hjem's owners haven't engaged — there's no real biography
  to ship. Inventing one is dishonest demo work and the bigger risk:
  if a real founder signs and we've already built a fake history into
  the demo, the rewrite is a copy-edit at best, an awkward
  conversation at worst. Generic-but-grounded ("one room on Gloucester
  Road, baking from before light") sets a believable tone without
  fabricating personal facts.
- **Prompt update:** Add to Step 16 — "If the Story section ships
  before the client has provided real owner copy, default to
  first-person plural with no names, no founding-date, no
  family/origin claims. Anchor character in concrete operational
  detail (opening hours, what's on the bench, what's gone by lunch)
  rather than invented biography."

---

### 6.7 Branch-per-feature workflow declared mid-session
- **Prompt says:** Master prompt's git/commit guidance describes a
  linear, direct-to-main workflow with descriptive commit messages.
  Doesn't address feature branches.
- **What we did:** Mid-Session 6 (2026-05-07), Essam declared a new
  workflow rule: every new feature, section, or non-trivial change
  ships on its own branch off `main`, merged back when confirmed
  working. Trivial fixes (typo, kill server, one-line edit) can
  stay on whichever branch is currently checked out.
- **Why:** the BakeMyDay-inspired redesign was the first time we
  used a branch (`redesign-bakemyday-inspired`) as a parallel
  exploration — gave Essam a safe place to experiment without
  risking the editorial design on `main`. Worked well enough that
  he wants it as the default pattern going forward. Side benefit:
  branch history is useful evidence for what changed when, beyond
  what commit messages alone capture.
- **Application detail:**
  - First commit on a feature branch sets up scaffolding (test
    file, etc.); subsequent commits build the feature test-first
    per existing rules.
  - Push the branch on first commit so it exists at remote.
  - On merge: prefer fast-forward (`git merge --ff-only`); accept a
    merge commit only if main has moved during the feature work.
  - Branches stay in remote unless Essam asks to prune them. The
    history value beats the cleanup discipline.
- **Memory:** saved as `feedback_branch_per_feature.md` so the rule
  survives `/compact` and future sessions.
- **Prompt update:** Add a "Branch workflow" section to the master
  prompt: "Every feature ships on its own branch off main. Branch
  name describes the feature (`feature-contact-form`,
  `redesign-X-inspired`, `fix-mobile-nav`). First commit sets up
  scaffolding; subsequent commits build test-first. Merge fast-forward
  when the feature is confirmed done. Trivial fixes (typos, dev
  server restarts, one-line edits) bypass branching."

---

## Session 7 — Visit section, Step 16 finished

### 7.1 No embedded Google Maps iframe — outbound directions link instead
- **Prompt says:** Under "EVERY SITE MUST INCLUDE": "Contact section:
  address, phone, Google Maps embed placeholder, contact form."
  CSP example in `next.config.ts` shows `frame-src 'none'` with the
  note "if Google Maps embed is used, add https://maps.googleapis.com
  to frame-src and script-src."
- **What we did:** Visit section ships with no iframe at all. Address,
  hours, and a "Get directions" button that links to
  `https://www.google.com/maps/?q=...` with `target="_blank"` and
  `rel="noopener noreferrer"`. CSP `frame-src 'none'` stays intact.
- **Why:** an embedded map widget would mean (a) relaxing the CSP to
  allow `frame-src https://www.google.com`, (b) loading Google's
  third-party tracking inside the iframe regardless of our cookie
  consent state, (c) measurable hit to LCP for a section most
  visitors will scroll past or interact with via the link anyway.
  An outbound link does the same conversion job better: tap on a
  phone, the native Maps app opens already routing to 157 Gloucester
  Road. No CSP cost, no consent drift, no perf hit.
- **Phone number left out:** prompt also lists "phone" as a Visit
  required item. Hjem's number wasn't in the in-store research.
  Better to omit than to invent — same rule we applied to the
  speculative menu in 6.4 / 6.6.
- **Prompt update:** Soften the "Google Maps embed placeholder"
  line to "Google Maps directions link OR embed (default to link
  unless the brief specifically requires the embedded view — link
  preserves the strict CSP and avoids loading third-party trackers
  before consent)." Phone should be marked optional: include if
  the business publishes one, omit rather than invent.

---

## How to maintain this file

- Append a new entry under the current Session header whenever you
  notice a deviation, however minor.
- After Step 22 (project ship), copy the actionable "Prompt update"
  bullets into a single PR against `MASTER_PROMPT.md` in the parent
  workspace.
- Keep the entries factual — the goal is improving the prompt, not
  scoring the developer.

# DESIGN.md

The Hjem Kensington design system. Colours, type, spacing, animation. Where
to find each token, what it means, and the rules about how to use it.

---

## Brand identity

| Aspect | Value |
|---|---|
| Business | A small Danish bakery & specialty coffee shop |
| Location | Gloucester Road, Kensington, West London |
| Personality | Warm, neighbourhood, hand-crafted, quietly confident |
| Tone | Editorial — Danish *hygge* via West London. Not loud, not minimalist-cold. |
| Customer | The local who walks in three times a week, plus the weekend visitor who heard about it |

Voice cues:

- Use Danish words sparingly and with translation context (*Velkommen* in
  the hero — never untranslated body copy)
- "Made before light" rather than "Freshly baked"
- Concrete nouns ("stone-milled sourdough", "cardamom buns") over abstract
  marketing ("artisanal", "premium")
- Hours and address as plain facts, not as "Visit our beautiful boutique"

---

## Colour palette

Five brand colours. Defined in [app/globals.css](../app/globals.css). Every
other shade in the app should be a transparency layer (e.g. `text-bone/70`)
over one of these.

| Name | Hex | Tailwind class | Used for | Don't use for |
|---|---|---|---|---|
| `cream` | `#efe8dc` | `bg-cream`, `text-cream` | Page background, light surfaces | Type — too low contrast on bone |
| `moss` | `#2f3e33` | `bg-moss`, `text-moss` | Footer, primary CTA, dark bands, contrast accents | Body text on cream — too dark on dark would clash |
| `ink` | `#1f1a14` | `bg-ink`, `text-ink` | Body copy on cream | Primary CTA — feels too "blackboard" |
| `clay` | `#b58a78` | `bg-clay`, `text-clay` | CTA hover, accent links, error text, ::selection | Body text — accessibility contrast falls short |
| `bone` | `#f0e8da` | `bg-bone`, `text-bone` | Type and surfaces on dark backgrounds | Page background — too cool against the warmer cream |

**Rule:** never write arbitrary hex in component classes.

```tsx
// ✓ Right
<div className="bg-cream text-ink" />

// ✗ Wrong — bypasses the system, breaks searchability
<div className="bg-[#efe8dc] text-[#1f1a14]" />
```

### Colour pairing

```
On cream background:  ink (body), moss (CTAs/accents), clay (links/highlights)
On moss background:   bone (everything)
On bone background:   ink (body), moss (accents)
On ink background:    bone (rare — used for ::selection)
```

### Contrast ratios (WCAG AA target: 4.5:1 for body, 3:1 for large text)

| Pair | Contrast | Verdict |
|---|---|---|
| ink on cream | ~12.5 : 1 | AAA — body text passes everywhere |
| moss on cream | ~7.5 : 1 | AAA — fine for body and headings |
| clay on cream | ~3.2 : 1 | AA-large only — use for headings 18px+ or 14px+ bold; don't use for body |
| bone on moss | ~10 : 1 | AAA — fine for body |
| bone on ink | ~16 : 1 | AAA — bullet-proof |

> ⚠️ **Clay is decorative, not body.** It passes only at large sizes. Use
> it sparingly: as an accent, never as paragraph text on cream.

---

## Typography

| Role | Font | Weight | Where used |
|---|---|---|---|
| Display | **Fraunces** (variable, opsz + SOFT axes) | 400 / 600 | Headlines, hero, taglines, section eyebrows |
| Body | **DM Sans** | 400 / 500 / 600 | Body, navigation, form inputs, footer text |

Both loaded via [`next/font/google`](https://nextjs.org/docs/app/api-reference/components/font),
self-hosted from `/_next/static/`, served as variable fonts with `display: swap`.

### Type scale

```
font-display, 9xl  ──► Hero h1 (xl: 8rem / 128px)
                     │
font-display, 8xl  ──► Hero h1 (lg: 6rem / 96px)
                     │
font-display, 7xl  ──► Section h2 (lg: 4.5rem / 72px)
                     │
font-display, 6xl  ──► Section h2 (md: 3.75rem / 60px)
                     │
font-display, 5xl  ──► Hero h1 (mobile: 3rem / 48px)
                     │
font-display, 4xl  ──► Hero subheading
                     │
font-display, 2xl  ──► Card heading, Footer wordmark
                     │
font-body, lg      ──► Lead paragraph (1.125rem / 18px)
                     │
font-body, base    ──► Default body (1rem / 16px)
                     │
font-body, sm      ──► Form labels, footer links (0.875rem / 14px)
                     │
font-body, xs      ──► Eyebrow caps, copyright (0.75rem / 12px)
```

The display sizes step aggressively to give editorial bigness on desktop and
calm down on mobile. Use named Tailwind utilities (`text-5xl` etc.) — never
arbitrary `text-[42px]`.

### Typography rules

- Body line-height: `leading-relaxed` (1.625) for paragraph text
- Headings line-height: default (`1`) for display, `1.2` for h2/h3
- Letter-spacing: tracked-tight on display (`tracking-tight`),
  tracked-wide-uppercase on eyebrow caps (`tracking-widest uppercase text-xs`)
- Italics: only on Fraunces (which has a true italic), never DM Sans (which
  fakes it)
- Drop caps: don't. They look great on print, awkward in responsive web.

---

## Spacing system

We use Tailwind's default spacing scale (multiples of 4px). The conventions:

| Use case | Token | Pixels |
|---|---|---|
| Inside a button | `px-6 py-3` | 24×12 |
| Inside a card | `p-6` to `p-8` | 24–32 |
| Between siblings in a list | `space-y-3` to `space-y-6` | 12–24 |
| Section vertical padding | `py-16` to `py-24` (mobile), `py-24` to `py-32` (desktop) | 64–128 |
| Section horizontal padding | `px-4 sm:px-6` | 16 (mobile), 24+ (tablet up) |
| Container max-width | `max-w-6xl` (1152px) for sections, `max-w-3xl` (768px) for body copy | — |
| Footer top margin | `mt-24` | 96 — separates the dark band visually from page content |

**Section pattern:**

```tsx
<section id="story" className="py-24 lg:py-32">
  <div className="max-w-6xl mx-auto px-4 sm:px-6">
    {/* content */}
  </div>
</section>
```

---

## Component patterns

### Primary CTA (the green moss button)

```tsx
<Link
  href="#visit"
  className="inline-block bg-moss px-6 py-3 font-body text-sm uppercase
             tracking-widest text-bone transition-colors hover:bg-moss/90
             focus:outline-none focus:ring-2 focus:ring-moss focus:ring-offset-2"
>
  Visit us
</Link>
```

### Accent CTA (clay — hero overlay)

```tsx
<Link
  href="#menu"
  className="inline-block bg-clay px-8 py-3 font-body text-sm uppercase
             tracking-widest text-bone transition-colors hover:bg-clay/90"
>
  See the menu
</Link>
```

### Form input

```tsx
<input
  className="block w-full rounded-sm border border-ink/20 bg-bone px-3 py-2
             font-body text-base text-ink shadow-sm
             focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
/>
```

### Card

```tsx
<div className="bg-bone p-6 sm:p-8 rounded-sm shadow-sm">
  {/* card content */}
</div>
```

### Section eyebrow

```tsx
<p className="font-body text-xs uppercase tracking-widest text-moss">
  Today's bench
</p>
```

---

## Animation patterns

| Element | Trigger | Duration | Easing | Notes |
|---|---|---|---|---|
| Hero carousel slide change | Embla autoplay (5500ms interval) | ~500ms | Embla default | Pauses on hover & on user interaction |
| Hero CTA hover | Mouse over | 150ms | `transition-colors` (linear) | Colour shift only, no transform |
| Navbar mobile menu | Click hamburger | 200–300ms | ease-out | Translates from off-screen, opacity 0 → 1 |
| Card hover lift | Mouse over | 200ms | ease-out | `translate-y-[-2px]` + shadow growth |
| Form submit button "Sending…" | Submit pressed | (none — text swap) | — | `disabled:opacity-60` while pending |

> 💡 **Tip:** every animated component must respect `prefers-reduced-motion`.
> The `globals.css` media query forces all animations to ~0ms when the visitor
> has Reduced Motion enabled. Don't override this in component CSS.

```css
/* In globals.css — handles every animation site-wide */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Responsive breakpoints (Tailwind defaults, used as-is)

| Breakpoint | Min width | Typical device |
|---|---|---|
| (default) | — | Mobile portrait — 375px+ |
| `sm` | 640px | Mobile landscape, small tablet |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape, small laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

```
                                                                                 desktop wide
                                                                                 1536px ─►
mobile (375px) ──► mobile-L (640px) ──► tablet (768px) ──► laptop (1024px) ──► desktop (1280px)
   default              sm                  md                   lg                   xl
```

**Mobile-first:** write the default style for the smallest viewport, then add
`sm:`, `md:`, `lg:` overrides for larger.

```tsx
// ✓ Right — defaults are mobile, overrides are desktop
<h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl">

// ✗ Wrong — defaults are desktop, overrides are mobile (rare and confusing)
<h1 className="text-9xl lg:text-9xl md:text-7xl sm:text-5xl">
```

---

## Layout shifts at each breakpoint

```
Mobile (375px)
┌──────────────────────┐
│   ☰    Hjem          │  Navbar — hamburger
├──────────────────────┤
│                      │
│   HERO (full-bleed)  │  85vh
│   single CTA         │
│                      │
├──────────────────────┤
│  Story (1-col)       │  py-24
├──────────────────────┤
│  Bench (1-col stack) │
├──────────────────────┤
│  Menu (1-col stack)  │
├──────────────────────┤
│  Testimonials (1-col)│
├──────────────────────┤
│  Visit (1-col)       │
├──────────────────────┤
│  Contact form        │
├──────────────────────┤
│  Footer (stacked)    │  py-12
└──────────────────────┘

Tablet (768px) — same shape, two-up grids
Desktop (1280px) — three-up grids, side-by-side Story image+text, fuller spacing
```

---

## Accessibility floor

Beyond contrast (above):

| Requirement | How we meet it |
|---|---|
| Focus ring visible | Every interactive element has `focus:ring-2` or `focus-visible:outline` |
| Keyboard navigation | All actions reachable via Tab. Skip links not needed (single-page site, but every CTA is keyboard-reachable inline) |
| Alt text | Every `<Image>` has a descriptive `alt`; decorative images use `alt=""` |
| ARIA labels | Icon-only buttons (carousel arrows, social links) have `aria-label`. Form inputs have linked `<label>` via `htmlFor` |
| Heading hierarchy | One `<h1>` per page (Hero slide 1). Sections use `<h2>`. No skipped levels. |
| Animations | Respect `prefers-reduced-motion` |
| Form errors | Linked via `aria-describedby` and `aria-invalid` so screen readers announce them |
| Live regions | Form status uses `aria-live="polite"` so the success/error message is announced |

Run `jest-axe` against any new page or component before merging — covered by
the smoke test suite.

---

## Imagery direction

See [IMAGES.md](IMAGES.md) for the file inventory. Direction notes:

| Quality | Description |
|---|---|
| **Light** | Side-light. Natural window light at golden hour or blue hour. Avoid harsh top light. |
| **Palette in scene** | Cream walls, moss-green plants, warm wooden surfaces. The brand colours show up in the photography itself, not just the chrome. |
| **Composition** | Generous negative space. Single hero subject. Don't pack the frame. |
| **People** | Hands, partial figures, customers from behind or at angles. Faces only with consent. |
| **No filters / presets** | Send raw / unedited. We compress and tone-match in post. |

---

## What NOT to do

> ⚠️ The brand falls apart if any of these creep in:

- **Generic AI gradients** — no purple-to-pink, no cyan-to-magenta. The
  palette is warm earth tones; that's the whole point.
- **Heavy drop shadows or "depth"** — light shadows only. Hjem is calm,
  not dramatic.
- **Sans-serif everywhere** — Fraunces is the entire personality. Without
  it, the site reads as a SaaS startup, not a Danish bakery.
- **Inter** — the worst possible default for this brand. DM Sans is
  intentionally chosen as a slightly humanist alternative.
- **Stock photography** — every image must be of Hjem itself or shot to look
  like it could be Hjem. Generic "café latte art" stock kills the
  hand-crafted positioning instantly.
- **Bright primary blue / red anywhere** — emergency-coloured buttons are
  the opposite of the brand voice.

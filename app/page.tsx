/**
 * WHAT: The Hjem homepage — assembles the one-page brochure.
 * WHY:  Hjem's pitch is single-page: visitors land here, scroll through
 *       Story / Menu / Visit, and either click Visit or leave. Every
 *       section ID below matches a Navbar anchor link (`/#story`,
 *       `/#menu`, `/#visit`) — keep the IDs in sync with components/Navbar.tsx.
 * IF REMOVED: Next.js can't build (every App Router project needs a
 *             root page).
 *
 * STEP-16 STATE (mid-build): only Hero ships fully designed. Story,
 * Menu, and Visit ship as minimal stubs so the navbar's anchor links
 * resolve to real targets in the document — clicking "Story" scrolls
 * somewhere instead of doing nothing. Subsequent Step-16 sub-steps
 * replace each stub with the finished section.
 *
 * Single <main> rule: this is the page's landmark. RootLayout
 * deliberately does NOT wrap children in <main> — see app/layout.tsx
 * comment about the single-main invariant.
 */

import Hero from "@/components/sections/Hero";

/**
 * SECTION_STUBS — the not-yet-designed sections of the one-page brochure.
 * Kept as data so the placeholder markup stays uniform; one stub-renderer
 * loop is easier to scan than three near-identical JSX blocks.
 *
 * Removing an entry here without removing the matching Navbar link will
 * silently break the corresponding anchor (it'll scroll to top). Vice
 * versa, adding a Navbar link without a matching id here breaks the same
 * way. Test these together when the real sections land.
 */
const SECTION_STUBS: ReadonlyArray<{ id: string; eyebrow: string }> = [
  { id: "story", eyebrow: "Story" },
  { id: "menu", eyebrow: "Menu" },
  { id: "visit", eyebrow: "Visit" },
];

export default function Home() {
  return (
    <main>
      <Hero />

      {SECTION_STUBS.map(({ id, eyebrow }) => (
        <section
          key={id}
          id={id}
          className="mx-auto max-w-3xl px-6 py-24"
          aria-labelledby={`${id}-heading`}
        >
          <p className="font-body text-sm uppercase tracking-widest text-clay">
            {eyebrow}
          </p>
          <h2
            id={`${id}-heading`}
            className="mt-2 font-display text-4xl text-ink sm:text-5xl"
          >
            Coming up
          </h2>
        </section>
      ))}
    </main>
  );
}

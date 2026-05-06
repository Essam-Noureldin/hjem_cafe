/**
 * WHAT: The Hjem homepage — assembles the one-page brochure.
 * WHY:  Hjem's pitch is single-page: visitors land here, scroll through
 *       Story / Menu / Visit, and either click Visit or leave. Every
 *       section ID below matches a Navbar anchor link (`/#story`,
 *       `/#menu`, `/#visit`) — keep the IDs in sync with components/Navbar.tsx.
 * IF REMOVED: Next.js can't build (every App Router project needs a
 *             root page).
 *
 * STEP-16 STATE (mid-build): Hero, Story, and Menu ship fully designed.
 * Visit ships as a minimal stub (eyebrow + "Coming up" h2) so the
 * navbar's `/#visit` anchor still resolves to a real target. The next
 * sub-step replaces it with the address + hours + map.
 *
 * Single <main> rule: this is the page's landmark. RootLayout
 * deliberately does NOT wrap children in <main> — see app/layout.tsx
 * comment about the single-main invariant.
 */

import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Menu from "@/components/sections/Menu";

/**
 * SectionStub — the placeholder shape for sections not yet designed.
 * Lives inline here (rather than as a separate component) because it's
 * intentionally throwaway: when Visit ships, this helper deletes.
 */
function SectionStub({ id, eyebrow }: { id: string; eyebrow: string }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="mx-auto max-w-3xl px-6 py-24"
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
  );
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Story />
      <Menu />
      <SectionStub id="visit" eyebrow="Visit" />
    </main>
  );
}

/**
 * WHAT: The Hjem homepage — assembles the one-page brochure.
 * WHY:  Hjem's pitch is single-page: visitors land here, scroll through
 *       Story / Today's Bench / Menu / Testimonials / Visit / Contact,
 *       and either click "Get directions" or send a message before they
 *       leave. Every section ID below matches a Navbar anchor link
 *       (`/#story`, `/#menu`, `/#visit`) — keep the IDs in sync with
 *       components/Navbar.tsx. (Testimonials and Contact have section
 *       ids too but are not in the navbar — keeps the nav lean; both
 *       are passive destinations rather than primary nav targets.)
 * IF REMOVED: Next.js can't build (every App Router project needs a
 *             root page).
 *
 * Single <main> rule: this is the page's landmark. RootLayout
 * deliberately does NOT wrap children in <main> — see app/layout.tsx
 * comment about the single-main invariant.
 */

import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import TodaysBench from "@/components/sections/TodaysBench";
import Menu from "@/components/sections/Menu";
import Testimonials from "@/components/sections/Testimonials";
import Visit from "@/components/sections/Visit";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Story />
      <TodaysBench />
      <Menu />
      <Testimonials />
      <Visit />
      <Contact />
    </main>
  );
}

"use client";

/**
 * WHAT: The site-wide navbar — sticky top chrome present on every page.
 *       Renders the Hjem wordmark + four links on desktop, collapses to a
 *       hamburger-toggled panel below md.
 * WHY:  Wayfinding for a one-page brochure. The four anchor targets (#story,
 *       #menu, #visit) match the homepage section IDs added in Step 16.
 *       Home (/) is also the wordmark, so a visitor who scrolls deep can
 *       always click the brand to return to the top.
 * IF REMOVED: every page loses navigation entirely and visitors have no way
 *             back to the top from the legal pages.
 * COMMON MISTAKE: forgetting `'use client'` because the file looks static.
 *                 The hamburger toggle uses useState — without the directive,
 *                 Next treats this as a server component and useState fails
 *                 at build time.
 */

import Link from "next/link";
import { useState } from "react";

/**
 * The four nav targets. Defined once so the desktop nav and the mobile
 * panel render from the same source — adding a fifth link tomorrow only
 * needs an entry here, not two parallel JSX edits.
 */
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Story", href: "/#story" },
  { label: "Menu", href: "/#menu" },
  { label: "Visit", href: "/#visit" },
] as const;

const MOBILE_PANEL_ID = "navbar-mobile-panel";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Single handler for "close the panel" — used by both the link click
  // and the toggle button when toggling from open to closed.
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-40 bg-cream/90 backdrop-blur-sm border-b border-ink/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Wordmark — doubles as the home link. font-display gives the
            editorial Fraunces serif; tracking-tight pulls the letters in
            for a confident, mark-like feel rather than a soft headline. */}
        <Link
          href="/"
          className="font-display text-2xl sm:text-3xl tracking-tight text-ink hover:text-clay focus:outline-none focus:ring-2 focus:ring-clay rounded-sm transition-colors"
          onClick={close}
        >
          Hjem
        </Link>

        {/* Desktop nav — md+ only. Hidden under md so the hamburger has
            the floor on phones. */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm uppercase tracking-widest text-ink hover:text-clay focus:outline-none focus:ring-2 focus:ring-clay rounded-sm transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger — md-and-below. aria-expanded tells screen readers
            the disclosure state; aria-controls binds the button to the
            panel it operates so AT users can jump straight to it. */}
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={isOpen}
          aria-controls={MOBILE_PANEL_ID}
          onClick={toggle}
          className="md:hidden p-2 -mr-2 text-ink hover:text-clay focus:outline-none focus:ring-2 focus:ring-clay rounded-sm transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {isOpen ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile panel — rendered conditionally so the closed state has no
          stray off-screen content for AT to encounter. id matches the
          toggle's aria-controls. */}
      {isOpen && (
        <div
          id={MOBILE_PANEL_ID}
          className="md:hidden border-t border-ink/10 bg-cream"
        >
          <ul className="px-4 sm:px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={close}
                  className="block text-sm uppercase tracking-widest text-ink hover:text-clay focus:outline-none focus:ring-2 focus:ring-clay rounded-sm transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

/**
 * WHAT: The site-wide footer — legal chrome on every page.
 * WHY:  Three jobs: (1) make the legal trio reachable from anywhere on
 *       the site, (2) carry the copyright line, (3) link to social. No
 *       site map, no newsletter form, no "wholesale" or "journal" links —
 *       the demo is a one-page brochure and a fuller footer would look
 *       like padding on a five-page site that doesn't exist.
 * IF REMOVED: the legal pages still render at their URLs but nothing
 *             surfaces them — non-compliance by negligence.
 * COMMON MISTAKE: dynamically generating the copyright year on the server
 *                 with `new Date().getFullYear()` is fine in App Router
 *                 (the layout is a server component), but on a fully
 *                 static export it bakes the build year in. Acceptable
 *                 trade-off here — Vercel rebuilds keep it fresh.
 */

import Link from "next/link";

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Cookie Policy", href: "/cookie-policy" },
] as const;

const SOCIAL_LINKS = [
  {
    label: "Hjem on Instagram",
    href: "https://instagram.com/hjemkensington",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" />
      </svg>
    ),
  },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-moss text-bone mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        {/* Wordmark + tagline — keeps the dark band from feeling like
            a strip of legal links. font-display anchors the brand voice
            even at the bottom of the page. */}
        <div className="space-y-2">
          <p className="font-display text-2xl tracking-tight">Hjem</p>
          <p className="text-sm text-bone/70 max-w-xs leading-relaxed">
            A small Danish neighbourhood bakery in West London.
          </p>
        </div>

        {/* Legal trio — uppercase + tracked to read as a labelled
            cluster, not as body links. */}
        <nav aria-label="Legal" className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-bone/60">
            Legal
          </p>
          <ul className="space-y-2">
            {LEGAL_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm hover:text-clay focus:outline-none focus:ring-2 focus:ring-clay rounded-sm transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social — icon-only, so each link MUST carry an aria-label.
            target=_blank + rel=noopener,noreferrer is non-negotiable for
            external links on any site that takes security seriously. */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-bone/60">
            Follow
          </p>
          <ul className="flex gap-4">
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex p-2 -m-2 hover:text-clay focus:outline-none focus:ring-2 focus:ring-clay rounded-sm transition-colors"
                >
                  {icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sub-bar — copyright + demo disclosure. Lower visual weight via
          a thin border and reduced opacity. */}
      <div className="border-t border-bone/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-bone/60">
          © {year} Hjem Kensington. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

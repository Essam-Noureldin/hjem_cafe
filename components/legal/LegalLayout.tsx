/**
 * WHAT: Shared visual scaffold for the three legal pages — disclaimer
 *       banner at the top, narrow centred prose column below, last-
 *       updated stamp at the bottom.
 * WHY:  Legal pages share the same shape (long form text, no imagery,
 *       lots of headings). A shared layout means a typography or
 *       margin tweak happens in one place, not three. It also keeps
 *       the demo disclaimer guaranteed-present on every legal page.
 * IF REMOVED: each page would need to import DemoDisclaimer and
 *             repeat the same wrapper markup. A future page could
 *             quietly forget the disclaimer — the whole point of
 *             centralising it is that you can't.
 * COMMON MISTAKE: putting this in /app/legal/layout.tsx as a Next
 *                 layout segment. We don't, because the three pages
 *                 live at the URL root (/privacy-policy, etc.) — not
 *                 under a /legal/ prefix — for SEO and link-clarity
 *                 reasons. So it's a plain shared component instead.
 */

import type { ReactNode } from "react";
import DemoDisclaimer from "./DemoDisclaimer";

type LegalLayoutProps = {
  /** Page H1 — also drives the page <title> via metadata. */
  title: string;
  /** ISO date string (YYYY-MM-DD) shown to the user as "Last updated". */
  lastUpdated: string;
  children: ReactNode;
};

export default function LegalLayout({
  title,
  lastUpdated,
  children,
}: LegalLayoutProps) {
  /**
   * `prose` would normally come from @tailwindcss/typography. We don't
   * have that plugin installed — it's not on the master prompt's stack
   * list — so we apply spacing utilities directly. This is fine for
   * three short-ish pages; if we ever ship a blog, install the plugin.
   */
  return (
    <main className="min-h-screen bg-cream text-ink">
      <article className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <DemoDisclaimer />

        <header className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-3">
            {title}
          </h1>
          <p className="text-sm text-ink/60">
            Last updated:{" "}
            <time dateTime={lastUpdated}>
              {new Date(lastUpdated).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </p>
        </header>

        <div className="space-y-6 leading-relaxed [&_h2]:font-display [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-ink/85 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:underline [&_a]:text-moss hover:[&_a]:text-clay">
          {children}
        </div>
      </article>
    </main>
  );
}

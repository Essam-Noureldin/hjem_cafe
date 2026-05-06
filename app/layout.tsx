/**
 * WHAT: The root layout — wraps every page in the app. Loads Google Fonts,
 *       sets the <html> language, and applies global metadata defaults.
 * WHY:  Anything that should appear on every page (fonts, language tag,
 *       default Open Graph tags, base classes) belongs here. Pages further
 *       down the tree can override specific metadata fields.
 * IF REMOVED: Next.js would error on build — RootLayout is required.
 * COMMON MISTAKE: marking this `'use client'`. RootLayout MUST be a server
 *                 component so Next can stream initial HTML to the browser
 *                 before any JavaScript loads. Anything interactive (state,
 *                 click handlers) belongs in a child client component.
 */

import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import CookieConsent from "@/components/CookieConsent";
import GAScript from "@/components/analytics/GAScript";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

/**
 * Fraunces — the editorial display serif. Used for headlines, the
 * "Velkommen" hero, italic taglines, and the location names.
 *
 * `axes: ['SOFT', 'opsz']` enables Fraunces' two optional variation axes:
 *   SOFT  — softens the corners (we'll use it sparingly for warmth)
 *   opsz  — optical size; lets the same font tighten at small sizes and
 *           open up at display sizes automatically
 *
 * `display: 'swap'` tells the browser: render in a fallback font
 * immediately, swap to Fraunces when it loads. Avoids invisible-text-
 * during-load (FOIT) which kills Lighthouse scores.
 */
const fraunces = Fraunces({
  variable: "--font-display-loaded",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "opsz"],
});

/**
 * DM Sans — the body sans-serif. Clean, humanist, pairs well with
 * Fraunces. Used for body text, navigation, eyebrow caps, form fields.
 */
const dmSans = DM_Sans({
  variable: "--font-body-loaded",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Default metadata — every page inherits these unless it exports its own.
 *
 * `metadataBase` makes relative URLs in Open Graph tags resolve correctly.
 * Without it, social previews would have broken image URLs in production.
 *
 * Note: NEXT_PUBLIC_SITE_URL is read here at module load — if it's not
 * set in .env.local, metadataBase falls back to localhost so dev still
 * works. /lib/env.ts (Phase 6) will enforce that the var is set in
 * production builds.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hjem Kensington — A Danish bakery in West London",
    template: "%s · Hjem Kensington",
  },
  description:
    "A small Danish neighbourhood bakery and specialty coffee shop with two doors in Kensington and South Kensington. Stone-milled sourdough, cardamom buns, slow coffee.",
  openGraph: {
    title: "Hjem Kensington — A Danish bakery in West London",
    description:
      "Stone-milled sourdough, cardamom buns, slow coffee. Two doors in Kensington and South Kensington.",
    url: siteUrl,
    siteName: "Hjem Kensington",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hjem Kensington",
    description:
      "A small Danish neighbourhood bakery in West London. Stone-milled sourdough, cardamom buns, slow coffee.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * RootLayout — the outermost wrapper.
 *
 * Why en-GB and not en: this is a UK business; en-GB tells screen readers
 * and search engines to use British spelling and pronunciation defaults.
 *
 * Why h-full + min-h-full + flex flex-col: ensures the body fills the
 * viewport vertically even on short pages, so a sticky footer (Phase 16)
 * sits at the bottom rather than floating mid-page.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${fraunces.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {/* flex-1 wrapper pushes the Footer to the bottom on short pages.
            We don't add a <main> here — pages own their own landmark
            (LegalLayout has one, the homepage will have one in Step 16),
            and two <main>s in a single document is invalid HTML. */}
        <div className="flex-1">{children}</div>
        <Footer />
        {/* Both client components. GAScript reads GA_ID from process.env
            here in the server layout and passes it as a prop — no env
            access on the client side. CookieConsent dispatches the
            'cookie-consent-accepted' event GAScript listens for. */}
        <GAScript gaId={process.env.NEXT_PUBLIC_GA_ID} />
        <CookieConsent />
      </body>
    </html>
  );
}

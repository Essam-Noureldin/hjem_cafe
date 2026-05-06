/**
 * WHAT: Next.js configuration. Two roles:
 *       1. Sets `output: "standalone"` so `next build` produces a
 *          self-contained bundle the production Dockerfile can ship.
 *       2. Attaches security headers (CSP, HSTS, X-Frame-Options, etc.)
 *          to every response from the app.
 *
 * WHY:  Defaults aren't enough. Without explicit headers, the browser
 *       runs whatever scripts the page says to run, lets other sites
 *       embed us in iframes, and trusts every Content-Type guess.
 *       The CSP in particular is the strongest protection against XSS.
 *
 * IF REMOVED: production builds wouldn't work in Docker (no server.js).
 *             Every page would ship without security headers, scoring
 *             F on securityheaders.com and exposing the site to XSS,
 *             clickjacking, and MIME-sniffing attacks.
 *
 * COMMON MISTAKE: putting headers on individual page routes instead of
 *                 globally. Headers must apply to EVERY response —
 *                 including 404s, API routes, and static assets — to
 *                 actually protect the site.
 */

import type { NextConfig } from "next";


/* ---------------------------------------------------------------------------
 * Content Security Policy
 * -------------------------------------------------------------------------
 * Each directive is a single line below for readability. Joined with ";"
 * and ";" at the very end is intentional (some scanners report a missing
 * trailing separator otherwise).
 *
 * KEY DESIGN CHOICES:
 *
 * - No `https://fonts.googleapis.com` / `https://fonts.gstatic.com` in the
 *   whitelist: we use next/font/google which downloads font files at build
 *   time and serves them from /_next/static. Browser never contacts Google
 *   Fonts at runtime — tighter CSP for free.
 *
 * - `script-src 'unsafe-inline'`: Next.js injects small inline bootstrap
 *   scripts (route info, error boundaries) that we cannot easily nonce
 *   without reaching into framework internals. The trade-off is accepted
 *   because (a) we control all our own page content, and (b) other CSP
 *   directives (object-src, frame-ancestors, base-uri) close most of the
 *   attack vectors that 'unsafe-inline' would otherwise open.
 *
 * - `'unsafe-eval'` only in development: Turbopack uses eval() for HMR.
 *   Production builds don't, so we keep prod strict.
 *
 * - `connect-src https://*.ingest.sentry.io`: Sentry's data ingest hosts
 *   are subdomains of ingest.sentry.io (e.g. o4506.ingest.sentry.io).
 *   Wildcard covers any region/org without needing the exact DSN here.
 *
 * - GA / GTM hosts (googletagmanager.com, google-analytics.com) appear in
 *   script-src, img-src, and connect-src because GA does all three. They
 *   only matter once cookie consent is given AND a real GA ID is set —
 *   safe to whitelist regardless because no script loads without consent.
 * ------------------------------------------------------------------------- */

const isDev = process.env.NODE_ENV !== "production";

const cspDirectives = [
  // Default fallback — block anything we haven't explicitly allowed.
  "default-src 'self'",

  // JavaScript: our own bundles, plus GA/GTM if/when consent is given.
  // 'unsafe-eval' only in dev for Turbopack HMR.
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com"
    : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",

  // CSS: own files + Next/Tailwind inline style attributes.
  "style-src 'self' 'unsafe-inline'",

  // Fonts: served from our own domain (next/font/google handles this).
  // `data:` allows inline SVG fonts if a UI lib uses them.
  "font-src 'self' data:",

  // Images: own + base64 data URIs + blob: (for Image-component blurs).
  // GA pixel-image is on google-analytics.com.
  "img-src 'self' data: blob: https://www.google-analytics.com",

  // XHR / fetch / WebSocket destinations:
  //   - 'self' for our own server actions
  //   - GA for analytics events
  //   - Sentry ingest for error reports
  isDev
    ? "connect-src 'self' ws: wss: https://www.google-analytics.com https://*.ingest.sentry.io"
    : "connect-src 'self' https://www.google-analytics.com https://*.ingest.sentry.io",

  // Disallow nested browsing contexts. We have no iframes (yet).
  // When Google Maps embed is added, change to: frame-src https://www.google.com
  "frame-src 'none'",

  // Disallow OUR site from being embedded in someone else's iframe.
  // CSP-level equivalent of X-Frame-Options: DENY (modern, more flexible).
  "frame-ancestors 'none'",

  // Restrict <base href> to same origin. Stops attackers from rebasing
  // relative URLs to point at their own server.
  "base-uri 'self'",

  // Forms can only submit to our own origin.
  "form-action 'self'",

  // No <object>, <embed>, or <applet>. These are legacy attack surfaces.
  "object-src 'none'",

  // Force HTTPS for any embedded content (in production).
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
];

const contentSecurityPolicy = cspDirectives.join("; ");


/* ---------------------------------------------------------------------------
 * Security headers applied to every response
 * ------------------------------------------------------------------------- */

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    // Belt-and-braces with frame-ancestors above. Older browsers respect
    // this, modern browsers prefer the CSP version.
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Stops the browser from sniffing Content-Type on response bodies.
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Send only the origin (not the full URL) in cross-site referrers.
    // Same-origin keeps the full path, so internal analytics still works.
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Two years, includes subdomains, eligible for the browser preload list.
    // Only honoured when served over HTTPS — harmless on localhost.
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Explicitly deny browser features we don't use. If an attacker injects
    // a script, they can't trigger camera/mic/geolocation prompts either.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];


/* ---------------------------------------------------------------------------
 * The actual Next config export
 * ------------------------------------------------------------------------- */

const nextConfig: NextConfig = {
  /**
   * `standalone` produces a minimal self-contained build at .next/standalone
   * that includes server.js + only the deps actually used. Required by
   * the production Dockerfile (Phase 3).
   */
  output: "standalone",

  /**
   * Apply security headers to every route. The `source: "/(.*)"` pattern
   * matches absolutely everything — pages, API routes, static assets.
   */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

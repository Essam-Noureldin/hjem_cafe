/**
 * WHAT: Configuration for next-sitemap, which generates sitemap.xml and
 *       robots.txt at build time. Runs as a `postbuild` script (defined
 *       in package.json) so it always reflects the latest set of routes.
 *
 * WHY:  Search engines find pages faster when given an explicit sitemap.
 *       For a brand-new site like Hjem (zero inbound links), this is the
 *       fastest path to Google indexing. robots.txt tells crawlers which
 *       paths they can and can't visit.
 *
 * IF REMOVED: Google would still eventually find the homepage and crawl
 *             from there — but it could take weeks instead of days. The
 *             site would also have no /robots.txt, so crawlers wouldn't
 *             know to avoid /api/* if/when API routes exist.
 *
 * COMMON MISTAKE: hardcoding the siteUrl. It MUST come from the env var
 *                 because the demo URL (vercel.app) and the eventual
 *                 production URL (real domain) differ — and search
 *                 engines key indexing on the canonical URL.
 *
 * @type {import("next-sitemap").IConfig}
 */
module.exports = {
  /**
   * Canonical site URL. Read from NEXT_PUBLIC_SITE_URL — already
   * required by /lib/env.ts (so missing it would have failed `next build`
   * earlier). The localhost fallback exists only so dev-time generation
   * doesn't crash if someone runs the postbuild without .env.local.
   */
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /**
   * Generate /robots.txt alongside /sitemap.xml. Allows everything by
   * default; explicit disallow on /api/* below.
   */
  generateRobotsTxt: true,

  /**
   * Sitemap excludes: never list API routes in the public sitemap. Even
   * if there are no API routes today, this rule prevents future ones
   * (e.g. the contact form server action's POST endpoint) from leaking
   * into the index.
   */
  exclude: ["/api/*", "/api"],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/api"],
      },
    ],
  },

  /**
   * Per-route customisation. next-sitemap calls this for every URL
   * before writing it. We assign priority based on the URL pattern:
   *   - homepage         → 1.0 (highest)
   *   - main sections    → 0.8 (default for top-level routes)
   *   - legal pages      → 0.5 (lower — they're required, not promotional)
   *
   * `changefreq` is a hint, not a contract. Search engines use it
   * loosely; "monthly" is reasonable for a bakery site.
   */
  transform: async (config, path) => {
    const legalPaths = [
      "/privacy-policy",
      "/terms-and-conditions",
      "/cookie-policy",
    ];

    let priority = 0.8;
    if (path === "/") priority = 1.0;
    else if (legalPaths.includes(path)) priority = 0.5;

    return {
      loc: path,
      changefreq: "monthly",
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};

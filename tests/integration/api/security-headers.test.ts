/**
 * @jest-environment node
 *
 * WHAT: Pins the security-header contract in next.config.ts. Imports the
 *       config object directly, calls its async headers() function, and
 *       asserts on what comes back. Covers Content-Security-Policy,
 *       X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
 *       Strict-Transport-Security, Permissions-Policy, and the two
 *       Cross-Origin isolation headers (COOP, CORP).
 * WHY:  These headers are how the site defends against XSS, clickjacking,
 *       MIME-sniffing, and Spectre-class side-channel attacks. They're
 *       trivially easy to break without noticing — wrap next.config.ts
 *       with the wrong helper, mistype a directive, swap one header for
 *       another in a refactor, and the site silently downgrades to the
 *       browser defaults. This test catches that the moment someone
 *       changes the config.
 *
 * Approach: the config exposes its headers via an async `headers()`
 * function that Next.js calls at server start. We import the config and
 * call that function ourselves. No HTTP server, no supertest, no fetch
 * — just direct execution of the same code Next runs in production.
 *
 * Specifically chosen as the guard for the upcoming Sentry wrap (Step 18):
 * if `withSentryConfig` is misused (e.g. wrapping the export instead of
 * passing the full config object in), the headers() function would be
 * silently dropped from the wrapped config. This test would fail loudly.
 *
 * Node environment because next.config.ts is a server-only module —
 * jsdom would only add false noise.
 */

import nextConfig from "../../../next.config";

type HeaderEntry = { key: string; value: string };

/**
 * Helper: extracts the flat list of header rules from the config's
 * headers() result. The config returns an array of `{ source, headers }`
 * objects; we want all the header entries from rules that match `/(.*)`
 * (the global rule). Validates that the global rule exists too.
 */
async function getGlobalHeaders(): Promise<HeaderEntry[]> {
  if (typeof nextConfig.headers !== "function") {
    throw new Error("next.config.ts must export an async headers() function");
  }
  const rules = await nextConfig.headers();
  const globalRule = rules.find((r) => r.source === "/(.*)");
  if (!globalRule) {
    throw new Error(
      "next.config.ts must include a global header rule with source '/(.*)'",
    );
  }
  return globalRule.headers as HeaderEntry[];
}

function findHeader(headers: HeaderEntry[], key: string): HeaderEntry | undefined {
  return headers.find((h) => h.key.toLowerCase() === key.toLowerCase());
}

describe("next.config.ts security headers", () => {
  it("exposes a headers() function that returns at least one global rule", async () => {
    const headers = await getGlobalHeaders();
    expect(headers.length).toBeGreaterThan(0);
  });

  it("sets Content-Security-Policy", async () => {
    const headers = await getGlobalHeaders();
    const csp = findHeader(headers, "Content-Security-Policy");
    expect(csp).toBeDefined();
    expect(csp!.value).toContain("default-src 'self'");
    expect(csp!.value).toContain("frame-ancestors 'none'");
    expect(csp!.value).toContain("object-src 'none'");
    expect(csp!.value).toContain("base-uri 'self'");
  });

  it("CSP whitelists Sentry's ingest hosts (so error reporting works once DSN is set)", async () => {
    const headers = await getGlobalHeaders();
    const csp = findHeader(headers, "Content-Security-Policy")!;
    expect(csp.value).toMatch(/connect-src[^;]*\*\.ingest\.sentry\.io/);
  });

  it("sets X-Frame-Options to DENY", async () => {
    const headers = await getGlobalHeaders();
    const xfo = findHeader(headers, "X-Frame-Options");
    expect(xfo).toBeDefined();
    expect(xfo!.value).toBe("DENY");
  });

  it("sets X-Content-Type-Options to nosniff", async () => {
    const headers = await getGlobalHeaders();
    const xcto = findHeader(headers, "X-Content-Type-Options");
    expect(xcto).toBeDefined();
    expect(xcto!.value).toBe("nosniff");
  });

  it("sets Referrer-Policy", async () => {
    const headers = await getGlobalHeaders();
    const rp = findHeader(headers, "Referrer-Policy");
    expect(rp).toBeDefined();
    expect(rp!.value).toBe("strict-origin-when-cross-origin");
  });

  it("sets Strict-Transport-Security with a long max-age + preload", async () => {
    const headers = await getGlobalHeaders();
    const hsts = findHeader(headers, "Strict-Transport-Security");
    expect(hsts).toBeDefined();
    expect(hsts!.value).toMatch(/max-age=\d+/);
    expect(hsts!.value).toContain("includeSubDomains");
    expect(hsts!.value).toContain("preload");
    // Match the master-prompt requirement: at least 2 years.
    const maxAge = Number(hsts!.value.match(/max-age=(\d+)/)?.[1] ?? "0");
    expect(maxAge).toBeGreaterThanOrEqual(63072000);
  });

  it("sets Permissions-Policy denying camera, microphone, geolocation", async () => {
    const headers = await getGlobalHeaders();
    const pp = findHeader(headers, "Permissions-Policy");
    expect(pp).toBeDefined();
    expect(pp!.value).toContain("camera=()");
    expect(pp!.value).toContain("microphone=()");
    expect(pp!.value).toContain("geolocation=()");
  });

  it("sets Cross-Origin-Opener-Policy and Cross-Origin-Resource-Policy to same-origin", async () => {
    const headers = await getGlobalHeaders();
    const coop = findHeader(headers, "Cross-Origin-Opener-Policy");
    const corp = findHeader(headers, "Cross-Origin-Resource-Policy");
    expect(coop).toBeDefined();
    expect(coop!.value).toBe("same-origin");
    expect(corp).toBeDefined();
    expect(corp!.value).toBe("same-origin");
  });

  it("does not lose any required header when the config is wrapped (regression guard)", async () => {
    // This is the catch-all assertion: every header the project requires
    // must be present. If anyone wraps next.config.ts with a helper that
    // strips top-level fields (e.g. the wrong shape of withSentryConfig),
    // this test will list exactly which header is missing.
    const headers = await getGlobalHeaders();
    const required = [
      "Content-Security-Policy",
      "X-Frame-Options",
      "X-Content-Type-Options",
      "Referrer-Policy",
      "Strict-Transport-Security",
      "Permissions-Policy",
      "Cross-Origin-Opener-Policy",
      "Cross-Origin-Resource-Policy",
    ];
    const missing = required.filter((name) => !findHeader(headers, name));
    expect(missing).toEqual([]);
  });
});

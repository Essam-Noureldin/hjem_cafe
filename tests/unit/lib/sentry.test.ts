/**
 * @jest-environment node
 *
 * WHAT: Tests for /lib/sentry.ts — the small piece of logic that decides
 *       whether to call Sentry.init at all, what options to pass it, and
 *       how to derive Sentry's CSP report URL from a DSN.
 * WHY:  The instrumentation files (instrumentation-client.ts and
 *       instrumentation.ts at the project root) are 3-line glue that
 *       Next.js calls during boot. The actual decisions live here so
 *       they're cheap to test without booting Next or mocking the whole
 *       Sentry SDK. The two cases that absolutely must work:
 *         (1) demo build, no DSN — initSentry is a no-op so no
 *             confusing "Sentry DSN missing" warnings appear in the
 *             server logs and no spurious init runs.
 *         (2) live build with DSN — Sentry.init is called exactly once
 *             with the expected shape (DSN, environment, sampleRate).
 *       Same goes for the CSP report URL: derived correctly when DSN
 *       is set, omitted entirely when DSN is empty (so the CSP doesn't
 *       end up with a `report-to` directive pointing at nowhere).
 *
 * Approach: pure-function dependency injection. initSentry receives the
 * Sentry module as an argument so tests pass in a stub with a jest.fn()
 * for `init` and assert on what it was called with. No real SDK touched.
 */

import { initSentry, getCspReportUrl } from "@/lib/sentry";

// Stub matching the slice of @sentry/nextjs we actually use — keeps the
// test honest about the surface area (one method) and decouples from
// whatever else the SDK exports.
type SentryStub = { init: jest.Mock };

function makeSentryStub(): SentryStub {
  return { init: jest.fn() };
}

describe("initSentry", () => {
  it("does NOT call Sentry.init when DSN is undefined", () => {
    const sentry = makeSentryStub();
    const result = initSentry({ sentry, dsn: undefined, runtime: "client" });
    expect(result.initialized).toBe(false);
    expect(sentry.init).not.toHaveBeenCalled();
  });

  it("does NOT call Sentry.init when DSN is empty string", () => {
    const sentry = makeSentryStub();
    const result = initSentry({ sentry, dsn: "", runtime: "client" });
    expect(result.initialized).toBe(false);
    expect(sentry.init).not.toHaveBeenCalled();
  });

  it("does NOT call Sentry.init when DSN is whitespace only", () => {
    const sentry = makeSentryStub();
    const result = initSentry({ sentry, dsn: "   ", runtime: "server" });
    expect(result.initialized).toBe(false);
    expect(sentry.init).not.toHaveBeenCalled();
  });

  it("calls Sentry.init with the DSN when present (client runtime)", () => {
    const sentry = makeSentryStub();
    const dsn = "https://abc123@o4506.ingest.sentry.io/789";
    const result = initSentry({ sentry, dsn, runtime: "client" });
    expect(result.initialized).toBe(true);
    expect(sentry.init).toHaveBeenCalledTimes(1);
    const opts = sentry.init.mock.calls[0][0];
    expect(opts.dsn).toBe(dsn);
    // Sample rate must be set explicitly so we don't default to 100% in prod.
    expect(typeof opts.tracesSampleRate).toBe("number");
    expect(opts.tracesSampleRate).toBeGreaterThan(0);
    expect(opts.tracesSampleRate).toBeLessThanOrEqual(1);
  });

  it("passes runtime-specific options for the server runtime", () => {
    const sentry = makeSentryStub();
    const dsn = "https://abc123@o4506.ingest.sentry.io/789";
    initSentry({ sentry, dsn, runtime: "server" });
    const opts = sentry.init.mock.calls[0][0];
    // Server runtime should attach stacktraces to non-Error throws so we
    // get useful frames in Sentry instead of bare "Object" entries.
    expect(opts.attachStacktrace).toBe(true);
  });

  it("does not set attachStacktrace on the client runtime (browser default is fine)", () => {
    const sentry = makeSentryStub();
    initSentry({
      sentry,
      dsn: "https://abc123@o4506.ingest.sentry.io/789",
      runtime: "client",
    });
    const opts = sentry.init.mock.calls[0][0];
    expect(opts.attachStacktrace).toBeUndefined();
  });

  it("never throws when given a malformed DSN — Sentry handles validation itself", () => {
    const sentry = makeSentryStub();
    expect(() =>
      initSentry({ sentry, dsn: "not-a-real-dsn", runtime: "client" }),
    ).not.toThrow();
    // It should still attempt the init (SDK will reject internally).
    expect(sentry.init).toHaveBeenCalled();
  });
});

describe("getCspReportUrl", () => {
  it("returns null when DSN is undefined", () => {
    expect(getCspReportUrl(undefined)).toBeNull();
  });

  it("returns null when DSN is empty or whitespace", () => {
    expect(getCspReportUrl("")).toBeNull();
    expect(getCspReportUrl("   ")).toBeNull();
  });

  it("returns null when DSN is malformed", () => {
    expect(getCspReportUrl("not-a-url")).toBeNull();
    expect(getCspReportUrl("https://no-key-or-project")).toBeNull();
  });

  it("derives the Sentry security endpoint URL from a valid DSN", () => {
    const dsn = "https://abc123@o4506.ingest.sentry.io/789";
    const reportUrl = getCspReportUrl(dsn);
    expect(reportUrl).toBe(
      "https://o4506.ingest.sentry.io/api/789/security/?sentry_key=abc123",
    );
  });

  it("works for org-scoped Sentry hosts (newer-style ingest hostnames)", () => {
    const dsn = "https://xyz@o12345.ingest.us.sentry.io/55555";
    expect(getCspReportUrl(dsn)).toBe(
      "https://o12345.ingest.us.sentry.io/api/55555/security/?sentry_key=xyz",
    );
  });
});

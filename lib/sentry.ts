/**
 * WHAT: The Sentry decision layer. Two pure functions:
 *         - initSentry(): given a DSN and a Sentry module, decides
 *           whether to call Sentry.init and with what options.
 *         - getCspReportUrl(): given a DSN, derives the URL Sentry
 *           expects CSP violation reports to be POSTed to.
 * WHY:  The Next.js instrumentation files (instrumentation.ts and
 *       instrumentation-client.ts at the project root) are framework
 *       hooks — Next calls them, we don't. Putting the actual
 *       decisions here means we can unit-test them in isolation,
 *       without booting Next or mocking the whole Sentry SDK. The
 *       instrumentation files become 3-line glue.
 *
 * IF REMOVED: every instrumentation file would have to repeat the DSN
 *             check, the option shape, and the URL derivation. Bugs in
 *             one (e.g. forgetting to bail on missing DSN) would silently
 *             diverge from the others.
 *
 * COMMON MISTAKE: calling Sentry.init() unconditionally. With no DSN,
 *                 the SDK logs a noisy "no DSN provided" warning every
 *                 boot, drowning out real signal in the server logs.
 *                 Bail early instead.
 */


// ---------------------------------------------------------------------------
// Types — narrow stub of @sentry/nextjs so tests can pass a fake.
// ---------------------------------------------------------------------------

/**
 * The slice of the Sentry SDK we actually call. Defining it explicitly
 * (instead of `typeof import("@sentry/nextjs")`) lets tests inject a
 * minimal stub and signals which SDK surface area we depend on — small
 * surface = easier to keep working across SDK upgrades.
 */
export type SentryLike = {
  init: (options: Record<string, unknown>) => unknown;
};

export type SentryRuntime = "client" | "server";


// ---------------------------------------------------------------------------
// initSentry — the one decision: init or skip?
// ---------------------------------------------------------------------------

/**
 * Decide whether to call Sentry.init and, if so, what options to pass it.
 *
 * Skip rules: undefined / empty / whitespace-only DSN means "demo mode,
 * no monitoring." Calling init in that state would print a confusing
 * "no DSN provided" warning at every boot.
 *
 * Init options chosen:
 *   - tracesSampleRate: 10% — captures enough performance data to spot
 *     slow routes without burning through the free-tier event quota.
 *     Hjem will see roughly 0–10 events/day on this site, so 0.1 is
 *     well clear of any limit.
 *   - environment: NODE_ENV — separates dev/prod issues in the dashboard.
 *   - attachStacktrace (server only): captures stack frames even when
 *     the thrown value isn't a real Error (e.g. `throw "oops"`). The
 *     browser does this by default; Node doesn't.
 */
export function initSentry(args: {
  sentry: SentryLike;
  dsn: string | undefined;
  runtime: SentryRuntime;
}): { initialized: boolean } {
  const { sentry, dsn, runtime } = args;

  // Guard: bail out cleanly when no DSN is configured. Demo build, no
  // monitoring — and crucially, no boot-time noise in the server logs.
  if (!dsn || dsn.trim() === "") {
    return { initialized: false };
  }

  const baseOptions: Record<string, unknown> = {
    dsn,
    // Tag events with the build environment so dev noise doesn't drown
    // production signal in the Sentry dashboard.
    environment: process.env.NODE_ENV ?? "development",
    // 10% performance trace sampling. Generous for a low-traffic site,
    // tight enough not to burn through the free-tier quota.
    tracesSampleRate: 0.1,
  };

  // Server runtime: capture stack traces for non-Error throws too.
  // (Browser captures them by default; Node only on opt-in.)
  if (runtime === "server") {
    baseOptions.attachStacktrace = true;
  }

  sentry.init(baseOptions);
  return { initialized: true };
}


// ---------------------------------------------------------------------------
// getCspReportUrl — derive Sentry's CSP report endpoint from a DSN.
// ---------------------------------------------------------------------------

/**
 * Sentry accepts CSP violation reports at a per-project URL derived
 * from the DSN. DSN shape:
 *     https://<PUBLIC_KEY>@<INGEST_HOST>/<PROJECT_ID>
 * Report-to URL:
 *     https://<INGEST_HOST>/api/<PROJECT_ID>/security/?sentry_key=<PUBLIC_KEY>
 *
 * Returns null whenever the DSN is missing or malformed — caller treats
 * that as "no report-to directive in the CSP," which is correct: there's
 * nowhere to send reports anyway.
 */
export function getCspReportUrl(dsn: string | undefined): string | null {
  if (!dsn || dsn.trim() === "") return null;

  let parsed: URL;
  try {
    parsed = new URL(dsn);
  } catch {
    return null;
  }

  const publicKey = parsed.username;
  const projectId = parsed.pathname.replace(/^\/+/, "");

  // Both pieces are required; without them the URL would be a 404.
  if (!publicKey || !projectId) return null;

  return `${parsed.protocol}//${parsed.host}/api/${projectId}/security/?sentry_key=${publicKey}`;
}

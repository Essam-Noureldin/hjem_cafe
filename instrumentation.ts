/**
 * WHAT: Next.js server-side instrumentation hook. Next calls `register()`
 *       once when each server runtime starts (Node and Edge — both apply
 *       here because middleware can run on either). We use it to init
 *       Sentry's server SDK so a thrown error inside a Server Action,
 *       Route Handler, or App-Router server component reaches the
 *       dashboard.
 * WHY:  Next.js 13+ recognises this exact filename and the `register`
 *       export name as the official server-side instrumentation API.
 *       This is the only file that runs *before any request is handled*,
 *       so it's the right place to wire SDKs that need to capture
 *       startup-time errors too.
 *
 * IF REMOVED: server-side errors (server action throws, RSC render
 *             failures, middleware crashes) stop reaching Sentry.
 *
 * COMMON MISTAKE: importing @sentry/nextjs at the module top level here.
 *                 `register()` runs in BOTH Node and Edge runtimes, but
 *                 Sentry's Node SDK uses `node:async_hooks` which Edge
 *                 doesn't ship. The conditional dynamic import below
 *                 picks the right entry per runtime.
 */

import { initSentry } from "@/lib/sentry";

/**
 * Called once per server runtime boot. Async because the SDK import is
 * dynamic — see the comment above for why we don't top-level import.
 */
export async function register() {
  // NEXT_RUNTIME is set by Next.js itself: "nodejs" for the main runtime,
  // "edge" for middleware/edge functions. The Sentry SDK has separate
  // entry points for each.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const Sentry = await import("@sentry/nextjs");
    initSentry({
      sentry: Sentry,
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      runtime: "server",
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    const Sentry = await import("@sentry/nextjs");
    initSentry({
      sentry: Sentry,
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      runtime: "server",
    });
  }
}

/**
 * Hook Next.js calls whenever a request-time error escapes a Server
 * Component, Route Handler, or Server Action. Sentry's `captureRequestError`
 * is the SDK-blessed forwarder — it takes Next's (err, request, context)
 * arguments and packages them into an event with full request context.
 *
 * Re-exporting it directly (rather than wrapping it) keeps us in sync
 * with whatever shape the SDK considers correct in future versions.
 */
export { captureRequestError as onRequestError } from "@sentry/nextjs";

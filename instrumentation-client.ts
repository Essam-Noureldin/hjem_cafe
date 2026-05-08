/**
 * WHAT: Next.js instrumentation hook — runs in the browser before React
 *       hydrates the page. We use it to initialise Sentry's browser SDK
 *       so an exception during the very first render still gets captured.
 * WHY:  Next.js 15.3+ recognises this exact filename as the official
 *       client-side instrumentation entry point. It executes after the
 *       HTML document loads but BEFORE React hydration, which means
 *       Sentry is listening before any of our application code runs.
 *       That timing is what makes early-boot errors (broken hydration,
 *       failed first fetch) actually reach the dashboard.
 *
 * IF REMOVED: client-side errors stop reaching Sentry. The app keeps
 *             working but you lose all visibility into browser crashes.
 *
 * COMMON MISTAKE: putting init logic inside a useEffect. By the time
 *                 useEffect runs, the first render is already done — any
 *                 hydration error has already happened and been swallowed.
 *                 Init must happen at module load (here), not in React.
 */

import * as Sentry from "@sentry/nextjs";
import { initSentry } from "@/lib/sentry";

// Side-effect import: the function call IS the registration. No exports
// needed for client init (server-side files export `register`; the
// browser file does its work at top level).
initSentry({
  sentry: Sentry,
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  runtime: "client",
});

/**
 * Next.js can call this when the App Router transitions between routes.
 * Sentry uses it to start a new performance transaction for each
 * navigation so route-level slowness shows up in the dashboard with
 * the right URL attached. Re-exporting Sentry's helper directly keeps
 * us in sync with whatever the SDK considers correct in future versions.
 */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

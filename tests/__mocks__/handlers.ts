/**
 * WHAT: MSW (Mock Service Worker) request handlers used in tests.
 * WHY:  When a component or server action makes a network call (e.g. to
 *       Resend's API), tests should not hit the real network — that
 *       would be slow, flaky, and might charge real money. MSW intercepts
 *       these calls and returns pre-canned responses.
 * IF REMOVED: integration tests that exercise the contact form's email
 *             send would either fail (no internet in CI) or actually
 *             send live emails to your inbox during every test run.
 *
 * Empty for now — handlers get added as we wire up real external calls
 * in later phases (Sentry, Resend, GA).
 */

import { http } from "msw";

export const handlers = [
  // Example shape — uncomment when we wire Resend in.
  //
  // http.post("https://api.resend.com/emails", () => {
  //   return HttpResponse.json({ id: "test-email-id" }, { status: 200 });
  // }),
];

// Avoid "unused import" warning until real handlers exist.
void http;

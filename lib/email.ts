/**
 * WHAT: Thin wrapper around the Resend email API. The contact form
 *       server action calls `sendContactEmail` and never imports
 *       Resend directly — this file is the only place the SDK is
 *       used. Tests mock this whole module so no real Resend traffic
 *       leaves the machine during a test run.
 *
 * WHY:  Two reasons for the wrapper:
 *       1. Mockability — `jest.mock("@/lib/email")` is a one-liner.
 *          If the action used the Resend SDK directly, every test would
 *          need to mock the SDK's specific shape.
 *       2. Graceful demo mode — when RESEND_API_KEY or
 *          CONTACT_FORM_FROM_EMAIL is missing (the default in this
 *          speculative-build phase), the wrapper logs the submission
 *          to the server console and returns success instead of
 *          throwing. As soon as both env vars are set in production,
 *          real email delivery activates with no code change.
 *
 * IF REMOVED: the action would either need to instantiate Resend itself
 *             (harder to test, leaks SDK shape into business logic) or
 *             need a separate guard for the demo-mode case in every
 *             call site.
 *
 * COMMON MISTAKE: importing `Resend` at the top of this file. Doing so
 *                 forces the SDK to load even in demo mode (no key set),
 *                 which slows cold starts. Resend is `await import`-ed
 *                 lazily inside `sendContactEmail` so demo-mode boots
 *                 with zero Resend cost.
 */

export type ContactEmailPayload = {
  name: string;
  email: string;
  message: string;
};

export type SendResult =
  | { ok: true; mode: "sent" | "logged" }
  | { ok: false };

/**
 * Decide which mode to run in based on env. Read fresh on every call
 * (not via the @/lib/env singleton) so tests can flip it via process.env
 * without re-importing the module.
 */
function isDemoMode(): boolean {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FORM_FROM_EMAIL?.trim();
  return !key || !from;
}

/**
 * Send a sanitised contact form submission to the configured inbox.
 *
 * Demo mode (no Resend creds): logs the submission to the server
 * console and returns { ok: true, mode: "logged" }. Useful for the
 * speculative-build phase where Hjem haven't signed off on a real
 * sender domain yet.
 *
 * Live mode: calls Resend. On Resend failure the caller (the server
 * action) catches and converts to a generic error — this function
 * lets the underlying Error bubble up so the action can decide how
 * to translate it for the user.
 */
export async function sendContactEmail(
  payload: ContactEmailPayload,
): Promise<SendResult> {
  if (isDemoMode()) {
    // Server-side log only — never reaches the client. Sanitised
    // upstream so safe to print verbatim.
    console.log(
      "[contact-form demo] submission received (Resend not configured):",
      {
        name: payload.name,
        email: payload.email,
        message: payload.message,
      },
    );
    return { ok: true, mode: "logged" };
  }

  // Lazy import — keeps the SDK out of the cold-start path in demo mode.
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.CONTACT_FORM_FROM_EMAIL!,
    to: process.env.CONTACT_FORM_TO_EMAIL!,
    replyTo: payload.email,
    subject: `New enquiry from ${payload.name}`,
    text: `From: ${payload.name} <${payload.email}>\n\n${payload.message}`,
  });

  return { ok: true, mode: "sent" };
}

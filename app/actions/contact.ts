"use server";

/**
 * WHAT: The contact form's server action — the single function that
 *       turns a stranger's form submission into a real email (or a
 *       silent rejection). Five defence layers run in this order:
 *       honeypot → rate limit → field validation → HTML sanitisation
 *       → email handler. The first failure short-circuits the rest.
 *
 * WHY:  Server actions are reachable via direct POST too, not only
 *       through the form UI — every defence has to live here, on the
 *       server. Client-side validation is a UX nicety, not security.
 *
 * IF REMOVED: the contact form has no server-side processing and the
 *             "Send" button does nothing.
 *
 * COMMON MISTAKE: trusting the client. Validation, sanitisation,
 *                 rate-limiting all run here regardless of what the
 *                 browser thinks it sent.
 *
 * Error contract — sacred: returned state objects NEVER include raw
 * error messages, stack traces, or third-party identifiers. Friendly
 * messages live in this file; the original error gets logged
 * server-side (where Sentry will grab it in Step 18) and the client
 * sees a generic code.
 */

import { headers } from "next/headers";
import { createHash } from "node:crypto";

import { isBot } from "@/lib/honeypot";
import { rateLimit } from "@/lib/rate-limit";
import { sanitize } from "@/lib/sanitize";
import { sendContactEmail } from "@/lib/email";

// ---------------------------------------------------------------------------
// Public state shape — what the client receives via useActionState.
// Discriminated union so consumers can narrow on `status`.
// ---------------------------------------------------------------------------

export type ContactFormState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      code: "bot" | "rate_limit" | "validation" | "server";
      fieldErrors?: {
        name?: string;
        email?: string;
        message?: string;
      };
    };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Reasonable email shape check. RFC-5322 is too permissive in practice
 * (allows `"a"@b`); this regex covers what we actually want — a local
 * part, an "@", a domain with at least one dot. Real verification
 * happens implicitly when Hjem replies and the address bounces.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MIN_MESSAGE_LENGTH = 10;
const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 254; // RFC 5321 limit
const MAX_MESSAGE_LENGTH = 5000;

function parseInteger(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : fallback;
}

/**
 * Derive a stable identifier for the rate-limit key. We hash the IP
 * (from x-forwarded-for, the standard header set by Vercel and most
 * proxies) so we never store raw IPs in process memory — small
 * privacy win at zero cost.
 *
 * If no IP is available (impossible in practice on Vercel; possible
 * in dev), fall back to a single shared bucket "anon" — strict but
 * safe.
 */
async function getRateLimitIdentifier(): Promise<string> {
  const h = await headers();
  // x-forwarded-for can be a list ("client, proxy1, proxy2"); the
  // first entry is the originating client.
  const xff = h.get("x-forwarded-for");
  const realIp = h.get("x-real-ip");
  const raw = (xff?.split(",")[0] ?? realIp ?? "").trim();
  if (!raw) return "anon";
  return createHash("sha256").update(raw).digest("hex").slice(0, 32);
}

function getString(formData: FormData, name: string): string {
  const v = formData.get(name);
  return typeof v === "string" ? v : "";
}

// ---------------------------------------------------------------------------
// The action
// ---------------------------------------------------------------------------

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // ----- 1. Honeypot ------------------------------------------------------
  // Field name is "company_url" — see ContactForm.tsx for the matching
  // hidden input. Bot detection comes BEFORE rate-limit so a flood of
  // bot submissions doesn't burn through legitimate users' rate budget.
  if (isBot(getString(formData, "company_url"))) {
    return { status: "error", code: "bot" };
  }

  // ----- 2. Rate limit ----------------------------------------------------
  const identifier = await getRateLimitIdentifier();
  const max = parseInteger(process.env.RATE_LIMIT_MAX, 3);
  const windowMs = parseInteger(process.env.RATE_LIMIT_WINDOW_MS, 600_000);
  const limited = rateLimit(identifier, { max, windowMs });
  if (!limited.allowed) {
    return { status: "error", code: "rate_limit" };
  }

  // ----- 3. Validation (server-side, the only one that counts) ------------
  const rawName = getString(formData, "name").trim();
  const rawEmail = getString(formData, "email").trim();
  const rawMessage = getString(formData, "message").trim();

  const fieldErrors: { name?: string; email?: string; message?: string } = {};

  if (!rawName) {
    fieldErrors.name = "Please add your name.";
  } else if (rawName.length > MAX_NAME_LENGTH) {
    fieldErrors.name = "That name is too long.";
  }

  if (!rawEmail) {
    fieldErrors.email = "Please add your email so we can reply.";
  } else if (rawEmail.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(rawEmail)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  if (!rawMessage) {
    fieldErrors.message = "Please add a short message.";
  } else if (rawMessage.length < MIN_MESSAGE_LENGTH) {
    fieldErrors.message = `Please write at least ${MIN_MESSAGE_LENGTH} characters so we can help.`;
  } else if (rawMessage.length > MAX_MESSAGE_LENGTH) {
    fieldErrors.message = "That message is longer than we can accept here.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", code: "validation", fieldErrors };
  }

  // ----- 4. Sanitise ------------------------------------------------------
  // Strip HTML tags AFTER validation so we validate the user's actual
  // input, then sanitise before anything downstream sees it.
  const payload = {
    name: sanitize(rawName),
    email: sanitize(rawEmail),
    message: sanitize(rawMessage),
  };

  // ----- 5. Send ----------------------------------------------------------
  try {
    await sendContactEmail(payload);
    return { status: "success" };
  } catch (err) {
    // Server-side logging only — the client gets a generic code so no
    // Resend / API key / stack details ever leak via the response body.
    // Sentry (Step 18) will pick this up via console.error wiring.
    console.error("[contact-form] email send failed", err);
    return { status: "error", code: "server" };
  }
}

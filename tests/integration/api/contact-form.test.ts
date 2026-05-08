/**
 * @jest-environment node
 *
 * WHAT: End-to-end tests for the contact form's server action — the
 *       only path by which a stranger's input becomes a real-world
 *       email to Hjem's inbox. The action is the security boundary;
 *       these tests pin every defence layer (honeypot, rate limit,
 *       validation, sanitisation) at the action level so a regression
 *       in one of them is caught before it ships.
 * WHY:  The unit test for ContactForm.tsx mocks this action and only
 *       covers the UI. Without a separate integration test, nothing
 *       guards the server-side rules — bot, rate-limit, validation,
 *       sanitisation, and the no-leak error contract.
 *
 * Approach: call the action directly with FormData inputs (same way
 * React calls it from a form submit). The email module is mocked so
 * no real Resend traffic happens; we assert what the action passed
 * to it. next/headers is mocked so the action can read a stable
 * client identifier without a real request context.
 *
 * Node environment (not jsdom) — server actions are pure server code;
 * jsdom would only add false noise.
 */

// ---------------------------------------------------------------------------
// Mocks must register BEFORE the action import below — the action's
// transitive imports of these modules need to resolve to the mocks.
// ---------------------------------------------------------------------------

jest.mock("@/lib/email", () => ({
  sendContactEmail: jest.fn(),
}));

jest.mock("next/headers", () => ({
  // The action uses headers() to derive a client identifier (hashed
  // x-forwarded-for) for rate limiting. Mock it as an async fn that
  // returns a Headers-like object with a stable test IP.
  headers: jest.fn(async () => new Headers({ "x-forwarded-for": "127.0.0.1" })),
}));

import { submitContactForm } from "@/app/actions/contact";
import { sendContactEmail } from "@/lib/email";
import { _resetRateLimitForTests } from "@/lib/rate-limit";

const sendMock = sendContactEmail as jest.Mock;

// Helper: build FormData the way the browser would on form submit.
function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

// Baseline valid submission. Tests override individual fields to drive
// edge cases without rewriting the whole shape each time.
const VALID = {
  name: "Real Visitor",
  email: "visitor@example.com",
  message:
    "Hello — I'd love to come by tomorrow morning if you have any cardamom buns left.",
  company_url: "", // honeypot deliberately empty
};

const IDLE = { status: "idle" as const };

describe("submitContactForm (server action)", () => {
  beforeEach(() => {
    _resetRateLimitForTests();
    sendMock.mockReset();
    sendMock.mockResolvedValue({ ok: true });

    // Rate-limit reads RATE_LIMIT_MAX / RATE_LIMIT_WINDOW_MS from env.
    // Pin them here so the rate-limit tests are deterministic.
    process.env.RATE_LIMIT_MAX = "3";
    process.env.RATE_LIMIT_WINDOW_MS = "600000";
  });

  // ----- Bot defence (honeypot) --------------------------------------------

  it("rejects submissions with a filled honeypot field as 'bot' and does not send email", async () => {
    const result = await submitContactForm(
      IDLE,
      makeFormData({ ...VALID, company_url: "https://spam.example" }),
    );
    expect(result.status).toBe("error");
    expect((result as { code?: string }).code).toBe("bot");
    expect(sendMock).not.toHaveBeenCalled();
  });

  // ----- Rate limit --------------------------------------------------------

  it("returns 'rate_limit' on the call that exceeds RATE_LIMIT_MAX", async () => {
    // First 3 succeed (RATE_LIMIT_MAX = 3).
    for (let i = 0; i < 3; i++) {
      const ok = await submitContactForm(IDLE, makeFormData(VALID));
      expect(ok.status).toBe("success");
    }
    // 4th is blocked.
    const blocked = await submitContactForm(IDLE, makeFormData(VALID));
    expect(blocked.status).toBe("error");
    expect((blocked as { code?: string }).code).toBe("rate_limit");
    // Email handler was NOT called for the blocked one.
    expect(sendMock).toHaveBeenCalledTimes(3);
  });

  // ----- Validation --------------------------------------------------------

  it("returns a validation error when name is empty", async () => {
    const r = await submitContactForm(
      IDLE,
      makeFormData({ ...VALID, name: "" }),
    );
    expect(r.status).toBe("error");
    expect((r as { code?: string }).code).toBe("validation");
    expect(
      (r as { fieldErrors?: { name?: string } }).fieldErrors?.name,
    ).toBeTruthy();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns a validation error when email is empty", async () => {
    const r = await submitContactForm(
      IDLE,
      makeFormData({ ...VALID, email: "" }),
    );
    expect((r as { code?: string }).code).toBe("validation");
    expect(
      (r as { fieldErrors?: { email?: string } }).fieldErrors?.email,
    ).toBeTruthy();
  });

  it("returns a validation error when email is malformed", async () => {
    const r = await submitContactForm(
      IDLE,
      makeFormData({ ...VALID, email: "not-an-email" }),
    );
    expect((r as { code?: string }).code).toBe("validation");
    expect(
      (r as { fieldErrors?: { email?: string } }).fieldErrors?.email,
    ).toBeTruthy();
  });

  it("returns a validation error when message is empty", async () => {
    const r = await submitContactForm(
      IDLE,
      makeFormData({ ...VALID, message: "" }),
    );
    expect((r as { code?: string }).code).toBe("validation");
    expect(
      (r as { fieldErrors?: { message?: string } }).fieldErrors?.message,
    ).toBeTruthy();
  });

  it("returns a validation error when message is shorter than 10 characters", async () => {
    const r = await submitContactForm(
      IDLE,
      makeFormData({ ...VALID, message: "hi" }),
    );
    expect((r as { code?: string }).code).toBe("validation");
    expect(
      (r as { fieldErrors?: { message?: string } }).fieldErrors?.message,
    ).toBeTruthy();
  });

  // ----- Happy path --------------------------------------------------------

  it("returns success on a valid submission", async () => {
    const r = await submitContactForm(IDLE, makeFormData(VALID));
    expect(r.status).toBe("success");
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  // ----- Sanitisation ------------------------------------------------------

  it("strips HTML tags from name and message before passing to the email handler", async () => {
    const r = await submitContactForm(
      IDLE,
      makeFormData({
        ...VALID,
        name: "<script>alert(1)</script>Real Visitor",
        message:
          "<b>Hello</b><script>steal()</script> — please confirm you have buns at 9am tomorrow.",
      }),
    );
    expect(r.status).toBe("success");
    expect(sendMock).toHaveBeenCalledTimes(1);
    const args = sendMock.mock.calls[0][0] as {
      name: string;
      email: string;
      message: string;
    };
    expect(args.name).not.toMatch(/<script>/i);
    expect(args.name).not.toMatch(/<\/script>/i);
    expect(args.message).not.toMatch(/<b>/i);
    expect(args.message).not.toMatch(/<script>/i);
  });

  // ----- Error contract: NEVER leak internals ------------------------------

  it("never exposes raw error messages or stack traces in the response when the email handler throws", async () => {
    sendMock.mockRejectedValue(
      new Error("Resend API: invalid API key (sk_xxx) — check your dashboard"),
    );
    const r = await submitContactForm(IDLE, makeFormData(VALID));
    expect(r.status).toBe("error");
    expect((r as { code?: string }).code).toBe("server");
    const serialised = JSON.stringify(r);
    // Hard guards: none of these substrings should ever leak to the client.
    expect(serialised).not.toMatch(/Resend/i);
    expect(serialised).not.toMatch(/api key/i);
    expect(serialised).not.toMatch(/sk_/i);
    expect(serialised).not.toMatch(/dashboard/i);
    expect(serialised).not.toMatch(/stack/i);
  });
});

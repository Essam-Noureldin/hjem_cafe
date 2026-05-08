/**
 * @jest-environment node
 *
 * WHAT: Tests for /lib/email.ts — the contact form's email wrapper.
 *       Covers the demo-mode path (no Resend creds → log + return ok)
 *       and the live-mode path (creds set → call Resend SDK with the
 *       expected payload).
 * WHY:  Demo mode is the default for this speculative build, so a
 *       regression that breaks it kills every contact-form submit
 *       silently. Live mode is what runs once Hjem ship a verified
 *       sender domain — pin the Resend call shape now so future env
 *       changes don't accidentally drop fields like replyTo.
 *
 * Resend is mocked via jest.mock so no network traffic leaves the
 * machine. Node env because this is a server-only module.
 */

// Resend SDK mock — must register before the lazy import inside email.ts
// resolves to it. The mock factory is called lazily by Jest, so no order
// dependency with the imports below.
const sendMock = jest.fn();
jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: sendMock },
  })),
}));

import { sendContactEmail } from "@/lib/email";

const ORIGINAL_ENV = { ...process.env };

describe("sendContactEmail", () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    sendMock.mockReset();
    sendMock.mockResolvedValue({ id: "test-email-id" });
    // Silence the demo-mode console.log during tests so output is clean.
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    logSpy.mockRestore();
  });

  it("returns { ok: true, mode: 'logged' } in demo mode (no Resend creds)", async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_FORM_FROM_EMAIL;

    const result = await sendContactEmail({
      name: "Test User",
      email: "test@example.com",
      message: "Hello there",
    });

    expect(result).toEqual({ ok: true, mode: "logged" });
    expect(sendMock).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
  });

  it("treats whitespace-only env vars as missing (still demo mode)", async () => {
    process.env.RESEND_API_KEY = "   ";
    process.env.CONTACT_FORM_FROM_EMAIL = "   ";

    const result = await sendContactEmail({
      name: "Test User",
      email: "test@example.com",
      message: "Hello there",
    });

    expect(result.ok).toBe(true);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("calls Resend with the expected payload when creds are set", async () => {
    process.env.RESEND_API_KEY = "re_test_123";
    process.env.CONTACT_FORM_FROM_EMAIL = "hello@hjemkensington.com";
    process.env.CONTACT_FORM_TO_EMAIL = "inbox@hjemkensington.com";

    const result = await sendContactEmail({
      name: "Real Visitor",
      email: "visitor@example.com",
      message: "Cardamom buns at 9am, please.",
    });

    expect(result).toEqual({ ok: true, mode: "sent" });
    expect(sendMock).toHaveBeenCalledTimes(1);
    const args = sendMock.mock.calls[0][0];
    expect(args.from).toBe("hello@hjemkensington.com");
    expect(args.to).toBe("inbox@hjemkensington.com");
    expect(args.replyTo).toBe("visitor@example.com");
    expect(args.subject).toMatch(/Real Visitor/);
    expect(args.text).toContain("Cardamom buns at 9am, please.");
  });

  it("propagates Resend errors so the caller can convert to a generic response", async () => {
    process.env.RESEND_API_KEY = "re_test_123";
    process.env.CONTACT_FORM_FROM_EMAIL = "hello@hjemkensington.com";
    process.env.CONTACT_FORM_TO_EMAIL = "inbox@hjemkensington.com";
    sendMock.mockRejectedValue(new Error("Resend boom"));

    await expect(
      sendContactEmail({
        name: "Test",
        email: "test@example.com",
        message: "Hello there",
      }),
    ).rejects.toThrow(/Resend boom/);
  });
});

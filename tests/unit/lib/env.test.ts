/**
 * WHAT: Tests for /lib/env.ts — the typed environment-variable validator.
 * WHY:  Env validation is the boot-time gate that protects every other
 *       part of the app. If this is wrong, the whole app is shaky.
 * COMMON MISTAKE: testing the module's *singleton* `env` export instead
 *                 of the `validate()` function. The singleton runs at
 *                 module load — by the time the test imports it, it has
 *                 already validated against process.env (the real env).
 *                 Tests use validate(source) with custom inputs instead.
 */

import { validate } from "@/lib/env";

/**
 * A "complete" valid env object reused across tests. Tests that want to
 * test a specific failure mode start from this and remove or change one
 * field — keeps each test focused on the single behaviour it asserts.
 */
const validEnv: Record<string, string | undefined> = {
  NEXT_PUBLIC_SITE_URL: "https://hjem.test",
  CONTACT_FORM_TO_EMAIL: "test@example.com",
  RATE_LIMIT_MAX: "3",
  RATE_LIMIT_WINDOW_MS: "600000",
  COOKIE_CONSENT_REQUIRED: "true",
};


describe("validate()", () => {
  // ----- Required-var enforcement -------------------------------------------

  it("throws when NEXT_PUBLIC_SITE_URL is missing", () => {
    const env = { ...validEnv };
    delete env.NEXT_PUBLIC_SITE_URL;
    expect(() => validate(env)).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it("throws when CONTACT_FORM_TO_EMAIL is missing", () => {
    const env = { ...validEnv };
    delete env.CONTACT_FORM_TO_EMAIL;
    expect(() => validate(env)).toThrow(/CONTACT_FORM_TO_EMAIL/);
  });

  it("throws when RATE_LIMIT_MAX is missing", () => {
    const env = { ...validEnv };
    delete env.RATE_LIMIT_MAX;
    expect(() => validate(env)).toThrow(/RATE_LIMIT_MAX/);
  });

  it("treats empty string as missing", () => {
    expect(() => validate({ ...validEnv, NEXT_PUBLIC_SITE_URL: "" })).toThrow(
      /NEXT_PUBLIC_SITE_URL/,
    );
  });

  it("treats whitespace-only string as missing", () => {
    expect(() =>
      validate({ ...validEnv, NEXT_PUBLIC_SITE_URL: "   " }),
    ).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it("error message lists ALL missing vars at once, not just the first", () => {
    expect(() =>
      validate({
        RATE_LIMIT_MAX: "3",
        RATE_LIMIT_WINDOW_MS: "600000",
        COOKIE_CONSENT_REQUIRED: "true",
      }),
    ).toThrow(/NEXT_PUBLIC_SITE_URL.*CONTACT_FORM_TO_EMAIL/);
  });

  // ----- Happy path: returns parsed values ----------------------------------

  it("does not throw when all required vars are present", () => {
    expect(() => validate(validEnv)).not.toThrow();
  });

  it("returns string env vars as strings", () => {
    const result = validate(validEnv);
    expect(result.NEXT_PUBLIC_SITE_URL).toBe("https://hjem.test");
    expect(result.CONTACT_FORM_TO_EMAIL).toBe("test@example.com");
  });

  it("parses RATE_LIMIT_MAX as a number", () => {
    const result = validate({ ...validEnv, RATE_LIMIT_MAX: "5" });
    expect(result.RATE_LIMIT_MAX).toBe(5);
    expect(typeof result.RATE_LIMIT_MAX).toBe("number");
  });

  it("parses RATE_LIMIT_WINDOW_MS as a number", () => {
    const result = validate({ ...validEnv, RATE_LIMIT_WINDOW_MS: "300000" });
    expect(result.RATE_LIMIT_WINDOW_MS).toBe(300000);
    expect(typeof result.RATE_LIMIT_WINDOW_MS).toBe("number");
  });

  it("parses COOKIE_CONSENT_REQUIRED='true' as boolean true", () => {
    const result = validate({ ...validEnv, COOKIE_CONSENT_REQUIRED: "true" });
    expect(result.COOKIE_CONSENT_REQUIRED).toBe(true);
  });

  it("parses COOKIE_CONSENT_REQUIRED='false' as boolean false", () => {
    const result = validate({ ...validEnv, COOKIE_CONSENT_REQUIRED: "false" });
    expect(result.COOKIE_CONSENT_REQUIRED).toBe(false);
  });

  it("parses COOKIE_CONSENT_REQUIRED case-insensitively", () => {
    const result = validate({ ...validEnv, COOKIE_CONSENT_REQUIRED: "TRUE" });
    expect(result.COOKIE_CONSENT_REQUIRED).toBe(true);
  });

  // ----- Optional vars -------------------------------------------------------

  it("returns undefined for missing optional vars", () => {
    const result = validate(validEnv);
    expect(result.NEXT_PUBLIC_GA_ID).toBeUndefined();
    expect(result.NEXT_PUBLIC_SENTRY_DSN).toBeUndefined();
    expect(result.CONTACT_FORM_FROM_EMAIL).toBeUndefined();
    expect(result.RESEND_API_KEY).toBeUndefined();
  });

  it("returns the string value when an optional var is set", () => {
    const result = validate({
      ...validEnv,
      NEXT_PUBLIC_GA_ID: "G-ABC123",
      NEXT_PUBLIC_SENTRY_DSN: "https://abc@o123.ingest.sentry.io/456",
    });
    expect(result.NEXT_PUBLIC_GA_ID).toBe("G-ABC123");
    expect(result.NEXT_PUBLIC_SENTRY_DSN).toBe(
      "https://abc@o123.ingest.sentry.io/456",
    );
  });

  it("treats empty-string optional vars as undefined (not as set)", () => {
    const result = validate({ ...validEnv, NEXT_PUBLIC_GA_ID: "" });
    expect(result.NEXT_PUBLIC_GA_ID).toBeUndefined();
  });

  // ----- Number parsing edge cases ------------------------------------------

  it("throws if RATE_LIMIT_MAX is not a valid number", () => {
    expect(() =>
      validate({ ...validEnv, RATE_LIMIT_MAX: "not-a-number" }),
    ).toThrow(/RATE_LIMIT_MAX/);
  });

  it("throws if RATE_LIMIT_WINDOW_MS is not a valid number", () => {
    expect(() =>
      validate({ ...validEnv, RATE_LIMIT_WINDOW_MS: "abc" }),
    ).toThrow(/RATE_LIMIT_WINDOW_MS/);
  });
});

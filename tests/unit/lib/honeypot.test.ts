/**
 * WHAT: Tests for /lib/honeypot.ts — bot detection via hidden form field.
 * WHY:  The honeypot is the cheapest spam filter we have. Tests pin
 *       down the exact "is this filled" rules so a future refactor
 *       can't accidentally let bots through.
 *
 * COMMON MISTAKE: trimming whitespace before checking. Master prompt
 *                 spec is explicit: a single space character IS a bot
 *                 signal, because a human can't even SEE the field
 *                 (display:none) — any content at all is suspicious.
 */

import { isBot } from "@/lib/honeypot";

describe("isBot()", () => {
  it("returns true when the honeypot has any letters", () => {
    expect(isBot("anything")).toBe(true);
  });

  it("returns true even for a single space", () => {
    // Per master prompt — humans never see the field, so even whitespace
    // is suspicious.
    expect(isBot(" ")).toBe(true);
  });

  it("returns true for whitespace-only (tabs, newlines)", () => {
    expect(isBot("\t")).toBe(true);
    expect(isBot("\n")).toBe(true);
    expect(isBot("   \n   ")).toBe(true);
  });

  it("returns false for empty string", () => {
    expect(isBot("")).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isBot(undefined)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isBot(null)).toBe(false);
  });

  it("returns true for HTML-like content (a confused bot tried to inject)", () => {
    expect(isBot("<script>")).toBe(true);
  });

  it("returns true for a URL (the most common bot fill)", () => {
    expect(isBot("https://buy-cheap-stuff.example")).toBe(true);
  });
});

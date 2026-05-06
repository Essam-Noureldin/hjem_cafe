/**
 * WHAT: Tests for /lib/sanitize.ts — strips HTML tags from contact form input.
 * WHY:  Sanitization is the first line of defence against XSS. If this is
 *       wrong, an attacker can inject <script> via a form field that gets
 *       rendered somewhere downstream (an admin view, an HTML email, a
 *       success page). These tests pin down the exact behaviour.
 * COMMON MISTAKE: testing only the happy case. The interesting bugs live
 *                 in edge cases — null inputs, malformed tags, math-like
 *                 text with bare `<` and `>`. Test those explicitly.
 */

import { sanitize } from "@/lib/sanitize";

describe("sanitize()", () => {
  // ----- Strips HTML tags ----------------------------------------------------

  it("strips a <script> tag and its contents-marker", () => {
    expect(sanitize("<script>alert('xss')</script>")).toBe("alert('xss')");
  });

  it("strips multiple HTML tags", () => {
    expect(sanitize("<p>hello</p><br/><span>world</span>")).toBe(
      "helloworld",
    );
  });

  it("strips tags with attributes", () => {
    expect(
      sanitize('<a href="https://evil.com" onclick="bad()">click</a>'),
    ).toBe("click");
  });

  it("strips self-closing tags", () => {
    expect(sanitize("line one<br/>line two")).toBe("line oneline two");
  });

  it("strips tags case-insensitively (HTML is case-insensitive)", () => {
    expect(sanitize("<SCRIPT>x</SCRIPT>")).toBe("x");
    expect(sanitize("<DiV>y</DiV>")).toBe("y");
  });

  // ----- Preserves legitimate content ---------------------------------------

  it("preserves plain text unchanged", () => {
    expect(sanitize("Hi, I'd love to book a table for 4 on Friday at 7pm.")).toBe(
      "Hi, I'd love to book a table for 4 on Friday at 7pm.",
    );
  });

  it("preserves numbers and punctuation", () => {
    expect(sanitize("Call me on +44 7700 900123 — thanks!")).toBe(
      "Call me on +44 7700 900123 — thanks!",
    );
  });

  it("preserves non-tag angle brackets in math/comparison text", () => {
    // Real-world case: a customer asks "are you open if temp < 0 or > 30?"
    // A naive /<.*>/g regex would eat the middle. Our regex requires a
    // letter (or /) immediately after `<` — math comparisons don't qualify.
    expect(sanitize("are you open if temp < 0 or > 30?")).toBe(
      "are you open if temp < 0 or > 30?",
    );
  });

  it("preserves HTML entities as literal text (does NOT decode them)", () => {
    // &lt;script&gt; is harmless literal text — would render as `<script>`
    // visible characters in HTML output, not as a script element.
    expect(sanitize("&lt;script&gt;")).toBe("&lt;script&gt;");
  });

  // ----- Nullish handling ----------------------------------------------------

  it("returns empty string for null", () => {
    expect(sanitize(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(sanitize(undefined)).toBe("");
  });

  it("returns empty string for empty input", () => {
    expect(sanitize("")).toBe("");
  });

  // ----- Pathological inputs -------------------------------------------------

  it("handles a 1MB string with embedded tags without hanging", () => {
    // 1 MB of "<b>x</b>" repeated. If the regex had catastrophic
    // backtracking, this would time out the test runner. Our regex is
    // O(n) so this completes in milliseconds.
    const huge = "<b>x</b>".repeat(125_000); // ~1 MB
    const result = sanitize(huge);
    expect(result).toBe("x".repeat(125_000));
  }, 5_000); // explicit 5s timeout — should finish in <100ms

  it("handles unclosed tags gracefully (leaves them as text)", () => {
    // `<scr` with no closing `>` is not a complete HTML tag. Best to
    // leave it as literal text rather than over-strip.
    expect(sanitize("hello <scr")).toBe("hello <scr");
  });

  it("handles a lone < or > without stripping surrounding text", () => {
    expect(sanitize("a<b")).toBe("a<b");
    expect(sanitize("a>b")).toBe("a>b");
  });

  it("strips nested tags (greedy outer match still leaves clean text)", () => {
    expect(sanitize("<div><p>nested</p></div>")).toBe("nested");
  });
});

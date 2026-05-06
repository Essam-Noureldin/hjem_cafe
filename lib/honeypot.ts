/**
 * WHAT: Decides whether a contact-form submission came from a bot, by
 *       checking the value of a hidden "honeypot" form field. If the
 *       field has any value at all, it's a bot.
 *
 * WHY:  Bots crawl pages and auto-fill every input they find. Humans
 *       never see the honeypot field — it's hidden with display:none in
 *       the form template. Any content in it = bot. Free spam filter,
 *       catches ~80% of automated submissions before they cost us
 *       anything else (rate-limit storage, sanitisation cycles, etc).
 *
 * IF REMOVED: the contact form's first line of defence is gone. We'd
 *             still have rate limiting and validation, but spam volume
 *             going through those layers would jump roughly 5x.
 *
 * COMMON MISTAKE 1: using visibility:hidden in CSS instead of display:none.
 *                   Some bots check `visibility` and skip hidden fields.
 *                   Almost no bots check `display: none`.
 * COMMON MISTAKE 2: trimming whitespace here before the check. Don't.
 *                   Humans can't even see the field — a bot that fills
 *                   it with " " (a space) is still a bot. Treat any
 *                   non-empty value as suspicious.
 */


/**
 * Returns true if the honeypot field is filled (= bot suspected),
 * false if empty/missing (= probably human).
 */
export function isBot(value: string | null | undefined): boolean {
  // Nullish: field wasn't submitted at all → human (or honest browser
  // that omits empty fields).
  if (value == null) return false;

  // Empty string: field exists but is blank → human (the natural state
  // of a hidden, never-displayed input).
  if (value === "") return false;

  // Anything else — even a single space — is a bot signal.
  return true;
}

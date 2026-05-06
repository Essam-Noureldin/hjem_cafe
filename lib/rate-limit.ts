/**
 * WHAT: An in-memory sliding-window rate limiter. Given an identifier
 *       (e.g. a hashed IP) and a max-per-window policy, returns whether
 *       this call should be allowed and, if not, how long until the next
 *       slot opens.
 *
 * WHY:  Stops a bot or angry person from hammering the contact form. The
 *       sliding window (vs fixed window) prevents the classic "11:59 burst
 *       + 12:00 burst = 2x the limit" exploit.
 *
 * WHY in-memory (not Redis): this is a low-traffic local business site.
 *       Redis would add infrastructure cost and ops complexity. The
 *       trade-off is that limits reset on Vercel cold-start, which is
 *       acceptable for spam (annoying for the spammer, invisible to real
 *       users). For a security-critical use case (login throttling) we
 *       would need Upstash Redis.
 *
 * WHY no IP reading inside this module: it accepts a string identifier
 *       and stays purely a counting utility. The contact form server
 *       action (Step 17) handles the IP plumbing and hashing — easier to
 *       test, reusable for non-IP identifiers later (e.g. user ID).
 *
 * IF REMOVED: spam bots can submit the contact form thousands of times
 *             per minute. Client's inbox fills up; legitimate enquiries
 *             get buried.
 *
 * COMMON MISTAKE: storing only a single timestamp per identifier (the
 *                 first or last hit). That gives you a fixed-window
 *                 limiter at best, and at worst a permanent block. We
 *                 store ALL hits within the window so the count refills
 *                 gradually as old hits age out.
 */


/**
 * Storage: identifier → array of millisecond timestamps for hits within
 * the current window. Older hits are pruned lazily on next access.
 *
 * `Map` over plain object: Map keys can include any string safely (no
 * `__proto__` collision worries) and `.size`/`.delete()` are direct.
 */
const hits = new Map<string, number[]>();


/**
 * Test-only escape hatch — clears the hit map between tests so each
 * test starts in a known state. Underscore prefix marks it as private
 * to test code; production callers should never use it.
 */
export function _resetRateLimitForTests(): void {
  hits.clear();
}


export type RateLimitOptions = {
  max: number;       // maximum hits allowed within the window
  windowMs: number;  // window length in milliseconds
};

export type RateLimitResult = {
  allowed: boolean;
  /**
   * If !allowed, ms until the oldest in-window hit ages out and a slot
   * opens up. Useful for setting a Retry-After response header.
   */
  retryAfterMs?: number;
};


/**
 * Check whether the call from `identifier` is allowed under the given
 * sliding-window policy. Records the call as a hit if allowed.
 *
 * Algorithm:
 *   1. Look up existing hits for this identifier.
 *   2. Drop any older than (now - windowMs) — they're outside the window.
 *   3. If remaining count < max → record this hit, return allowed.
 *   4. Else → don't record, return blocked + retryAfter from oldest hit.
 *
 * Time complexity: O(k) where k is hits-within-window for this identifier.
 * Bounded by `max` (we stop tracking past it). Practically O(1).
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  // Existing hits for this identifier (may be undefined for first call).
  const existing = hits.get(identifier) ?? [];

  // Prune anything outside the window. `filter` reads the array once;
  // for our typical max ≤ 5 this is trivial.
  const fresh = existing.filter((t) => t > windowStart);

  if (fresh.length >= options.max) {
    // Blocked. Don't record this hit. Return how long until the oldest
    // hit (which is currently the bottleneck) ages out.
    const oldestHit = fresh[0]; // filter preserves insertion order
    const retryAfterMs = oldestHit + options.windowMs - now;

    // Save the pruned list back so future calls don't keep re-filtering
    // the same expired timestamps.
    hits.set(identifier, fresh);

    return { allowed: false, retryAfterMs };
  }

  // Allowed — record this hit and persist.
  fresh.push(now);
  hits.set(identifier, fresh);
  return { allowed: true };
}

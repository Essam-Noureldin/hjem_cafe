/**
 * WHAT: Tests for /lib/rate-limit.ts — the in-memory sliding-window
 *       rate limiter the contact form uses to stop spam and brute-force.
 * WHY:  Rate limiting is silently broken if you only happy-path test it.
 *       The interesting bugs are at the boundaries (exactly limit+1),
 *       across the time window expiry, and across multiple identifiers.
 *
 * COMMON MISTAKE: testing time-dependent behaviour with real timers.
 *                 Tests would either be slow (waiting 10 real minutes)
 *                 or flaky (pass on a fast laptop, fail on slow CI).
 *                 Use jest.useFakeTimers() + jest.setSystemTime().
 */

import { rateLimit, _resetRateLimitForTests } from "@/lib/rate-limit";

describe("rateLimit()", () => {
  beforeEach(() => {
    // Start every test from a clean state and a known clock position.
    // Without resetting the in-memory Map, hits from prior tests would
    // leak in and break isolation.
    _resetRateLimitForTests();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-04T12:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const opts = { max: 3, windowMs: 600_000 }; // 3 per 10 minutes

  // ----- Allowed under the limit --------------------------------------------

  it("allows the first request", () => {
    const result = rateLimit("ip-hash-A", opts);
    expect(result.allowed).toBe(true);
  });

  it("allows requests up to and including the limit", () => {
    expect(rateLimit("ip-hash-A", opts).allowed).toBe(true); // 1st
    expect(rateLimit("ip-hash-A", opts).allowed).toBe(true); // 2nd
    expect(rateLimit("ip-hash-A", opts).allowed).toBe(true); // 3rd — exactly max
  });

  // ----- Blocks at limit+1 --------------------------------------------------

  it("blocks the (limit + 1)th request", () => {
    rateLimit("ip-hash-A", opts);
    rateLimit("ip-hash-A", opts);
    rateLimit("ip-hash-A", opts);
    const fourth = rateLimit("ip-hash-A", opts);
    expect(fourth.allowed).toBe(false);
  });

  it("returns retryAfterMs when blocked, indicating when the next slot opens", () => {
    rateLimit("ip-hash-A", opts); // at t=0
    rateLimit("ip-hash-A", opts);
    rateLimit("ip-hash-A", opts);
    jest.advanceTimersByTime(60_000); // advance 1 minute
    const blocked = rateLimit("ip-hash-A", opts);
    expect(blocked.allowed).toBe(false);
    // First slot opens 9 minutes from now (window=10min, oldest hit was 1min ago)
    expect(blocked.retryAfterMs).toBe(540_000); // 9 minutes
  });

  // ----- Window expiry ------------------------------------------------------

  it("allows new requests after the full window has passed", () => {
    rateLimit("ip-hash-A", opts);
    rateLimit("ip-hash-A", opts);
    rateLimit("ip-hash-A", opts);

    jest.advanceTimersByTime(opts.windowMs + 1); // step past the window

    const result = rateLimit("ip-hash-A", opts);
    expect(result.allowed).toBe(true);
  });

  it("partially refills as old hits age out (sliding window, not fixed)", () => {
    rateLimit("ip-hash-A", opts); // at t=0
    jest.advanceTimersByTime(300_000); // +5 min
    rateLimit("ip-hash-A", opts); // at t=5min
    rateLimit("ip-hash-A", opts); // at t=5min — third hit, at limit

    // 4th hit is blocked
    expect(rateLimit("ip-hash-A", opts).allowed).toBe(false);

    // Now advance to t=10min01s — the FIRST hit (at t=0) is now outside
    // the 10-minute window, so the count drops from 3 → 2 effective hits,
    // and a new request should be allowed.
    jest.advanceTimersByTime(300_001); // total t = 10min 0.001s
    expect(rateLimit("ip-hash-A", opts).allowed).toBe(true);
  });

  // ----- Multiple identifiers -----------------------------------------------

  it("tracks different identifiers independently", () => {
    rateLimit("ip-hash-A", opts);
    rateLimit("ip-hash-A", opts);
    rateLimit("ip-hash-A", opts);
    // A is at limit. B should still be fresh.
    expect(rateLimit("ip-hash-A", opts).allowed).toBe(false);
    expect(rateLimit("ip-hash-B", opts).allowed).toBe(true);
    expect(rateLimit("ip-hash-B", opts).allowed).toBe(true);
    expect(rateLimit("ip-hash-B", opts).allowed).toBe(true);
    expect(rateLimit("ip-hash-B", opts).allowed).toBe(false);
  });

  // ----- Edge cases ---------------------------------------------------------

  it("respects different max values for different calls", () => {
    rateLimit("ip-hash-A", { max: 1, windowMs: 600_000 });
    expect(
      rateLimit("ip-hash-A", { max: 1, windowMs: 600_000 }).allowed,
    ).toBe(false);
  });

  it("treats max=0 as 'always block' (defensive: should not crash)", () => {
    expect(
      rateLimit("ip-hash-A", { max: 0, windowMs: 600_000 }).allowed,
    ).toBe(false);
  });

  it("does not leak hits between calls in the same millisecond", () => {
    // Defensive check for the case where 4 requests arrive in the same
    // tick (e.g. user double-double-clicks the submit button). The 4th
    // must still be blocked, not somehow get through because timestamps
    // collide.
    expect(rateLimit("ip-hash-A", opts).allowed).toBe(true);
    expect(rateLimit("ip-hash-A", opts).allowed).toBe(true);
    expect(rateLimit("ip-hash-A", opts).allowed).toBe(true);
    expect(rateLimit("ip-hash-A", opts).allowed).toBe(false);
  });
});

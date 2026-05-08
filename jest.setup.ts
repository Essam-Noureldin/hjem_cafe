/**
 * WHAT: Runs once after Jest's framework loads, before any test runs.
 *       Imports custom matchers and sets up mocks every test depends on.
 *
 * WHY:  Without this, two things break:
 *       1. Custom matchers like .toBeInTheDocument() don't exist.
 *       2. Framer Motion's prefers-reduced-motion check throws because
 *          window.matchMedia isn't implemented in jsdom — and accessibility
 *          tests with axe-core flag mid-animation invisible elements as
 *          contrast failures.
 *
 * IF REMOVED: every component test file would have to import jest-dom
 *             individually; smoke/accessibility tests that render any
 *             Framer Motion component would either error on missing
 *             matchMedia or get false-positive axe violations.
 *
 * COMMON MISTAKE: spreading these mocks across multiple files. Centralising
 *                 them here means every test in the suite gets the same
 *                 baseline, no matter who writes it.
 */

// Registers .toBeInTheDocument(), .toHaveClass(), etc. as Jest matchers.
import "@testing-library/jest-dom";


/**
 * Skip browser-environment mocks when running in the node test
 * environment. Server-only tests (server actions, security headers)
 * declare `@jest-environment node` at the top of the file — there's
 * no `window` to mutate, and trying to throws.
 *
 * The unconditional jest-dom import above is fine in either environment
 * (it's a pure JS module that just registers matchers).
 */
if (typeof window === "undefined") {
  // No-op in node env — return early before the window mocks.
} else {
  setupBrowserMocks();
}

function setupBrowserMocks() {
/**
 * Mock window.matchMedia
 *
 * jsdom (the fake browser Jest uses) doesn't implement window.matchMedia.
 * Any code that calls it — including Framer Motion's reduced-motion check
 * and any responsive logic in our components — would throw.
 *
 * We mock it to return `matches: true` for `prefers-reduced-motion` so
 * Framer Motion skips animations during tests. This also fixes a known
 * axe-core false positive: when motion is enabled, mid-animation elements
 * appear with opacity:0 to axe and get flagged as low-contrast text.
 *
 * For all other media queries, return matches: false (the safer default).
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),    // legacy API — some libs still use it
    removeListener: jest.fn(), // legacy API
    dispatchEvent: jest.fn(),
  }),
});


/**
 * Mock IntersectionObserver
 *
 * Used by lazy-loading components, scroll-triggered animations, and
 * Next.js <Image> with priority={false}. jsdom doesn't implement it.
 * Without this mock, any component that uses IntersectionObserver
 * crashes during render in tests.
 */
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);
  root = null;
  rootMargin = "";
  thresholds = [];
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});


/**
 * Mock ResizeObserver
 *
 * Same story as IntersectionObserver — jsdom doesn't implement it,
 * Tailwind utilities and many UI libraries depend on it.
 */
class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});
}

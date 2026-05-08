/**
 * WHAT: Smoke test — does every page in the site render without crashing,
 *       and without throwing any React warnings into the console? Covers
 *       the homepage and all three legal pages.
 * WHY:  Smoke tests catch the embarrassing class of bug — a missing key
 *       prop, a hydration mismatch warning, an accidentally-removed import
 *       that throws on first render. Unit tests check individual pieces;
 *       these prove the whole assembled page boots up clean.
 *
 * Approach: render each page through React Testing Library, with a console
 * spy installed before render. After render, assert nothing was logged to
 * console.error or console.warn. If something is logged, the test prints
 * the message so the cause is obvious from the failure output alone.
 *
 * COMMON MISTAKE: trusting that "no thrown exception" means "renders cleanly."
 *                 React swallows most warnings into console.error rather than
 *                 throwing — without this spy, a missing key in a list passes
 *                 silently and ships to production.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { render } from "@testing-library/react";

import HomePage from "@/app/page";
import PrivacyPolicyPage from "@/app/privacy-policy/page";
import TermsPage from "@/app/terms-and-conditions/page";
import CookiePolicyPage from "@/app/cookie-policy/page";

type ConsoleSpies = {
  error: jest.SpyInstance;
  warn: jest.SpyInstance;
};

function installConsoleSpies(): ConsoleSpies {
  return {
    error: jest.spyOn(console, "error").mockImplementation(() => {}),
    warn: jest.spyOn(console, "warn").mockImplementation(() => {}),
  };
}

function restoreConsoleSpies(spies: ConsoleSpies) {
  spies.error.mockRestore();
  spies.warn.mockRestore();
}

/**
 * Format the captured calls into a readable string for the failure output.
 * Without this, jest just prints `Array []` or `[Function]` and you have
 * no idea what was logged.
 */
function formatCalls(spy: jest.SpyInstance): string {
  return spy.mock.calls
    .map((call) => call.map((arg: unknown) => (arg instanceof Error ? arg.message : String(arg))).join(" "))
    .join("\n  ");
}

const PAGES: ReadonlyArray<{ name: string; component: () => any }> = [
  { name: "Home", component: HomePage as () => any },
  { name: "Privacy Policy", component: PrivacyPolicyPage as () => any },
  { name: "Terms & Conditions", component: TermsPage as () => any },
  { name: "Cookie Policy", component: CookiePolicyPage as () => any },
];

describe("smoke — page renders", () => {
  for (const { name, component: Page } of PAGES) {
    it(`${name} renders without throwing`, () => {
      expect(() => render(<Page />)).not.toThrow();
    });

    it(`${name} renders with no console.error calls`, () => {
      const spies = installConsoleSpies();
      try {
        render(<Page />);
        expect(
          spies.error,
          // Custom message surfaces every captured error in the failure output.
          // (jest-dom doesn't accept a 2nd arg — but plain expect does for hint.)
        ).not.toHaveBeenCalled();
        if (spies.error.mock.calls.length > 0) {
          // Belt-and-braces: if the assertion ever passes despite calls
          // (e.g. matcher version difference), still surface them.
          throw new Error(
            `console.error was called during render of ${name}:\n  ${formatCalls(spies.error)}`,
          );
        }
      } finally {
        restoreConsoleSpies(spies);
      }
    });

    it(`${name} renders with no console.warn calls`, () => {
      const spies = installConsoleSpies();
      try {
        render(<Page />);
        if (spies.warn.mock.calls.length > 0) {
          throw new Error(
            `console.warn was called during render of ${name}:\n  ${formatCalls(spies.warn)}`,
          );
        }
        expect(spies.warn).not.toHaveBeenCalled();
      } finally {
        restoreConsoleSpies(spies);
      }
    });
  }
});

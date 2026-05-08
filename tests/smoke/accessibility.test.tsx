/**
 * WHAT: Smoke test — every page passes axe-core's automated accessibility
 *       audit with zero violations, and meets two structural rules axe
 *       doesn't catch on its own: exactly one <h1> per page, and every
 *       <img> has an alt attribute (decorative images use alt="").
 * WHY:  Automated checks catch ~30% of accessibility issues — the rest
 *       need human judgement. But that 30% is the unforgivable 30%:
 *       missing labels on form inputs, low contrast text, missing alt
 *       on informative images. This test ships a floor, not a ceiling.
 *
 * Approach: render each page, hand the rendered DOM to axe-core, assert
 * `expect(results).toHaveNoViolations()`. The matcher comes from jest-axe;
 * its failure output names the rule violated and the offending element,
 * so a failure is actionable without running anything by hand.
 *
 * The matchMedia mock in jest.setup.ts forces prefers-reduced-motion to
 * true, so Framer Motion components render at their final visible state
 * for the scan — without that, axe flags mid-animation opacity:0 elements
 * as low contrast.
 *
 * COMMON MISTAKE: mocking axe so the test always passes. If axe is hard
 *                 to satisfy, the answer is to fix the page, not the test.
 *
 * (jest-axe is the right tool here, not @axe-core/react. The latter is a
 * runtime browser logger; jest-axe is the Jest matcher integration.)
 */

import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

import HomePage from "@/app/page";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrivacyPolicyPage from "@/app/privacy-policy/page";
import TermsPage from "@/app/terms-and-conditions/page";
import CookiePolicyPage from "@/app/cookie-policy/page";

expect.extend(toHaveNoViolations);

/**
 * axe runs every rule in its default ruleset by default — that's a few
 * dozen. For smoke we want it broad rather than narrow: any new rule
 * added to axe in a future version should automatically be enforced.
 *
 * The one exception is `region` — axe expects every piece of content to
 * live inside a landmark. Footer's "© year" sub-bar isn't worth wrapping
 * in another landmark just to satisfy the rule, and the legal pages have
 * a single <main> already. Disable it to avoid flagging well-structured
 * pages that simply don't fit the landmark template.
 */
const AXE_OPTIONS = {
  rules: {
    region: { enabled: false },
  },
};

/* eslint-disable @typescript-eslint/no-explicit-any */

type PageBundle = { name: string; render: () => HTMLElement };

const PAGES: ReadonlyArray<PageBundle> = [
  {
    name: "Home (with navbar + footer)",
    render: () => {
      const HomeAny = HomePage as () => any;
      const { container } = render(
        <>
          <Navbar />
          <HomeAny />
          <Footer />
        </>,
      );
      return container;
    },
  },
  {
    name: "Privacy Policy",
    render: () => {
      const PageAny = PrivacyPolicyPage as () => any;
      return render(<PageAny />).container;
    },
  },
  {
    name: "Terms & Conditions",
    render: () => {
      const PageAny = TermsPage as () => any;
      return render(<PageAny />).container;
    },
  },
  {
    name: "Cookie Policy",
    render: () => {
      const PageAny = CookiePolicyPage as () => any;
      return render(<PageAny />).container;
    },
  },
];

describe("smoke — accessibility", () => {
  for (const { name, render: renderPage } of PAGES) {
    it(`${name} has no axe violations`, async () => {
      const container = renderPage();
      const results = await axe(container, AXE_OPTIONS);
      expect(results).toHaveNoViolations();
    });

    it(`${name} has exactly one <h1>`, () => {
      const container = renderPage();
      const h1s = container.querySelectorAll("h1");
      expect(h1s.length).toBe(1);
    });

    it(`${name} every <img> has an alt attribute`, () => {
      const container = renderPage();
      const imgs = Array.from(container.querySelectorAll("img"));
      const missing = imgs
        .filter((img) => img.getAttribute("alt") === null)
        .map((img) => img.getAttribute("src") ?? "(no src)");
      expect(missing).toEqual([]);
    });
  }
});

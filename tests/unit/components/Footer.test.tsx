/**
 * WHAT: Tests for the Footer — site-wide legal chrome.
 * WHY:  The footer is the legal back-stop. If a single legal link breaks
 *       (404, wrong href, missing entirely) the site is non-compliant
 *       before anyone notices. Test it before relying on it.
 * IF REMOVED: nothing else asserts the legal trio is reachable from every
 *             page. The integration test in legal-pages.test.tsx confirms
 *             the pages return 200; this test confirms visitors can find
 *             them.
 *
 * Test scope (per master prompt Step 15):
 *   - links to /privacy-policy, /terms-and-conditions, /cookie-policy
 *   - copyright text rendered
 *   - social links have aria-label attributes
 */

import { render, screen, within } from "@testing-library/react";
import Footer from "@/components/Footer";

const LEGAL_LINKS: ReadonlyArray<{ name: RegExp; href: string }> = [
  { name: /privacy policy/i, href: "/privacy-policy" },
  { name: /terms.*conditions/i, href: "/terms-and-conditions" },
  { name: /cookie policy/i, href: "/cookie-policy" },
];

describe("Footer", () => {
  describe("legal links", () => {
    it("links to every legal page with the correct href", () => {
      render(<Footer />);
      const footer = screen.getByRole("contentinfo");
      for (const { name, href } of LEGAL_LINKS) {
        const link = within(footer).getByRole("link", { name });
        expect(link).toHaveAttribute("href", href);
      }
    });
  });

  describe("copyright", () => {
    it("renders copyright text including the business name", () => {
      render(<Footer />);
      const footer = screen.getByRole("contentinfo");
      // Match a standard "© YYYY Hjem" pattern. Year intentionally not
      // pinned — a stale year is its own bug, but it shouldn't fail this
      // test the moment the calendar rolls over.
      expect(within(footer).getByText(/©\s*\d{4}.*hjem/i)).toBeInTheDocument();
    });
  });

  describe("social links", () => {
    it("renders at least one social link with an aria-label", () => {
      render(<Footer />);
      const footer = screen.getByRole("contentinfo");
      // Social icons are visually icon-only; they MUST carry an aria-label
      // for screen reader users. We assert the contract directly.
      const labelledLinks = within(footer)
        .getAllByRole("link")
        .filter((link) => link.hasAttribute("aria-label"));
      expect(labelledLinks.length).toBeGreaterThan(0);

      // Every aria-label must be non-empty — an empty string passes
      // hasAttribute() but is useless to AT.
      for (const link of labelledLinks) {
        expect(link.getAttribute("aria-label")).not.toBe("");
      }
    });

    it("social links open external sites with rel safety", () => {
      render(<Footer />);
      const footer = screen.getByRole("contentinfo");
      const externalLinks = within(footer)
        .getAllByRole("link")
        .filter((link) => link.getAttribute("href")?.startsWith("https://"));

      // At least one external (social) link expected.
      expect(externalLinks.length).toBeGreaterThan(0);

      // Each must declare target=_blank + rel="noopener noreferrer" so a
      // hijacked third-party page can't reach window.opener.
      for (const link of externalLinks) {
        expect(link).toHaveAttribute("target", "_blank");
        const rel = link.getAttribute("rel") ?? "";
        expect(rel).toMatch(/noopener/);
        expect(rel).toMatch(/noreferrer/);
      }
    });
  });
});

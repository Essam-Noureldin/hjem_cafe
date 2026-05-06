/**
 * WHAT: Tests for the Navbar — sticky top chrome rendered on every page.
 * WHY:  Navbar is the primary wayfinding surface. If a link breaks, the
 *       page-section anchors stop scrolling; if the mobile menu won't
 *       open, half the visitors lose all navigation. Both failure modes
 *       are silent in production unless tested here.
 * IF REMOVED: nothing else exercises the hamburger toggle, the link set,
 *             or the close-on-link-click contract. The smoke test in
 *             Step 20 walks the rendered page; it doesn't drive the menu.
 *
 * Test scope (per master prompt Step 14):
 *   - logo + nav links render
 *   - mobile menu hidden by default
 *   - mobile menu opens on hamburger click
 *   - mobile menu closes when a link is clicked
 *   - all hrefs are valid (point at the routes/anchors we expect)
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "@/components/Navbar";

/**
 * The four anchor targets baked into Hjem's one-page brochure (Step 16).
 * Kept here in the test so a refactor that silently drops a link fails
 * loudly rather than just rendering an empty nav.
 */
const EXPECTED_LINKS: ReadonlyArray<{ name: RegExp; href: string }> = [
  { name: /^home$/i, href: "/" },
  { name: /^story$/i, href: "/#story" },
  { name: /^menu$/i, href: "/#menu" },
  { name: /^visit$/i, href: "/#visit" },
];

describe("Navbar", () => {
  describe("rendering", () => {
    it("renders a navigation landmark", () => {
      render(<Navbar />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("renders the Hjem wordmark linking home", () => {
      render(<Navbar />);
      // The logo is a text wordmark ("Hjem") that doubles as the home link.
      // Using getAllByRole because the same /  link may appear in both the
      // desktop nav and the mobile panel — we only care that at least one
      // is the wordmark home link.
      const homeLinks = screen.getAllByRole("link", { name: /hjem/i });
      expect(homeLinks.length).toBeGreaterThan(0);
      expect(homeLinks[0]).toHaveAttribute("href", "/");
    });

    it("renders every expected nav link with the correct href", () => {
      render(<Navbar />);
      // Desktop nav is always in the DOM. We scope to the navigation
      // landmark to avoid double-counting links that also exist in the
      // mobile panel (which is hidden by default but still rendered).
      const nav = screen.getByRole("navigation");
      for (const { name, href } of EXPECTED_LINKS) {
        const links = within(nav).getAllByRole("link", { name });
        // At least one match — desktop, mobile, or both.
        expect(links.length).toBeGreaterThan(0);
        // Every match must point at the right href.
        for (const link of links) {
          expect(link).toHaveAttribute("href", href);
        }
      }
    });
  });

  describe("mobile menu", () => {
    it("renders a hamburger toggle button with an accessible name", () => {
      render(<Navbar />);
      expect(
        screen.getByRole("button", { name: /menu/i }),
      ).toBeInTheDocument();
    });

    it("is closed by default (toggle reports aria-expanded=false)", () => {
      render(<Navbar />);
      const toggle = screen.getByRole("button", { name: /menu/i });
      expect(toggle).toHaveAttribute("aria-expanded", "false");
    });

    it("opens when the hamburger is clicked (aria-expanded flips to true)", async () => {
      const user = userEvent.setup();
      render(<Navbar />);
      const toggle = screen.getByRole("button", { name: /menu/i });
      await user.click(toggle);
      expect(toggle).toHaveAttribute("aria-expanded", "true");
    });

    it("closes when a link inside the open menu is clicked", async () => {
      const user = userEvent.setup();
      render(<Navbar />);
      const toggle = screen.getByRole("button", { name: /menu/i });

      // Open it.
      await user.click(toggle);
      expect(toggle).toHaveAttribute("aria-expanded", "true");

      // The mobile panel is exposed via a controlled region. Find it by
      // the id the toggle's aria-controls points at — that contract is
      // what makes the menu accessible to screen readers, so testing it
      // doubles as an a11y check.
      const panelId = toggle.getAttribute("aria-controls");
      expect(panelId).toBeTruthy();
      const panel = document.getElementById(panelId as string);
      expect(panel).not.toBeNull();

      // Click the Story link inside the panel.
      const storyLink = within(panel as HTMLElement).getByRole("link", {
        name: /^story$/i,
      });
      await user.click(storyLink);

      // Toggle should now report closed.
      expect(toggle).toHaveAttribute("aria-expanded", "false");
    });
  });
});

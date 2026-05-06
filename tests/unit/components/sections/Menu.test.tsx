/**
 * WHAT: Tests for the Menu section — editorial two-column list of what
 *       Hjem serves, broken into category groups with prices.
 * WHY:  The Menu is one of three load-bearing sections on the brochure
 *       (Story / Menu / Visit). A silent regression on the heading,
 *       category structure, or the disclaimer note is the kind of thing
 *       that lets the demo ship looking wrong without breaking the build.
 * IF REMOVED: the navbar's `/#menu` anchor scrolls to a section with no
 *             enforced shape — heading levels, category groupings, and
 *             the indicative-prices disclaimer can drift unnoticed.
 *
 * Test scope:
 *   - section landmark with id="menu" (matches Navbar anchor)
 *   - exactly one h2 (page-level was h1 in Hero; sections nest at h2)
 *   - multiple category headings (h3) so screen readers can navigate
 *     within the menu
 *   - more than a token number of items so we don't accidentally ship
 *     a near-empty menu
 *   - the indicative-prices disclaimer is present (legal/honesty hedge)
 *
 * Deliberately NOT tested: exact category names, exact item names, exact
 * prices. The MENU data is expected to change as Hjem confirms real
 * items — pinning specific strings here would force test churn for every
 * copy edit. The shape and the disclaimer are what we lock in.
 */

import { render, screen } from "@testing-library/react";
import Menu from "@/components/sections/Menu";

describe("Menu", () => {
  it("renders inside a section with id='menu' (Navbar anchor target)", () => {
    const { container } = render(<Menu />);
    const section = container.querySelector("section#menu");
    expect(section).not.toBeNull();
  });

  it("has exactly one h2 — the section heading", () => {
    render(<Menu />);
    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s).toHaveLength(1);
  });

  it("renders at least three category subheadings (h3) for screen-reader nav", () => {
    render(<Menu />);
    const h3s = screen.getAllByRole("heading", { level: 3 });
    expect(h3s.length).toBeGreaterThanOrEqual(3);
  });

  it("renders more than a token number of menu items", () => {
    const { container } = render(<Menu />);
    // Items are <dt> elements (term in a <dl> description list).
    // Threshold of 6 keeps the test loose to copy edits while still
    // catching "menu accidentally rendered empty" regressions.
    const items = container.querySelectorAll("dt");
    expect(items.length).toBeGreaterThanOrEqual(6);
  });

  it("renders the indicative-prices disclaimer", () => {
    render(<Menu />);
    // "indicative" is the load-bearing word — anything weaker (e.g.
    // "approximate") wouldn't carry the same hedge for a demo build.
    expect(screen.getByText(/indicative/i)).toBeInTheDocument();
  });
});

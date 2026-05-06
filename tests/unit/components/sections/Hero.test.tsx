/**
 * WHAT: Tests for the Hero — the top-of-homepage section. A full-bleed
 *       editorial photo with "Velkommen" wordmark, subhead, and Visit CTA
 *       overlaid.
 * WHY:  Hero carries the homepage's only h1 (SEO + a11y depend on the
 *       single-h1-per-page rule), the load-bearing "what is this place"
 *       sentence, and the primary CTA. A silent regression on any of those
 *       degrades the demo without breaking the build.
 * IF REMOVED: nothing else asserts the page heading level, the CTA target,
 *             or that the image carries an alt attribute. Step 20's smoke
 *             tests walk the rendered page but don't pin link hrefs.
 *
 * Test scope:
 *   - h1 with "Velkommen" (page-level heading)
 *   - subhead anchors what Hjem is ("Danish bakery")
 *   - CTA "Visit us" links to #visit (matches Navbar's Visit anchor)
 *   - hero image has descriptive non-empty alt text
 */

import { render, screen } from "@testing-library/react";
import Hero from "@/components/sections/Hero";

describe("Hero", () => {
  it("renders the page heading 'Velkommen' as an h1", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1, name: /velkommen/i }),
    ).toBeInTheDocument();
  });

  it("renders a subhead anchoring what Hjem is (Danish bakery)", () => {
    render(<Hero />);
    // "Danish bakery" is the load-bearing claim — anything less specific
    // would suggest copy was lost in a refactor.
    expect(screen.getByText(/danish bakery/i)).toBeInTheDocument();
  });

  it("CTA link points at the Visit section anchor", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: /visit us/i });
    expect(cta).toHaveAttribute("href", "#visit");
  });

  it("hero image has a descriptive non-empty alt attribute", () => {
    render(<Hero />);
    const img = screen.getByRole("img");
    const alt = img.getAttribute("alt") ?? "";
    // Alt should be a sentence-ish description, not a placeholder word.
    // Anything under ~15 chars is almost certainly "hero" or "image".
    expect(alt.length).toBeGreaterThan(15);
  });
});

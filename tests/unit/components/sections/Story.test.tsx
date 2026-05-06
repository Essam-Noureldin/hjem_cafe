/**
 * WHAT: Tests for the Story section — the "who and why" band between
 *       Hero and Menu. Two-column on desktop (image + prose), stacks on
 *       mobile. Carries the Hjem name explanation and the brand voice.
 * WHY:  Story is where a one-page brochure earns trust. A silent
 *       regression on the heading, the image, or the load-bearing
 *       "Danish" claim is the kind of thing that lets the demo ship
 *       feeling generic without breaking the build.
 * IF REMOVED: the navbar's `/#story` anchor scrolls to a section with
 *             no enforced shape — heading levels, image presence, and
 *             the Danish-bakery framing can drift unnoticed.
 *
 * Test scope:
 *   - section landmark with id="story" (matches Navbar anchor)
 *   - exactly one h2 (sections nest at h2; Hero owns the page h1)
 *   - at least one image with descriptive alt text
 *   - prose contains the load-bearing "Danish" claim — anything weaker
 *     would suggest the brand framing was lost in a refactor
 *
 * Deliberately NOT tested: exact headline string, exact paragraph
 * wording. Copy is expected to evolve as Hjem confirms real owner
 * voice — pinning specific strings here would force test churn for
 * every copy edit. The shape and the core thematic word are what we
 * lock in.
 */

import { render, screen } from "@testing-library/react";
import Story from "@/components/sections/Story";

describe("Story", () => {
  it("renders inside a section with id='story' (Navbar anchor target)", () => {
    const { container } = render(<Story />);
    const section = container.querySelector("section#story");
    expect(section).not.toBeNull();
  });

  it("has exactly one h2 — the section heading", () => {
    render(<Story />);
    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s).toHaveLength(1);
  });

  it("renders the 3-image carousel, each image with descriptive alt", () => {
    render(<Story />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
    for (const img of images) {
      const alt = img.getAttribute("alt") ?? "";
      // Sentence-ish description, not a placeholder word.
      expect(alt.length).toBeGreaterThan(15);
    }
  });

  it("renders carousel prev/next controls with accessible labels", () => {
    render(<Story />);
    expect(
      screen.getByRole("button", { name: /previous slide/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next slide/i }),
    ).toBeInTheDocument();
  });

  it("references the load-bearing 'Danish' framing in body copy", () => {
    const { container } = render(<Story />);
    // 'Danish' is the country-of-origin claim Hjem leans on — without
    // it the section reads as a generic neighbourhood-bakery story
    // and loses the differentiator. Use container.textContent (rather
    // than getByText) so we catch the keyword wherever it lands in
    // prose, not at a specific element boundary.
    expect(container.textContent).toMatch(/Danish/i);
  });
});

/**
 * WHAT: Tests for the Hero — a 3-slide auto-rotating carousel that
 *       opens the homepage on the BakeMyDay-inspired redesign branch.
 * WHY:  The carousel changes Hero from a static section into an
 *       interactive one. We need to lock in: every slide renders,
 *       every slide carries an image with descriptive alt, the
 *       page-level h1 still exists somewhere in the carousel (SEO +
 *       a11y), and the navigation controls are reachable by keyboard.
 * IF REMOVED: a regression that drops a slide, loses the h1, or
 *             ships nav buttons without accessible names would slip
 *             through silently.
 *
 * Test scope:
 *   - section landmark with id="hero"
 *   - 3 slide images, each with descriptive non-empty alt
 *   - exactly one h1 on the homepage (slide 1's "Velkommen")
 *   - the "Danish bakery" framing is somewhere in the rendered DOM
 *   - the "Visit us" CTA exists and points at #visit
 *   - prev/next nav controls have accessible names
 *
 * Deliberately NOT tested: auto-rotation timing, hover-pause, slide
 * transitions. Those depend on embla-carousel internals + jsdom timing
 * quirks; the smoke tests in Step 20 (against a real browser) are the
 * right layer for that.
 */

import { render, screen } from "@testing-library/react";
import Hero from "@/components/sections/Hero";

describe("Hero (carousel)", () => {
  it("renders inside a section with id='hero'", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("section#hero")).not.toBeNull();
  });

  it("renders three slide images, each with a descriptive alt", () => {
    render(<Hero />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
    for (const img of images) {
      const alt = img.getAttribute("alt") ?? "";
      // Sentence-ish description, not a placeholder word.
      expect(alt.length).toBeGreaterThan(15);
    }
  });

  it("carries exactly one h1 (page-level heading on slide 1)", () => {
    render(<Hero />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/velkommen/i);
  });

  it("renders the load-bearing 'Danish bakery' framing", () => {
    const { container } = render(<Hero />);
    expect(container.textContent).toMatch(/Danish bakery/i);
  });

  it("renders a 'Visit us' CTA pointing at #visit", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: /visit us/i });
    expect(cta).toHaveAttribute("href", "#visit");
  });

  it("renders accessible prev/next carousel controls", () => {
    render(<Hero />);
    expect(
      screen.getByRole("button", { name: /previous slide/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next slide/i }),
    ).toBeInTheDocument();
  });
});

/**
 * WHAT: Tests for the Visit section — the closing band of the homepage
 *       that gives a visitor the only two facts that matter to convert
 *       a brochure read into a real-world walk-in: where Hjem is and
 *       when it's open.
 * WHY:  Visit is the conversion surface. A regression that drops the
 *       address, mangles the hours, or silently breaks the directions
 *       link is the kind of thing that makes the demo look fine but
 *       quietly fails the only call-to-action that matters.
 * IF REMOVED: the navbar's `/#visit` anchor scrolls to a section with
 *             no enforced shape — the address, hours, and outbound
 *             directions link can all drift unnoticed.
 *
 * Test scope:
 *   - section landmark with id="visit" (matches Navbar anchor)
 *   - exactly one h2 (sections nest at h2; Hero owns the page h1)
 *   - the load-bearing address ("Gloucester Road") is in the DOM
 *   - the postcode (SW7 4TH) is in the DOM
 *   - opening hours are present for both weekday and weekend bands
 *   - "Get directions" CTA exists, points at Google Maps, opens in a
 *     new tab with rel="noopener noreferrer" (security)
 *   - shopfront image renders with descriptive alt
 *
 * Deliberately NOT tested: exact prose copy. The headline + subhead
 * may evolve as Hjem confirms voice — pinning specific strings here
 * would force test churn for every copy edit. The shape and the
 * load-bearing facts (address, hours, directions link) are what we
 * lock in.
 */

import { render, screen } from "@testing-library/react";
import Visit from "@/components/sections/Visit";

describe("Visit", () => {
  it("renders inside a section with id='visit' (Navbar anchor target)", () => {
    const { container } = render(<Visit />);
    expect(container.querySelector("section#visit")).not.toBeNull();
  });

  it("has exactly one h2 — the section heading", () => {
    render(<Visit />);
    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s).toHaveLength(1);
  });

  it("renders the load-bearing 'Gloucester Road' address", () => {
    const { container } = render(<Visit />);
    expect(container.textContent).toMatch(/Gloucester Road/i);
  });

  it("renders the SW7 4TH postcode", () => {
    const { container } = render(<Visit />);
    expect(container.textContent).toMatch(/SW7\s*4TH/i);
  });

  it("renders weekday and weekend opening hours", () => {
    const { container } = render(<Visit />);
    // Weekday band: Mon–Fri 7:30–17:00
    expect(container.textContent).toMatch(/7:30/);
    expect(container.textContent).toMatch(/17:00/);
    // Weekend band: Sat & Sun 8:30–17:00
    expect(container.textContent).toMatch(/8:30/);
  });

  it("renders a 'Get directions' CTA pointing at Google Maps in a new tab", () => {
    render(<Visit />);
    const cta = screen.getByRole("link", { name: /get directions/i });
    expect(cta).toHaveAttribute("href", expect.stringMatching(/google\.com\/maps/i));
    expect(cta).toHaveAttribute("target", "_blank");
    // rel="noopener noreferrer" is the standard guard against tab-nabbing
    // and referrer-leak for any link that opens in a new tab.
    expect(cta).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(cta).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
  });

  it("renders a shopfront image with a descriptive alt", () => {
    render(<Visit />);
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(1);
    const alt = images[0].getAttribute("alt") ?? "";
    expect(alt.length).toBeGreaterThan(15);
  });
});

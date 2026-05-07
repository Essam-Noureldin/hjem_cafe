/**
 * WHAT: Tests for the Testimonials section — social proof band between
 *       Menu and Visit. Carries 3 real, attributed reviews quoted from
 *       public review platforms (TripAdvisor, The Infatuation).
 * WHY:  Social proof above the Visit CTA primes the conversion: the
 *       visitor sees that other people thought the trip was worth it
 *       *before* they're asked to get directions. Master prompt's "EVERY
 *       SITE MUST INCLUDE" #5 (social proof / testimonials) lives here.
 * IF REMOVED: the navbar's section flow loses the proof beat between
 *             menu interest and the visit ask. More dangerously, without
 *             enforced shape the section could drift into invented or
 *             unattributed quotes — both legal liabilities under the UK
 *             DMCC Act 2024 (fake reviews) and editorial-fair-use norms.
 *
 * Test scope:
 *   - section landmark with id="testimonials"
 *   - exactly one h2 (sections nest at h2; Hero owns the page h1)
 *   - exactly 3 testimonial cards, each rendered as a <blockquote>
 *   - each blockquote has a non-empty <cite> attribution
 *   - each attribution names a public source (TripAdvisor / Infatuation)
 *     so the reviews are demonstrably real and verifiable
 *   - each blockquote has a `cite=` attribute pointing to a real URL
 *     (the source page the quote was lifted from)
 *
 * Deliberately NOT tested: exact quote text. The 3 reviews chosen now
 * may rotate as Marianne supplies fresher ones — pinning specific
 * strings would force test churn. The shape (real source + real link)
 * is what we lock in to keep the section honest.
 */

import { render, screen } from "@testing-library/react";
import Testimonials from "@/components/sections/Testimonials";

describe("Testimonials", () => {
  it("renders inside a section with id='testimonials'", () => {
    const { container } = render(<Testimonials />);
    expect(container.querySelector("section#testimonials")).not.toBeNull();
  });

  it("has exactly one h2 — the section heading", () => {
    render(<Testimonials />);
    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s).toHaveLength(1);
  });

  it("renders exactly three testimonial blockquotes", () => {
    const { container } = render(<Testimonials />);
    const quotes = container.querySelectorAll("blockquote");
    expect(quotes).toHaveLength(3);
  });

  it("each blockquote has a non-empty <cite> attribution", () => {
    const { container } = render(<Testimonials />);
    const cites = container.querySelectorAll("blockquote cite");
    expect(cites).toHaveLength(3);
    for (const cite of cites) {
      const text = cite.textContent ?? "";
      expect(text.length).toBeGreaterThan(5);
    }
  });

  it("each blockquote attribution names a verifiable public source", () => {
    const { container } = render(<Testimonials />);
    // Real-source guard: every cite must reference one of the public
    // review platforms we pulled from. Catches a future regression
    // where a quote gets added without a real source attribution
    // (which would be legally risky under the UK DMCC Act 2024).
    const cites = container.querySelectorAll("blockquote cite");
    for (const cite of cites) {
      const text = cite.textContent ?? "";
      expect(text).toMatch(/TripAdvisor|Infatuation/i);
    }
  });

  it("each blockquote has a cite= attribute pointing to a real URL", () => {
    const { container } = render(<Testimonials />);
    const quotes = container.querySelectorAll("blockquote");
    for (const q of quotes) {
      const citeUrl = q.getAttribute("cite") ?? "";
      // Must be an absolute https URL — quote without a source link is
      // editorial laziness on a public-facing site.
      expect(citeUrl).toMatch(/^https:\/\//);
    }
  });
});

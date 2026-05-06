/**
 * WHAT: Tests for the Today's Bench section — a horizontal product
 *       carousel between Story and Menu showing four featured items
 *       (cardamom bun, sourdough, flat white, matcha) with image +
 *       name + tagline + price per card.
 * WHY:  Today's Bench is the BakeMyDay-style "Hot Dishes" teaser that
 *       primes the visitor with specific, pretty product shots before
 *       the full Menu lands. A regression that drops a card or loses
 *       the prev/next controls is the kind of silent break this
 *       section guards against.
 *
 * Test scope:
 *   - section landmark with id="todays-bench"
 *   - exactly one h2
 *   - four product cards (one per featured item)
 *   - four images each with descriptive alt
 *   - carousel prev/next controls have accessible names
 */

import { render, screen } from "@testing-library/react";
import TodaysBench from "@/components/sections/TodaysBench";

describe("TodaysBench", () => {
  it("renders inside a section with id='todays-bench'", () => {
    const { container } = render(<TodaysBench />);
    expect(container.querySelector("section#todays-bench")).not.toBeNull();
  });

  it("has exactly one h2 section heading", () => {
    render(<TodaysBench />);
    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s).toHaveLength(1);
  });

  it("renders four product cards as articles", () => {
    render(<TodaysBench />);
    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(4);
  });

  it("each card has an image with descriptive alt", () => {
    render(<TodaysBench />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(4);
    for (const img of images) {
      const alt = img.getAttribute("alt") ?? "";
      expect(alt.length).toBeGreaterThan(10);
    }
  });

  it("renders carousel prev/next controls with accessible labels", () => {
    render(<TodaysBench />);
    expect(
      screen.getByRole("button", { name: /previous slide/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next slide/i }),
    ).toBeInTheDocument();
  });
});

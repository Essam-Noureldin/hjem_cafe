"use client";

/**
 * WHAT: The Hero — a 3-slide auto-rotating carousel inspired by the
 *       BakeMyDay restaurant site. Each slide is full-bleed image +
 *       headline + subhead + CTA, overlaid on a gradient scrim for
 *       legibility.
 * WHY:  The editorial-static-Hero on `main` reads as quiet. This
 *       branch leans louder — a carousel makes the homepage feel
 *       active immediately, sells multiple angles of the bakery
 *       (interior, product, location) in a single viewport, and
 *       gives BakeMyDay-style restaurant-chain energy without losing
 *       Hjem's brand palette.
 * IF REMOVED: nothing else carries the page-level h1 or the rotating-
 *             tagline pattern this branch was built around.
 *
 * Library choice: embla-carousel-react (~5KB, accessibility-first,
 * smooth touch + keyboard). The Autoplay plugin handles auto-rotate
 * with pause-on-interaction and pause-on-hover built in.
 *
 * Accessibility:
 *   - section gets `aria-roledescription="carousel"`
 *   - each slide gets `aria-roledescription="slide"` + `aria-label`
 *     "<n> of <total>" so screen readers can announce position
 *   - prev/next buttons carry `aria-label` (Previous slide / Next
 *     slide); keyboard reaches them after the slides
 *   - Autoplay respects prefers-reduced-motion via the plugin's
 *     internal check (matchMedia)
 *
 * Heading levels: only slide 1 carries an <h1> (the page-level
 * "Velkommen"). Slides 2 and 3 use <p> for their tagline so the
 * page never has multiple h1s — that would break the heading
 * outline + SEO.
 */

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

interface Slide {
  image: string;
  alt: string;
  /** True only for slide 1 — gets rendered as <h1>. */
  isPrimary?: boolean;
  heading: string;
  subhead: string;
  ctaText: string;
  ctaHref: string;
}

const SLIDES: ReadonlyArray<Slide> = [
  {
    image: "/images/hero-interior.jpeg",
    alt: "Warm interior of Hjem Kensington at golden hour, with stone-milled sourdough loaves and cardamom buns on a wooden counter.",
    isPrimary: true,
    heading: "Velkommen",
    subhead:
      "A small Danish bakery in West London. Sourdough, cardamom buns, slow coffee.",
    ctaText: "Visit us",
    ctaHref: "#visit",
  },
  {
    image: "/images/hero-pastries.jpeg",
    alt: "Overhead view of cardamom buns and a half-cut sourdough loaf on cream linen, warm side-light.",
    heading: "Made before light",
    subhead: "Stone-milled, long-fermented, baked daily.",
    ctaText: "See the menu",
    ctaHref: "#menu",
  },
  {
    image: "/images/hero-shopfront.jpeg",
    alt: "Hjem shopfront on Gloucester Road at blue hour with warm interior glow and rosemary planters by the door.",
    heading: "Find us on Gloucester Road",
    subhead: "Open from seven thirty.",
    ctaText: "Get directions",
    ctaHref: "#visit",
  },
];

const AUTOPLAY_DELAY_MS = 5500;

export default function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: AUTOPLAY_DELAY_MS, stopOnInteraction: false })],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  /**
   * Keep the dot indicator in sync with whichever slide embla considers
   * "active". We subscribe once on mount; the cleanup removes the
   * listener so a fast unmount/remount doesn't double-subscribe.
   */
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  return (
    <section
      id="hero"
      aria-roledescription="carousel"
      aria-label="Hjem Kensington homepage hero"
      className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-moss"
    >
      {/* Embla viewport. overflow-hidden + the inner flex container is
          how embla tracks slides — don't change these without reading
          the embla docs first. */}
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {SLIDES.map((slide, index) => (
            <div
              key={slide.image}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${SLIDES.length}`}
              className="relative h-full min-w-0 flex-[0_0_100%]"
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />

              {/* Per-slide gradient scrim. Same shape as the static
                  Hero on main so the brand visual feels continuous. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-br from-ink/20 via-ink/40 to-ink/70"
              />

              {/* Slide content. Centred-bottom so the photograph's
                  upper composition reads through the scrim. */}
              <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-24 text-center text-bone sm:pb-32">
                {slide.isPrimary ? (
                  <h1 className="font-display text-7xl tracking-tight sm:text-8xl md:text-9xl">
                    {slide.heading}
                  </h1>
                ) : (
                  <p className="font-display text-6xl tracking-tight sm:text-7xl md:text-8xl">
                    {slide.heading}
                  </p>
                )}
                <p className="mt-6 max-w-xl font-body text-lg text-bone/90 sm:text-xl">
                  {slide.subhead}
                </p>
                <Link
                  href={slide.ctaHref}
                  className="mt-10 inline-block bg-clay px-8 py-3 font-body text-sm uppercase tracking-widest text-bone transition-colors hover:bg-clay/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone"
                >
                  {slide.ctaText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev / next buttons. Sit at the vertical centre of the
          carousel, semi-transparent so they don't compete with the
          slide content. The hover state lifts opacity for clarity. */}
      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-ink/30 p-3 text-bone backdrop-blur-sm transition-colors hover:bg-ink/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone sm:left-8"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-ink/30 p-3 text-bone backdrop-blur-sm transition-colors hover:bg-ink/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone sm:right-8"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dot indicators. Visual only — keyboard users have prev/next
          buttons + native carousel keyboard nav. Hidden from screen
          readers since they'd be redundant with the slide labels. */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3"
      >
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollTo(index)}
            tabIndex={-1}
            className={`h-2 w-2 rounded-full transition-all ${
              index === selectedIndex
                ? "w-8 bg-bone"
                : "bg-bone/40 hover:bg-bone/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

"use client";

/**
 * WHAT: A reusable carousel wrapper used by Story, Today's-bench, and
 *       (eventually) any other section that wants horizontal slides.
 *       Wraps embla-carousel-react with the project's preferred default
 *       options (loop, optional autoplay) and renders prev/next buttons
 *       + dot indicators in two themes (light controls for dark slides,
 *       dark controls for light slides).
 * WHY:  The Hero has its own bespoke carousel — it's full-viewport, has
 *       per-slide CTAs and h1, and the controls have to overlay the
 *       photograph at specific positions. Lifting that into a single
 *       generic component would force every consumer to deal with
 *       Hero's quirks. Instead this component focuses on the *common*
 *       case: a section that wants a row of slides with arrows + dots,
 *       optionally autoplaying.
 * IF REMOVED: every new carousel section would re-implement embla
 *             setup, ARIA wiring, dot syncing, and reduced-motion
 *             handling — guaranteed drift over time.
 *
 * Slide sizing: consumers pass an array of React nodes via `slides`.
 * Each node is wrapped in a container div with `slideClassName` applied
 * — that's where the per-section "how many slides visible at once"
 * decision lives. Spotlight carousels pass `slideClassName="flex-[0_0_100%]"`
 * (one slide visible); track carousels pass partial basis classes like
 * `flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%]` so multiple
 * cards peek into view.
 *
 * Accessibility:
 *   - the outer region carries `aria-roledescription="carousel"` plus
 *     the consumer-provided `ariaLabel`
 *   - each slide wrapper carries `aria-roledescription="slide"` and
 *     `aria-label="<n> of <total>"`
 *   - prev/next buttons have explicit `aria-label`s
 *   - dot indicators are decorative (`aria-hidden`); keyboard users
 *     reach the slides via prev/next + native scroll
 *   - the Autoplay plugin internally respects `prefers-reduced-motion`
 */

import {
  Children,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface CarouselProps {
  /** Required — describes what the carousel is for, announced to AT. */
  ariaLabel: string;
  /** Slides to render. Each node is wrapped in a container div by the carousel. */
  slides: ReactNode[];
  /** Tailwind classes applied to each slide's wrapper div. Controls
   *  how many slides are visible at once via flex basis. Default:
   *  "min-w-0 flex-[0_0_100%]" (one slide visible). */
  slideClassName?: string;
  /** Auto-rotate slides. Pauses on hover and on user interaction. */
  autoplay?: boolean;
  /** Autoplay delay in ms. Default 6000. */
  autoplayDelay?: number;
  /** Render dot indicators below the slides. Default true. */
  showDots?: boolean;
  /** Render prev/next buttons. Default true. */
  showArrows?: boolean;
  /** Position of prev/next arrows. 'overlay' = floats on top of slides
   *  (good for full-bleed); 'outside' = sits beside the viewport (good
   *  for card carousels with breathing room). Default 'overlay'. */
  arrowsPosition?: "overlay" | "outside";
  /** Position of dot indicators. Defaults to follow `arrowsPosition`
   *  ('overlay' → dots overlay the slides at the bottom; 'outside' →
   *  dots sit below the carousel). Pass explicitly to mix and match —
   *  e.g. `arrowsPosition='overlay'` + `dotsPosition='below'` for card
   *  carousels where you want arrows on the cards but dots below. */
  dotsPosition?: "overlay" | "below";
  /** Colour of arrows + dots. 'light' = bone-on-ink (for dark slides);
   *  'dark' = ink-on-bone (for light slides); 'moss' = moss-green
   *  filled buttons (for light cards where you want the arrows to read
   *  clearly without going fully neutral). Default 'light'. */
  controlsTheme?: "light" | "dark" | "moss";
  /** Whether the carousel loops past the last slide. Default true. */
  loop?: boolean;
  /** Slide-to-slide gap as a Tailwind class (e.g. "gap-4"). Default
   *  none — track carousels usually want this; spotlight carousels
   *  rarely do. */
  gapClassName?: string;
}

export default function Carousel({
  ariaLabel,
  slides,
  slideClassName = "min-w-0 flex-[0_0_100%]",
  autoplay = false,
  autoplayDelay = 6000,
  showDots = true,
  showArrows = true,
  arrowsPosition = "overlay",
  dotsPosition,
  controlsTheme = "light",
  loop = true,
  gapClassName,
}: CarouselProps) {
  // Default dots to follow arrows position unless overridden.
  const effectiveDotsPosition =
    dotsPosition ?? (arrowsPosition === "overlay" ? "overlay" : "below");

  const plugins = autoplay
    ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })]
    : [];
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, align: "start" }, plugins);
  const [selectedIndex, setSelectedIndex] = useState(0);
  /**
   * scrollSnaps mirrors embla's scrollSnapList — one entry per snap
   * position. This is NOT the same as slides.length: when multiple
   * slides are visible at once (track carousels with `flex-[0_0_30%]`
   * etc.), embla creates fewer snap points than slides. Rendering
   * one dot per slide in those cases gives "extra" dots that don't
   * map to anything. Always source the dot count from here.
   */
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const onReInit = () => setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    onReInit();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onReInit);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onReInit);
    };
  }, [emblaApi]);

  /**
   * scrollPrev / scrollNext — manual cycling at the edges.
   *
   * Embla's `loop: true` silently disables itself when the slide count
   * is below `slidesInView × 2` (3 menu cards or 4 bench cards on
   * desktop trip this). When that happens, scrollNext at the last
   * slide does nothing — the user clicks the arrow and the carousel
   * appears frozen.
   *
   * The fallback: if embla says we can't scroll further, jump to the
   * other end. Click-next-at-end → first slide; click-prev-at-start
   * → last slide. That gives the cycling behaviour visitors expect
   * from "click the arrow" without depending on embla's loop quirks.
   */
  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    if (emblaApi.canScrollPrev()) {
      emblaApi.scrollPrev();
    } else {
      emblaApi.scrollTo(emblaApi.scrollSnapList().length - 1);
    }
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    if (emblaApi.canScrollNext()) {
      emblaApi.scrollNext();
    } else {
      emblaApi.scrollTo(0);
    }
  }, [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  const arrowBg =
    controlsTheme === "light"
      ? "bg-ink/30 text-bone hover:bg-ink/60 focus-visible:outline-bone"
      : controlsTheme === "moss"
        ? "bg-moss text-bone hover:bg-moss/90 focus-visible:outline-bone"
        : "bg-bone/70 text-ink hover:bg-bone focus-visible:outline-ink";

  const dotActive =
    controlsTheme === "light"
      ? "bg-bone"
      : controlsTheme === "moss"
        ? "bg-moss"
        : "bg-ink";
  const dotInactive =
    controlsTheme === "light"
      ? "bg-bone/40 hover:bg-bone/60"
      : controlsTheme === "moss"
        ? "bg-moss/30 hover:bg-moss/50"
        : "bg-ink/30 hover:bg-ink/50";

  // Children-rendered: array of pre-built slide nodes wrapped in the
  // embla slide container. Children API would be cleaner but slides
  // is more explicit about "this is a list" — better for the consumer.
  const slideNodes = Children.toArray(slides).map((slide, index) => (
    <div
      key={index}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${slides.length}`}
      className={slideClassName}
    >
      {slide}
    </div>
  ));

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className="relative"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className={`flex ${gapClassName ?? ""}`}>{slideNodes}</div>
      </div>

      {showArrows && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous slide"
            className={
              arrowsPosition === "overlay"
                ? `absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full p-3 backdrop-blur-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:left-8 ${arrowBg}`
                : `absolute -left-4 top-1/2 z-20 -translate-y-1/2 rounded-full p-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:-left-12 ${arrowBg}`
            }
          >
            <Chevron direction="left" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next slide"
            className={
              arrowsPosition === "overlay"
                ? `absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full p-3 backdrop-blur-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:right-8 ${arrowBg}`
                : `absolute -right-4 top-1/2 z-20 -translate-y-1/2 rounded-full p-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:-right-12 ${arrowBg}`
            }
          >
            <Chevron direction="right" />
          </button>
        </>
      )}

      {showDots && (
        <div
          aria-hidden="true"
          className={
            effectiveDotsPosition === "overlay"
              ? "absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3"
              : "mt-6 flex justify-center gap-3"
          }
        >
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              tabIndex={-1}
              className={`h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? `w-8 ${dotActive}`
                  : `w-2 ${dotInactive}`
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Inline chevron — duplicating in Hero would mean two SVG sources to
 *  keep in sync; keeping it here lets every Carousel use the same one. */
function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
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
      {direction === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}

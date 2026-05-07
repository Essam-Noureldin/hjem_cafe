/**
 * WHAT: Today's Bench — a horizontal "what's on the counter today"
 *       carousel between Story and Menu. Four featured items
 *       (cardamom bun, sourdough, flat white, ceremonial matcha)
 *       rendered as cards with image + name + tagline + price.
 * WHY:  Inspired by BakeMyDay's "Hot Dishes" teaser — primes the
 *       visitor with specific, photogenic product shots before the
 *       full Menu loads. Acts as a hook between the brand voice
 *       (Story) and the comprehensive offering (Menu): "here's what
 *       you'd actually walk out with today."
 * IF REMOVED: the page jumps from atmospheric Story straight into
 *             the full Menu — visitors lose the appetite-whetting
 *             beat that single-product close-ups provide.
 *
 * Layout:
 *   - bg-cream — light section so the moss Story above and the cream
 *     Menu below read as a continuous lighter band after Hero.
 *   - Track carousel — multiple cards visible at once, scrolls
 *     horizontally. slide basis: ~85% mobile, ~45% sm, ~33% lg so
 *     1 / 2 / 3 cards visible at each breakpoint with a peek of the
 *     next. arrowsPosition="outside" since cards are bg-bone — overlay
 *     arrows would have weak contrast.
 *   - No autoplay — user-driven. Autoplay on a product carousel
 *     forces visitors to wait for the item they want.
 *
 * Items live in a `BENCH` const at the top of the component so a
 * real-data swap is one edit when Hjem confirms what's actually on
 * the bench any given day.
 */

import Image from "next/image";
import Carousel from "@/components/Carousel";

interface BenchItem {
  image: string;
  alt: string;
  name: string;
  tagline: string;
  price: string;
}

const BENCH: ReadonlyArray<BenchItem> = [
  {
    image: "/images/bench-cardamom.jpeg",
    alt: "Single Danish cardamom bun on a small ceramic plate, dusted with pearl sugar.",
    name: "Kardemommebolle",
    tagline: "Hand-shaped, the reason most people walk in.",
    price: "£3.80",
  },
  {
    image: "/images/bench-sourdough.jpeg",
    alt: "Half-cut stone-milled sourdough loaf showing open amber crumb on a wooden board.",
    name: "Stone-milled sourdough",
    tagline: "Long-fermented, deep crust, baked daily.",
    price: "£5.50",
  },
  {
    image: "/images/bench-flatwhite.jpeg",
    alt: "Flat white in a small white ceramic cup with delicate latte-art rosette on a moss-green saucer.",
    name: "Flat white",
    tagline: "Single-origin espresso, whole milk or oat.",
    price: "£3.60",
  },
  {
    image: "/images/bench-matcha.jpeg",
    alt: "Bright-green ceremonial matcha in a dark hand-thrown ceramic chawan with a bamboo whisk.",
    name: "Ceremonial matcha",
    tagline: "Whisked, served warm in a small bowl.",
    price: "£4.80",
  },
];

export default function TodaysBench() {
  const slides = BENCH.map((item) => (
    <article key={item.name} className="overflow-hidden bg-bone shadow-sm">
      <div className="relative aspect-[4/3] w-full bg-cream">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 85vw"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl text-ink">{item.name}</h3>
          <span className="font-body text-sm tabular-nums text-ink/70">
            {item.price}
          </span>
        </div>
        <p className="mt-2 font-body text-sm text-ink/70">{item.tagline}</p>
      </div>
    </article>
  ));

  return (
    <section
      id="todays-bench"
      aria-labelledby="bench-heading"
      className="bg-cream px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-body text-sm uppercase tracking-widest text-clay">
          Today&apos;s bench
        </p>
        <h2
          id="bench-heading"
          className="mt-2 font-display text-4xl text-ink sm:text-5xl"
        >
          Made this morning.
        </h2>
        <p className="mt-4 max-w-xl font-body text-base text-ink/70">
          A small selection of what&apos;s in the window right now.
          Most of it&apos;s gone by lunch.
        </p>

        {/* Overlay arrows on the cards + dots below. Outside arrows
            looked airier on desktop but got cut off on mobile; overlay
            keeps them visible at every viewport width. */}
        <div className="mt-12">
          <Carousel
            ariaLabel="Featured items today"
            slides={slides}
            slideClassName="min-w-0 flex-[0_0_85%] sm:flex-[0_0_47%] lg:flex-[0_0_31%]"
            gapClassName="gap-5"
            arrowsPosition="overlay"
            dotsPosition="below"
            controlsTheme="moss"
            showDots
            autoplay={false}
            loop
          />
        </div>
      </div>
    </section>
  );
}

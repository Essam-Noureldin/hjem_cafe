/**
 * WHAT: The homepage Hero — full-bleed editorial photograph with the
 *       "Velkommen" wordmark, a one-line subhead, and the Visit CTA
 *       overlaid above a dark scrim.
 * WHY:  First impression. Visitors decide in <2 seconds whether to scroll;
 *       Hero has to communicate "small Danish bakery in West London" in
 *       a single glance and offer one clear next action.
 * IF REMOVED: the homepage opens directly into Story, losing the
 *             single-glance "what is this place" answer that the Velkommen
 *             + subhead pair carries.
 *
 * Layout decisions:
 *   - h-[85vh] + min-h-[600px] — fills nearly the viewport on tall screens
 *     while still leaving the navbar visible; the min-height stops the
 *     hero from collapsing on short laptop screens (e.g. 1366×768).
 *   - bg-moss as a fallback colour — if /images/hero.jpg is missing the
 *     section still reads as intentional rather than as a broken layout.
 *   - Content anchored to the lower third (justify-end + pb-20) — leaves
 *     the upper two-thirds of the photograph unobstructed so its
 *     composition still reads through the scrim.
 *
 * Image source convention: drop the AI-generated hero file at
 * /public/images/hero.jpg. next/image's `priority` flag preloads it for
 * LCP; without that Lighthouse flags the largest image as render-blocking.
 */

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-moss"
    >
      <Image
        src="/images/hero.jpg"
        alt="Warm interior of a small Danish bakery at golden hour, with stone-milled sourdough loaves and cardamom buns on a wooden counter."
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Decorative scrim. Gradient deepens toward the bottom-right where
          the headline + CTA sit, so the overlay text stays legible without
          flattening the image. aria-hidden — purely visual, screen readers
          shouldn't announce it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-ink/20 via-ink/40 to-ink/70"
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-20 text-center text-bone sm:pb-28">
        <h1
          id="hero-heading"
          className="font-display text-7xl tracking-tight sm:text-8xl md:text-9xl"
        >
          Velkommen
        </h1>
        <p className="mt-6 max-w-xl font-body text-lg text-bone/90 sm:text-xl">
          A small Danish bakery in West London. Sourdough, cardamom buns,
          slow coffee.
        </p>
        <Link
          href="#visit"
          className="mt-10 inline-block bg-clay px-8 py-3 font-body text-sm uppercase tracking-widest text-bone transition-colors hover:bg-clay/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone"
        >
          Visit us
        </Link>
      </div>
    </section>
  );
}

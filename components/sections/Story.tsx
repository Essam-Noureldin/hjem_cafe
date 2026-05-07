/**
 * WHAT: The Story section — moss-green band between Hero and Menu on
 *       the BakeMyDay-inspired redesign branch. Two-column layout:
 *       a 3-slide image carousel on the left (atmosphere / craft /
 *       still-life), prose on the right.
 * WHY:  The carousel adds a second pulse of movement on the page after
 *       the Hero — visitors who skip the Hero rotation still see Story
 *       cycling. It also lets the section show three angles of "what
 *       the bakery actually feels like" (predawn cooling, hands at
 *       work, tools on the bench) instead of one.
 * IF REMOVED: the homepage flow loses its narrative beat and the
 *             matcha/kimchi-alongside-Danish-staples brand voice has
 *             nowhere to live.
 *
 * Visual decisions:
 *   - bg-moss / text-bone band — same as the static Story on `main`,
 *     gives the page rhythm between Hero and Menu and bookends with
 *     the moss Footer.
 *   - 4:3 carousel slides — match the Story image aspect on `main` so
 *     the layout is recognisable even with new content.
 *   - Auto-rotation at 6.5s — slightly slower than Hero (5.5s) so
 *     they don't visibly tick in unison.
 *
 * Image fallback: each slide div carries `bg-moss/40` so a missing
 * file reads as a deliberate dark block against the section bg until
 * the file lands.
 *
 * Copy: as of Session 7 the prose names Marianne Brammer (Danish-born
 * founder, opened Hjem January 2018) and identifies Gloucester Road
 * as the second room (after the original Launceston Place site).
 * Resolves the open question from deviation 6.5 — earlier copy used
 * a generic "we" because the owner wasn't known. If Marianne ever
 * reviews this and wants different framing (different tone, different
 * level of personal attribution), the prose lives in this file in
 * three short paragraphs — quick to swap.
 */

import Image from "next/image";
import Carousel from "@/components/Carousel";

interface StorySlide {
  image: string;
  alt: string;
}

const STORY_SLIDES: ReadonlyArray<StorySlide> = [
  {
    image: "/images/story-1.jpeg",
    alt: "Predawn light over a wire cooling rack of freshly-baked sourdough loaves at the back of a small Danish bakery, before opening.",
  },
  {
    image: "/images/story-2.jpeg",
    alt: "Close-up of a baker's hands shaping pale-cream sourdough on a lightly floured wooden bench, sleeves rolled.",
  },
  {
    image: "/images/story-3.jpeg",
    alt: "Still-life of a brass kitchen scale dusted with flour, a folded linen cloth, a wooden spoon, and a bowl of cardamom pods on honed marble.",
  },
];

export default function Story() {
  const slides = STORY_SLIDES.map((slide) => (
    <div
      key={slide.image}
      className="relative aspect-[4/3] w-full overflow-hidden bg-moss/40"
    >
      <Image
        src={slide.image}
        alt={slide.alt}
        fill
        sizes="(min-width: 1024px) 36rem, 100vw"
        className="object-cover"
      />
    </div>
  ));

  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="bg-moss px-6 py-24 text-bone sm:py-32"
    >
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Carousel
          ariaLabel="Hjem story imagery"
          slides={slides}
          autoplay
          autoplayDelay={6500}
          showDots
          arrowsPosition="overlay"
          controlsTheme="moss"
        />

        <div>
          <p className="font-body text-sm uppercase tracking-widest text-clay">
            Story
          </p>
          <h2
            id="story-heading"
            className="mt-2 font-display text-4xl text-bone sm:text-5xl"
          >
            Hjem means home.
          </h2>

          <div className="mt-6 space-y-4 font-body text-base leading-relaxed text-bone/85">
            <p>
              <em>Hjem</em> means <em>home</em> in Danish. Marianne
              Brammer — Danish-born, London-based — opened Hjem in
              2018 because the city didn&apos;t have the kind of bakery
              she missed: a small room you could smell from the corner,
              a counter you knew the people behind.
            </p>
            <p>
              The shelves don&apos;t read like a textbook. Stone-milled
              sourdough sits next to house kimchi; cardamom buns share
              a counter with ceremonial matcha. Marianne&apos;s own
              cardamom bun is what most regulars come for first —
              long-fermented, hand-shaped, sugar-glazed before the
              doors open.
            </p>
            <p>
              Gloucester Road is the second room. Open from 7:30 most
              mornings, baking from before light, most of what we make
              gone by lunch. What&apos;s left we put in the window for
              the regulars who walk past on the way home from school.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

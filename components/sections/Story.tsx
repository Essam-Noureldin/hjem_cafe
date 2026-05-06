/**
 * WHAT: The Story section — the "who and why" band between Hero and
 *       Menu. Two-column on desktop (image left, prose right), stacks
 *       on mobile. Carries the Hjem name explanation and the brand
 *       voice in three short paragraphs.
 * WHY:  A one-page brochure earns trust on the Story section. Without
 *       it visitors see a logo, a hero, and a menu — they have no
 *       reason to believe the place has any character beyond what's
 *       on the shelves. Story is where the bakery answers "why am I
 *       here?" before it asks for a visit.
 * IF REMOVED: the homepage flows Hero → Menu → Visit with no narrative
 *             beat between hook and offering. Visitors who want to
 *             know what kind of bakery this is have nothing to read.
 *
 * Visual decisions:
 *   - bg-moss / text-bone — gives the page a darker rhythm band
 *     between the cream Hero-overlay-content and the cream Menu. Plays
 *     against the moss Footer below to bookend the page in green.
 *   - 4:3 image, side-by-side with prose on lg+ — feels editorial,
 *     not full-bleed (Hero already owns full-bleed). On mobile the
 *     image stacks above the prose at the same aspect ratio.
 *   - max-w-5xl on the container — keeps the prose column from
 *     stretching too wide (typographic best practice: ~65 char line
 *     length).
 *
 * Copy: three short paragraphs. Generic-but-grounded "we" framing —
 * no invented founder names. Acknowledges the unusual matcha/kimchi
 * mix as a feature ("doesn't read like a Danish textbook"). See
 * Session 6 deviation 6.5 in MASTER_PROMPT_DEVIATIONS.md for why this
 * tone was chosen for a speculative demo.
 *
 * Image fallback: the wrapping div carries `bg-moss/40` so a missing
 * image doesn't leave a stark hole — the placeholder reads as a
 * deliberate dark block against the moss section bg.
 */

import Image from "next/image";

export default function Story() {
  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="bg-moss px-6 py-24 text-bone sm:py-32"
    >
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Image. aspect-[4/3] reserves space while the source loads;
            bg-moss/40 fills the frame if the file is missing so the
            section still reads as intentional. */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-moss/40">
          <Image
            src="/images/story.jpeg"
            alt="Predawn light over a wire cooling rack of freshly-baked sourdough loaves at the back of a small Danish bakery, before opening."
            fill
            sizes="(min-width: 1024px) 36rem, 100vw"
            className="object-cover"
          />
        </div>

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

          {/* Three short paragraphs. text-bone/85 (slightly muted) for
              body — keeps the h2 dominant and avoids the "all-white-on-
              dark" wall-of-text feel. */}
          <div className="mt-6 space-y-4 font-body text-base leading-relaxed text-bone/85">
            <p>
              <em>Hjem</em> means <em>home</em> in Danish. We took the word
              because a bakery is the kind of place a neighbourhood gets
              to know first thing in the morning — what it smells like,
              what it sounds like, who&apos;s already on the bench at
              half-seven. We wanted to make one of those.
            </p>
            <p>
              The shelves don&apos;t read like a Danish textbook.
              Stone-milled sourdough sits next to house kimchi; cardamom
              buns share a counter with ceremonial matcha. What ties it
              together is the same idea — long fermentations, careful
              pulls, quiet mornings, a shorter list of things made well.
            </p>
            <p>
              We&apos;re one room on Gloucester Road, baking from before
              light. Most of what we make is gone by lunch. What&apos;s
              left we put in the window for the regulars who walk past on
              the way home from school.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

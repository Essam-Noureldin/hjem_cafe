/**
 * WHAT: The Testimonials section — social-proof band between Menu and
 *       Visit. Three real, attributed customer/critic quotes pulled
 *       verbatim from public review platforms (TripAdvisor and The
 *       Infatuation). Each card has a circular watercolour-illustrated
 *       avatar overhanging the top edge, a trust-signal row (5★ or
 *       "Critic's Pick"), the verbatim quote, and a full source
 *       attribution.
 * WHY:  Master prompt's "EVERY SITE MUST INCLUDE" #5 calls for social
 *       proof. Sitting it directly above Visit primes the conversion:
 *       the visitor sees that other people thought the trip was worth
 *       it *before* they're asked to get directions. Three different
 *       voices (a critic, a foodie tourist, a local family) cover
 *       different angles of trust without any one quote feeling
 *       cherry-picked.
 * IF REMOVED: the page jumps straight from menu interest to "come
 *             visit" with no proof beat — and a future contributor
 *             could fill the gap with invented or unattributed quotes,
 *             which is illegal under the UK DMCC Act 2024 (publishing
 *             fake reviews carries fines up to 10% of global turnover).
 *
 * ## Avatar approach (deviation 7.3, refined)
 *
 * The reference design Essam pointed at uses circular profile photos.
 * We deliberately do NOT lift real reviewer photos from TripAdvisor /
 * The Infatuation — UK GDPR Article 6 (no lawful basis), platform TOS
 * (scraping prohibited), and two of the three reviewers are anonymous
 * handles (Karen55115, Mrs Sarah G) without real faces published.
 *
 * We also do NOT use photorealistic stock or AI-generated faces under
 * the real reviewer names — putting a photo-realistic stranger under
 * "Karen55115" implies "this is what Karen looks like" and edges into
 * misleading endorsement (UK CAP/ASA + DMCC Act).
 *
 * What we DO use: **stylised watercolour-illustrated avatars** that
 * are clearly illustrated (visible paint texture, loose brushwork) —
 * nobody mistakes a watercolour portrait for the actual person, the
 * avatar reads as decorative, and the brand voice (warm Scandinavian
 * cafe) stays intact. The trust signal (★★★★★ / Critic's Pick) lives
 * just below the portrait so it isn't lost.
 *
 * ## Editorial / legal stance (carried over from deviation 7.2)
 *
 * Quotes are real reviews published on public review platforms under
 * each platform's user-content terms. Short excerpts + full attribution
 * (reviewer name + source platform + source URL + date) = standard
 * editorial fair use. We do NOT scrape Google reviews and we do NOT
 * generate "plausible-sounding" reviews.
 *
 * When Marianne (the Hjem owner — Marianne Brammer, founded Jan 2018)
 * confirms which reviews she's happy to feature, swap the TESTIMONIALS
 * array AND regenerate the matching avatars. The shape (quote / author
 * / source / sourceUrl / date / trustSignal / avatarSrc / avatarAlt) is
 * what's locked in by the test.
 *
 * ## Visual decisions
 *
 * - bg-bone band — between Menu (cream) and Visit (cream); a slightly
 *   cooler off-white gives the page a third tonal step.
 * - Centered headline + subhead — matches the visual rhythm of the
 *   reference Essam pointed at.
 * - Cards on bg-cream (warmer than the bone band) so they pop; border
 *   + shadow for definition.
 * - Circular avatar (96px, ring-bone) overhangs the top of each card.
 * - Trust-signal row (★★★★★ or "Critic's Pick") in clay between
 *   avatar and quote — small, uppercase, tracking-widest.
 * - Author name in clay (the only foreground use of clay on the page)
 *   draws the eye to the human voice.
 *
 * COMMON MISTAKE: dropping the cite= attribute on <blockquote> and
 * just putting the source name in visible text. The cite= attribute
 * is machine-readable — search engines and accessibility tools use
 * it to link the quote to its source. Without it, the quote looks
 * attributed but isn't programmatically traceable.
 */

import Image from "next/image";

interface Testimonial {
  /** The verbatim quote, kept short enough to read at a glance. */
  quote: string;
  /** Reviewer name as published on the source page. */
  author: string;
  /** Public review platform name — must appear in the visible cite. */
  source: "TripAdvisor" | "The Infatuation";
  /** Direct URL to the review page (used in the blockquote cite= attr). */
  sourceUrl: string;
  /** Published date as it appears on the source. */
  date: string;
  /** Star rating where the source provides one. */
  rating?: string;
  /**
   * Short trust signal shown in a small row between the avatar and
   * the quote. For star reviews: "★★★★★". For critic reviews where
   * stars don't apply: a short label like "Critic's Pick".
   */
  trustSignal: string;
  /** Path to the watercolour-illustrated avatar in /public. */
  avatarSrc: string;
  /**
   * Alt text for the avatar. Worded to make clear this is an
   * illustration, not a photograph of the actual reviewer — the
   * same honesty principle that drives the whole avatar approach
   * (see deviation 7.3).
   */
  avatarAlt: string;
}

const TESTIMONIALS: ReadonlyArray<Testimonial> = [
  {
    quote:
      "This Danish café at Launceston Place is in one the prettiest corners of London and it doesn't let the corner down.",
    author: "Oliver Feldman",
    source: "The Infatuation",
    sourceUrl: "https://www.theinfatuation.com/london/reviews/hjem",
    date: "January 2020",
    trustSignal: "Critic's Pick",
    avatarSrc: "/images/testimonials/avatar-feldman.jpeg",
    avatarAlt:
      "Watercolour illustration of a friendly bearded man in his 40s wearing a light denim shirt — decorative avatar, not a photograph of the reviewer.",
  },
  {
    quote:
      "A perfect mocha with first-rate, not-too-sweet chocolate and a freshly baked cardamom bun that was tender and flavorful.",
    author: "Karen55115",
    source: "TripAdvisor",
    sourceUrl:
      "https://www.tripadvisor.co.uk/Restaurant_Review-g186338-d13378358-Reviews-Hjem_Kensington-London_England.html",
    date: "February 2025",
    rating: "5/5",
    trustSignal: "★★★★★",
    avatarSrc: "/images/testimonials/avatar-karen.jpeg",
    avatarAlt:
      "Watercolour illustration of a smiling woman in her 50s with short silver hair, glasses, and a warm wool scarf — decorative avatar, not a photograph of the reviewer.",
  },
  {
    quote:
      "The oat hot chocolate is incredible. My husband loves the coffee. My daughter the cakes.",
    author: "Mrs Sarah G",
    source: "TripAdvisor",
    sourceUrl:
      "https://www.tripadvisor.co.uk/Restaurant_Review-g186338-d13378358-Reviews-Hjem_Kensington-London_England.html",
    date: "January 2022",
    rating: "5/5",
    trustSignal: "★★★★★",
    avatarSrc: "/images/testimonials/avatar-sarah.jpeg",
    avatarAlt:
      "Watercolour illustration of a cheerful woman in her late 30s with wavy auburn hair and a cream knit jumper — decorative avatar, not a photograph of the reviewer.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="bg-bone px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">
        {/* Centered header — eyebrow → big display heading → subhead. */}
        <div className="text-center">
          <p className="font-body text-sm uppercase tracking-widest text-clay">
            Social proof
          </p>
          <h2
            id="testimonials-heading"
            className="mt-2 font-display text-4xl text-ink sm:text-5xl"
          >
            What people are saying.
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-base text-ink/70">
            Real reviews from public platforms — verbatim, with a link
            to the source for every quote.
          </p>
        </div>

        {/* Grid of cards. mt-20 because the avatar circles overhang
            the top of each card by half their height. */}
        <div className="mt-20 grid gap-y-20 gap-x-8 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.sourceUrl + t.author}
              cite={t.sourceUrl}
              className="relative flex flex-col items-center rounded-lg border border-ink/10 bg-cream px-6 pb-8 pt-16 text-center shadow-sm"
            >
              {/* Avatar circle, absolute-positioned overhanging the
                  top edge. ring-bone gives it a halo against the
                  card's cream background so the circle reads cleanly. */}
              <div className="absolute -top-12 left-1/2 h-24 w-24 -translate-x-1/2 overflow-hidden rounded-full bg-bone shadow-md ring-4 ring-bone">
                <Image
                  src={t.avatarSrc}
                  alt={t.avatarAlt}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Trust signal row — small, uppercase, clay accent.
                  This is what was previously inside the circle; moving
                  it below the avatar keeps the conversion cue prominent
                  without competing with the portrait for visual space. */}
              <p className="font-body text-sm uppercase tracking-widest text-clay">
                {t.trustSignal}
              </p>

              {/* Decorative open-quote glyph in clay/60. aria-hidden
                  because the <blockquote> already tells assistive tech
                  this is a quotation. */}
              <span
                aria-hidden="true"
                className="mt-2 font-display text-5xl leading-none text-clay/60"
              >
                &ldquo;
              </span>

              <p className="mt-2 font-body text-base leading-relaxed text-ink/85">
                {t.quote}
              </p>

              {/* Attribution block. <cite> is the semantic element for
                  the source of a quote. Author name in clay (only
                  foreground use of clay on the page) draws the eye. */}
              <footer className="mt-6 w-full border-t border-ink/10 pt-4 font-body text-sm">
                <cite className="not-italic">
                  <span className="block font-display text-lg text-clay">
                    {t.author}
                  </span>
                  <span className="mt-1 block text-ink/60">
                    <a
                      href={t.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-ink/20 underline-offset-2 transition hover:decoration-clay"
                    >
                      {t.source}
                    </a>
                    {` · ${t.date}`}
                  </span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

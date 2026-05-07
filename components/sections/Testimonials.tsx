/**
 * WHAT: The Testimonials section — social-proof band between Menu and
 *       Visit. Three real, attributed customer/critic quotes pulled
 *       verbatim from public review platforms (TripAdvisor and The
 *       Infatuation). Each card carries a circular badge at the top
 *       showing the trust signal (5-star rating or "Critic's Pick"),
 *       the verbatim quote, and a full source attribution.
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
 * ## The badge-instead-of-photo decision (deviation 7.3)
 *
 * The reference design Essam pointed at uses circular profile photos
 * of each reviewer at the top of every card. We deliberately do NOT
 * lift reviewer photos from TripAdvisor / The Infatuation:
 *
 *   - **GDPR (UK)**: reviewer faces are personal data. Republishing
 *     them on Hjem's commercial site has no lawful basis under
 *     Article 6. Fines up to 4% of global turnover.
 *   - **Two of three reviewers are anonymous handles** anyway —
 *     Karen55115 and Mrs Sarah G show generic platform avatars on
 *     the source pages, not real faces.
 *   - **Stock or AI-generated faces** under the real reviewers'
 *     names would misrepresent who endorsed Hjem — that crosses
 *     into misleading advertising under UK CAP/ASA rules and the
 *     DMCC Act.
 *
 * What we use instead in the same circular slot: the **trust
 * signal itself** — "★★★★★" for the 5-star reviews, "Critic's Pick"
 * for The Infatuation. This is honest, polished, and arguably a
 * stronger conversion cue than a generic face.
 *
 * ## Editorial / legal stance (carried over from deviation 7.2)
 *
 * Quotes are real reviews published on public review platforms
 * under each platform's user-content terms. We quote short excerpts
 * with full attribution (reviewer name + source name + source URL +
 * date) — standard editorial fair use, the same pattern a press
 * piece would follow. We do NOT scrape Google reviews (TOS-prohibited
 * and Google renders them client-side anyway), and we do NOT generate
 * reviews that "sound plausible" but aren't real.
 *
 * When Marianne (the Hjem owner — Marianne Brammer, founded Jan
 * 2018) confirms which reviews she's happy to feature, swap the
 * TESTIMONIALS array. The shape (quote / author / source / sourceUrl
 * / date / badge) is what's locked in by the test.
 *
 * ## Visual decisions
 *
 * - bg-bone band — sits between Menu (cream) and Visit (cream), so a
 *   slightly cooler off-white gives the page a third tonal step
 *   without breaking the warm palette.
 * - Centered headline + subhead — matches the visual rhythm of the
 *   reference Essam pointed at.
 * - Cards on bg-cream (warmer than the bone section) so they pop
 *   against the band; border + shadow for definition.
 * - Circular badge sits half-overlapping the top edge of each card
 *   (translateY -50%, mt-12 on the card grid to make room) — same
 *   visual structure as the reference, with the trust signal in
 *   place of a face.
 * - Author name in clay (terracotta accent) — only place on the
 *   page that uses clay as a foreground colour, draws the eye.
 *
 * COMMON MISTAKE: dropping the cite= attribute on <blockquote> and
 * just putting the source name in visible text. The cite= attribute
 * is machine-readable — search engines and accessibility tools use
 * it to link the quote to its source. Without it, the quote looks
 * attributed but isn't programmatically traceable.
 */

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
   * What goes inside the circular badge at the top of the card.
   * For 5-star reviews: "★★★★★". For critic reviews where stars
   * don't apply: a short label like "Critic's Pick".
   */
  badgeLabel: string;
  /** Optional second line under the badge label (small caption). */
  badgeSubtitle?: string;
}

const TESTIMONIALS: ReadonlyArray<Testimonial> = [
  {
    quote:
      "This Danish café at Launceston Place is in one the prettiest corners of London and it doesn't let the corner down.",
    author: "Oliver Feldman",
    source: "The Infatuation",
    sourceUrl: "https://www.theinfatuation.com/london/reviews/hjem",
    date: "January 2020",
    badgeLabel: "Critic's",
    badgeSubtitle: "Pick",
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
    badgeLabel: "★★★★★",
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
    badgeLabel: "★★★★★",
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
        {/* Centered header — matches the visual rhythm of the
            reference template. Eyebrow → big display heading → small
            subhead, all centered. */}
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

        {/* Grid of cards. mt-20 instead of mt-12 because the badge
            circles overhang the top of each card by half their height —
            extra top margin keeps them from crashing into the subhead. */}
        <div className="mt-20 grid gap-y-20 gap-x-8 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.sourceUrl + t.author}
              cite={t.sourceUrl}
              className="relative flex flex-col items-center rounded-lg border border-ink/10 bg-cream px-6 pb-8 pt-16 text-center shadow-sm"
            >
              {/* Circular badge: trust signal in place of a face.
                  Absolute-positioned, overlapping the top edge so it
                  sits "in" the card frame the way the reference's
                  profile photos do. */}
              <div
                aria-hidden="true"
                className="absolute -top-12 left-1/2 flex h-24 w-24 -translate-x-1/2 flex-col items-center justify-center rounded-full bg-moss text-bone shadow-md ring-4 ring-bone"
              >
                {t.rating ? (
                  // 5-star reviews: oversized stars in display type.
                  // tracking-tight pulls them together so they read
                  // as one unit, not five separate glyphs.
                  <span className="text-base leading-none tracking-tight">
                    {t.badgeLabel}
                  </span>
                ) : (
                  // Critic / no-rating: stacked label + subtitle in
                  // display type so the badge feels editorial, not
                  // numeric.
                  <>
                    <span className="font-display text-base leading-none">
                      {t.badgeLabel}
                    </span>
                    {t.badgeSubtitle && (
                      <span className="mt-1 font-display text-base leading-none">
                        {t.badgeSubtitle}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Decorative open-quote glyph — matches the reference's
                  visual treatment. aria-hidden because it's pure
                  decoration; the <blockquote> wrapper already tells
                  assistive tech this is a quotation. */}
              <span
                aria-hidden="true"
                className="font-display text-5xl leading-none text-clay/60"
              >
                &ldquo;
              </span>

              <p className="mt-4 font-body text-base leading-relaxed text-ink/85">
                {t.quote}
              </p>

              {/* Attribution block. <cite> is the semantic element for
                  the source of a quote. Author name in clay (the only
                  foreground use of clay on the page) draws the eye to
                  the human voice; platform · date sit smaller below. */}
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

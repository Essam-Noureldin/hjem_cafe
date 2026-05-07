/**
 * WHAT: The Testimonials section — social-proof band between Menu and
 *       Visit. Three real, attributed customer/critic quotes pulled
 *       verbatim from public review platforms (TripAdvisor and The
 *       Infatuation). Each quote shows the reviewer name, star rating
 *       (where applicable), date, and source — and links back to the
 *       page the quote was lifted from.
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
 * Editorial / legal stance:
 *   These quotes are real reviews published on public review platforms
 *   under each platform's user-content terms. We quote short excerpts
 *   with full attribution (reviewer name + source name + source URL +
 *   date) — standard editorial fair use, the same pattern a press
 *   piece would follow. We do NOT scrape Google reviews (TOS-prohibited
 *   and Google renders them client-side anyway), and we do NOT generate
 *   reviews that "sound plausible" but aren't real. Those are the two
 *   patterns that get small businesses fined.
 *
 *   When Marianne (the Hjem owner — Marianne Brammer, founded Jan 2018)
 *   confirms which reviews she's happy to feature, swap the TESTIMONIALS
 *   array. The shape (quote / author / source / sourceUrl / date) is
 *   what's locked in by the test.
 *
 * Visual decisions:
 *   - bg-bone band — sits between Menu (cream) and Visit (cream), so a
 *     slightly cooler off-white gives the page a third tonal step
 *     without breaking the warm palette.
 *   - 3-column grid on desktop, stacks to single column on mobile.
 *     Three columns is the natural fit for three quotes; any more would
 *     feel like a wall of text, any fewer would underweight the section.
 *   - <blockquote> + <cite>: correct semantic for "this is a quoted
 *     statement from someone else with attribution." Screen readers
 *     announce blockquote contextually so visitors using assistive tech
 *     know they're reading external voices, not Hjem's own copy.
 *
 * COMMON MISTAKE: dropping the cite= attribute on <blockquote> and
 * just putting the source name in visible text. The cite= attribute is
 * machine-readable — search engines and accessibility tools use it to
 * link the quote to its source. Without it, the quote looks attributed
 * but isn't programmatically traceable.
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
}

const TESTIMONIALS: ReadonlyArray<Testimonial> = [
  {
    quote:
      "This Danish café at Launceston Place is in one the prettiest corners of London and it doesn't let the corner down.",
    author: "Oliver Feldman",
    source: "The Infatuation",
    sourceUrl: "https://www.theinfatuation.com/london/reviews/hjem",
    date: "January 2020",
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
        <p className="font-body text-sm uppercase tracking-widest text-clay">
          Social proof
        </p>
        <h2
          id="testimonials-heading"
          className="mt-2 font-display text-4xl text-ink sm:text-5xl"
        >
          What people are saying.
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.sourceUrl + t.author}
              cite={t.sourceUrl}
              className="flex flex-col rounded-lg border border-ink/10 bg-cream p-8 shadow-sm"
            >
              <p className="font-body text-base leading-relaxed text-ink/85">
                <span aria-hidden="true" className="font-display text-3xl text-moss">
                  &ldquo;
                </span>
                {t.quote}
              </p>

              {/* Attribution block. <cite> is the semantic element for
                  the source of a quote — name + platform together so the
                  reader sees provenance at a glance, and the link goes
                  to the original review page so anyone can verify. */}
              <footer className="mt-6 border-t border-ink/10 pt-4 font-body text-sm">
                <cite className="not-italic text-ink">
                  <span className="font-display text-base text-ink">
                    {t.author}
                  </span>
                  <span className="block text-clay">
                    {t.rating ? `${t.rating} · ` : ""}
                    <a
                      href={t.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-clay/40 underline-offset-2 transition hover:decoration-clay"
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

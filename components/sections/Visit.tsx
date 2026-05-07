/**
 * WHAT: The Visit section — closing band of the homepage. Two-column on
 *       desktop (info left, shopfront image right), stacks on mobile.
 *       Carries the only two facts that turn a brochure read into a
 *       walk-in: where Hjem is and when it's open. Plus one outbound
 *       CTA to Google Maps directions in a new tab.
 * WHY:  Visit is the page's conversion surface. Every section above
 *       sells the feel; this one tells the visitor exactly what to do
 *       next. A static, readable list of hours beats an embedded map
 *       widget here — embedding Google Maps would mean relaxing the
 *       CSP `frame-src 'none'` to allow `https://www.google.com`,
 *       loading their analytics, and slowing the page. The "Get
 *       directions" link does the same job at zero cost: tap on a
 *       phone, native maps app opens already routing.
 * IF REMOVED: the navbar's `/#visit` anchor scrolls nowhere meaningful
 *             and the homepage gives a visitor no reason to walk in.
 *
 * Visual decisions:
 *   - bg-cream rhythm (matches Hero/Bench bands; Story is moss, Menu
 *     is cream — Visit picks up cream again to bookend the page warm
 *     before the moss Footer).
 *   - Image on the right at desktop (lg:order-last on the image
 *     column) so the info-density side is what reads first when the
 *     two-column layout collapses to a single column on mobile —
 *     stacked, info on top, image below.
 *   - Reusing /images/hero-shopfront.jpeg: it's the natural "this is
 *     the front door" shot. It appears 5+ scroll-lengths earlier in
 *     the Hero rotation, so the visual recall is "yes, that place"
 *     rather than "didn't I just see this".
 *
 * Address & hours are real (157 Gloucester Road, SW7 4TH; Mon–Fri
 * 7:30–17:00, Sat & Sun 8:30–17:00) from Essam's in-store research.
 * Phone number unknown — left out rather than invented.
 *
 * COMMON MISTAKE: opening an external link in a new tab without
 * rel="noopener noreferrer" lets the new tab access window.opener
 * (tab-nabbing) and leaks the referrer URL. Both attributes are
 * mandatory on every target="_blank" link in the project.
 */

import Image from "next/image";

// 157 Gloucester Road, SW7 4TH. Encoded query goes into the
// Google Maps URL — `/maps/?q=` is the universal form that opens
// in the native Maps app on mobile and the web app on desktop.
const DIRECTIONS_URL =
  "https://www.google.com/maps/?q=157+Gloucester+Road+London+SW7+4TH";

const HOURS: ReadonlyArray<{ days: string; range: string }> = [
  { days: "Monday – Friday", range: "7:30 – 17:00" },
  { days: "Saturday & Sunday", range: "8:30 – 17:00" },
];

export default function Visit() {
  return (
    <section
      id="visit"
      aria-labelledby="visit-heading"
      className="bg-cream px-6 py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="font-body text-sm uppercase tracking-widest text-clay">
            Visit
          </p>
          <h2
            id="visit-heading"
            className="mt-2 font-display text-4xl text-ink sm:text-5xl"
          >
            One room on Gloucester Road.
          </h2>

          <p className="mt-6 font-body text-base leading-relaxed text-ink/80">
            South Kensington, two minutes from the tube. Walk in before
            lunch — most of what we make is gone by then.
          </p>

          {/* Address + postcode in a tight stack so screen readers
              read it as a single block, not as two unrelated lines. */}
          <address className="mt-8 not-italic font-body text-base text-ink">
            <div className="font-display text-2xl text-ink">
              157 Gloucester Road
            </div>
            <div className="mt-1 text-ink/80">London, SW7 4TH</div>
          </address>

          {/* dl is the right semantic for "label : value" pairs like
              opening hours. Each weekday band is a <dt>, each time
              range is the corresponding <dd>. */}
          <dl className="mt-8 grid grid-cols-1 gap-y-3 sm:grid-cols-[max-content_1fr] sm:gap-x-8">
            {HOURS.map((band) => (
              <div key={band.days} className="contents">
                <dt className="font-body text-sm uppercase tracking-widest text-clay">
                  {band.days}
                </dt>
                <dd className="font-body text-base text-ink">{band.range}</dd>
              </div>
            ))}
          </dl>

          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-moss px-8 py-3 font-body text-sm uppercase tracking-widest text-bone transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss"
          >
            Get directions
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden bg-moss/40 lg:order-last">
          <Image
            src="/images/hero-shopfront.jpeg"
            alt="The Hjem shopfront on Gloucester Road at dusk — warm interior light spilling onto the pavement, hand-painted signage above the door."
            fill
            sizes="(min-width: 1024px) 36rem, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * WHAT: The Contact section — closes the homepage with a way to send
 *       a real message. Sits below Visit so the visitor has already
 *       seen address + hours + directions; this is for the cohort
 *       that wants to ask before they walk in (allergens, larger
 *       orders, lost property, press enquiries).
 * WHY:  Visit covers walk-ins. Contact covers everything that doesn't
 *       fit on a counter conversation. Together they're the master
 *       prompt's #6 requirement (contact section: address, hours,
 *       form). Form lives in its own section rather than inside
 *       Visit so the two-column Visit layout doesn't have to grow
 *       a third column.
 * IF REMOVED: visitors who can't physically come in have no way to
 *             reach Hjem from the website.
 *
 * Visual:
 *   - bg-bone band — same surface as Testimonials, gives the page
 *     a final calm beat before the moss Footer.
 *   - Single column, narrow max-width — forms read better when they
 *     don't sprawl across a desktop viewport.
 *   - Clay-accented eyebrow + display headline match the section
 *     rhythm established by Story / Menu / Visit.
 *
 * Not in the navbar: same reasoning as Testimonials — passive
 * destination at the bottom of the scroll, not a primary nav target.
 */

import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-bone px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-2xl">
        <p className="font-body text-sm uppercase tracking-widest text-clay">
          Contact
        </p>
        <h2
          id="contact-heading"
          className="mt-2 font-display text-4xl text-ink sm:text-5xl"
        >
          Send us a note.
        </h2>
        <p className="mt-4 font-body text-base text-ink/70">
          Wholesale, allergens, lost property, press, or just to say
          hello — we read every message and reply within a couple of
          working days.
        </p>

        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

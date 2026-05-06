/**
 * WHAT: Terms & Conditions of use for the Hjem Kensington website,
 *       at /terms-and-conditions. Sets out what visitors can and cannot
 *       do with the site, the limitation of liability, IP ownership,
 *       and that disputes are governed by English law.
 * WHY:  A high-street bakery website needs T&Cs principally to limit
 *       liability if someone misreads opening hours, allergens, or
 *       prices and acts on that. It also makes the IP situation
 *       explicit (the photos and copy belong to Hjem) and pins the
 *       jurisdiction in case of a dispute.
 * IF REMOVED: footer link 404s; in a worst-case dispute Hjem would have
 *             no documented limitation of liability to point to.
 * COMMON MISTAKE: writing T&Cs that cover e-commerce (refunds, returns,
 *                 distance selling regs) when the site does not sell
 *                 anything online. Keep it scoped to what the site
 *                 actually does — a brochure for a physical shop.
 */

import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms governing your use of the Hjem Kensington website, including liability, intellectual property, and applicable law.",
};

export default function TermsAndConditionsPage() {
  return (
    <LegalLayout title="Terms & Conditions" lastUpdated="2026-05-04">
      <p>
        These terms apply when you visit the Hjem Kensington website
        (the site). By using the site you agree to these terms. If
        you do not agree, please stop using the site.
      </p>

      <h2>1. About us</h2>
      <p>
        The site is operated by <strong>Hjem Kensington</strong>, a
        Danish neighbourhood bakery and specialty coffee shop trading
        from two locations in Kensington and South Kensington, London,
        United Kingdom.
      </p>

      <h2>2. What the site is for</h2>
      <p>
        This site is informational. It tells you about Hjem Kensington —
        our locations, our menu, our story — and lets you contact us.
        The site does not sell goods or services online; any purchase
        happens in person at one of our shops.
      </p>

      <h2>3. Accuracy of information</h2>
      <p>
        We try to keep the site accurate and up to date, but we cannot
        guarantee that everything on it is current at the moment you
        read it. Opening hours, menu items, prices, and availability
        change in the real world before this site catches up.
      </p>
      <p>
        Before making a journey, please check our latest opening hours.
        Before making a food choice based on allergens, please ask a
        member of our team in person — the website is not a substitute
        for a fresh allergen check at the counter.
      </p>

      <h2>4. Allergens and food safety</h2>
      <p>
        Hjem Kensington is a working bakery: traces of wheat, gluten,
        milk, egg, nuts, soya, and sesame are present throughout our
        kitchens and cannot be guaranteed absent from any product. If
        you have a serious allergy, please speak to a team member at
        the counter before ordering.
      </p>

      <h2>5. Intellectual property</h2>
      <p>
        All content on the site — text, photographs, illustrations, the
        Hjem Kensington name, our logo, and the design and layout of
        the site itself — belongs to Hjem Kensington (or to our
        licensors, where credited). You may view and share our pages
        for personal, non-commercial purposes. You may not copy,
        reproduce, modify, or republish any part of the site for
        commercial use without our written permission.
      </p>

      <h2>6. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          use the site or its contact form to send unlawful, abusive,
          or harassing messages;
        </li>
        <li>
          attempt to interfere with the normal operation of the site,
          including by submitting automated requests, malicious code,
          or attempts to bypass rate limits or security measures;
        </li>
        <li>
          use the site to impersonate any person or to misrepresent
          your relationship with Hjem Kensington.
        </li>
      </ul>

      <h2>7. Limitation of liability</h2>
      <p>
        We provide the site on an as-is basis. To the fullest extent
        permitted by law, Hjem Kensington is not liable for any
        indirect, incidental, or consequential loss arising from your
        use of, or inability to use, the site.
      </p>
      <p>
        Nothing in these terms limits or excludes our liability for
        death or personal injury caused by our negligence, for fraud,
        or for any other liability that cannot be limited or excluded
        under English law.
      </p>

      <h2>8. Third-party links</h2>
      <p>
        The site may link to third-party websites (for example, our
        Google Business Profile or Instagram). We are not responsible
        for the content of those sites; clicking a link to one is at
        your own risk.
      </p>

      <h2>9. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The date at the
        top of this page shows when they were last revised. Continued
        use of the site after a change means you accept the updated
        terms.
      </p>

      <h2>10. Governing law and jurisdiction</h2>
      <p>
        These terms, and any dispute arising out of or in connection
        with them, are governed by the laws of England and Wales. The
        courts of England and Wales have exclusive jurisdiction to
        settle any such dispute.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these terms can be sent through the contact
        form on the homepage, or in person at either of our shops.
      </p>
    </LegalLayout>
  );
}

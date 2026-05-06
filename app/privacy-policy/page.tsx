/**
 * WHAT: The Privacy Policy page at /privacy-policy. Explains, in plain
 *       English, what personal data Hjem Kensington collects via the
 *       site, why, on what lawful basis, how long it is kept, and how
 *       a user can exercise their UK GDPR rights.
 * WHY:  The UK GDPR + the Data Protection Act 2018 require any site
 *       that collects personal data (name, email, message via the
 *       contact form, IP via analytics) to publish a privacy notice
 *       reachable from every page. Without one, the ICO can fine the
 *       business and search engines flag the domain as untrustworthy.
 * IF REMOVED: the contact form would be unlawful under UK GDPR Art.13
 *             (transparency), and footer links to /privacy-policy would
 *             404.
 * COMMON MISTAKE: copying a US-style we-may-share-with-partners
 *                 privacy policy. UK GDPR is stricter — we must name
 *                 specific processors (Resend, Vercel, Google) and
 *                 cite a lawful basis for each processing activity.
 *
 * Forward-compat note: this page describes GA4 and Resend as if they
 * are live. Per Session 3 Decision 2, we wrote it forward-compatible
 * because Steps 11-13 (the next session) wire GA in, and Step 17 wires
 * Resend in. The deployed site will match by Step 17.
 */

import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Hjem Kensington collects, uses, and protects your personal data under UK GDPR. Read about your rights and how to exercise them.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="2026-05-04">
      <p>
        This privacy notice explains how <strong>Hjem Kensington</strong>{" "}
        (we, us, our) collects and uses your personal data when you
        visit our website or get in touch with us. We are the data
        controller for the personal data described below, as defined by
        the UK General Data Protection Regulation (UK GDPR) and the
        Data Protection Act 2018.
      </p>

      <h2>1. Who we are</h2>
      <p>
        Hjem Kensington is a small Danish neighbourhood bakery and
        specialty coffee shop with two doors in Kensington and South
        Kensington, London. If you have any questions about this notice
        or about the data we hold on you, please use the contact details
        in section 9.
      </p>

      <h2>2. What data we collect</h2>
      <p>
        We only collect the personal data we genuinely need to operate
        the site and respond to enquiries. Specifically:
      </p>
      <ul>
        <li>
          <strong>Contact form submissions:</strong> name, email
          address, and the content of the message you send us.
        </li>
        <li>
          <strong>Analytics data (with your consent):</strong> if you
          accept analytics cookies, we receive aggregated information
          from Google Analytics 4 — including the pages you view, your
          rough location at city level, your device type, and how you
          arrived at the site.
        </li>
        <li>
          <strong>Server logs:</strong> our hosting provider logs
          standard request metadata (IP address, user agent, timestamp)
          for security and abuse prevention. These logs are kept short-
          term only.
        </li>
      </ul>

      <h2>3. Why we collect it (lawful basis)</h2>
      <p>
        Under UK GDPR we must have a lawful basis for every processing
        activity. Ours are:
      </p>
      <ul>
        <li>
          <strong>Contact form data — legitimate interests (Art. 6(1)(f)):</strong>{" "}
          responding to enquiries from members of the public is core to
          running a high-street business. We process the minimum data
          needed for this purpose.
        </li>
        <li>
          <strong>Analytics data — your consent (Art. 6(1)(a)):</strong>{" "}
          analytics only run if you click <em>Accept</em> on the cookie
          banner. You can withdraw consent at any time by clearing your
          browser site data for this domain.
        </li>
        <li>
          <strong>Server logs — legitimate interests (Art. 6(1)(f)):</strong>{" "}
          keeping the site online and protecting it from abuse.
        </li>
      </ul>

      <h2>4. Who we share it with</h2>
      <p>
        We do not sell or rent your data. We use a small number of
        trusted suppliers (data processors) to operate the site:
      </p>
      <ul>
        <li>
          <strong>Vercel Inc. (USA):</strong> hosts the website. Vercel
          processes server logs on our behalf under their published Data
          Processing Addendum.
        </li>
        <li>
          <strong>Resend (Resend Solutions, Inc., USA):</strong> delivers
          contact-form emails to our inbox. They process your name,
          email, and message content for the time it takes to deliver
          the email.
        </li>
        <li>
          <strong>Google LLC (Google Analytics 4):</strong> if you have
          consented, receives anonymised analytics events about your
          visit. Google acts as a data processor for us under their
          standard contract.
        </li>
      </ul>
      <p>
        Where these processors are based outside the UK, transfers are
        protected by the UK Addendum to the EU Standard Contractual
        Clauses or by a UK adequacy decision.
      </p>

      <h2>5. How long we keep it</h2>
      <ul>
        <li>
          <strong>Contact form messages:</strong> retained for up to
          twelve months after the last response, then deleted.
        </li>
        <li>
          <strong>Analytics data:</strong> retained for fourteen months
          in Google Analytics, after which it is automatically purged.
        </li>
        <li>
          <strong>Server logs:</strong> retained for up to thirty days
          by our hosting provider.
        </li>
      </ul>

      <h2>6. Your rights</h2>
      <p>Under UK GDPR you have the right to:</p>
      <ul>
        <li>access the personal data we hold on you;</li>
        <li>have inaccurate data corrected;</li>
        <li>have your data erased (the right to be forgotten);</li>
        <li>restrict or object to our processing of your data;</li>
        <li>receive your data in a portable format;</li>
        <li>
          withdraw consent at any time where consent is the lawful basis.
        </li>
      </ul>
      <p>
        To exercise any of these rights, email us using the details in
        section 9. We aim to respond within one calendar month.
      </p>

      <h2>7. Cookies</h2>
      <p>
        We use a small number of cookies. A separate{" "}
        <a href="/cookie-policy">Cookie Policy</a> explains each one,
        what it does, and how you can opt out.
      </p>

      <h2>8. Complaints</h2>
      <p>
        If you are unhappy with how we have handled your data, you have
        the right to complain to the UK Information Commissioner Office
        (ICO) at{" "}
        <a
          href="https://ico.org.uk/make-a-complaint/"
          target="_blank"
          rel="noopener noreferrer"
        >
          ico.org.uk/make-a-complaint
        </a>
        . We would, however, appreciate the chance to address your
        concerns before you contact the ICO — please get in touch first.
      </p>

      <h2>9. Contact</h2>
      <p>
        For data-protection enquiries about Hjem Kensington, please use
        the contact form on the homepage, or write to us at:
      </p>
      <p>
        <strong>Hjem Kensington</strong>
        <br />
        Kensington, London
        <br />
        United Kingdom
      </p>

      <h2>10. Changes to this notice</h2>
      <p>
        We may update this notice from time to time. The date at the top
        of this page shows when it was last revised. Material changes
        will be highlighted on the homepage for at least two weeks
        before they take effect.
      </p>
    </LegalLayout>
  );
}

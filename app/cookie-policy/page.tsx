/**
 * WHAT: Cookie Policy at /cookie-policy. Lists the cookies the site
 *       sets, explains what each does, and tells visitors how to
 *       opt out or change their mind.
 * WHY:  PECR (Privacy and Electronic Communications Regulations 2003,
 *       still in force in the UK) requires every site that sets non-
 *       essential cookies to publish a clear list of them and to obtain
 *       prior consent before they fire. The cookie banner alone is not
 *       enough — the banner must link to a fuller policy that names
 *       each cookie, its purpose, and its lifetime.
 * IF REMOVED: footer link 404s; the cookie banner Read-more link
 *             leads nowhere; the site is technically non-compliant
 *             with PECR even if no analytics cookies fire yet.
 * COMMON MISTAKE: claiming we do not use cookies because none are
 *                 dropped today. Forward-compat: the moment GA loads
 *                 (Step 13) cookies appear without the policy needing
 *                 to be re-published. Per Session 3 Decision 2 we
 *                 describe the post-Step-13 state.
 */

import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Which cookies the Hjem Kensington website uses, what they do, and how you can opt in or out at any time.",
};

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="2026-05-04">
      <p>
        This cookie policy explains how <strong>Hjem Kensington</strong>{" "}
        uses cookies and similar technologies on this website. It sits
        alongside our <a href="/privacy-policy">Privacy Policy</a>,
        which describes how we handle personal data more broadly.
      </p>

      <h2>1. What is a cookie?</h2>
      <p>
        A cookie is a small text file a website asks your browser to
        store on your device. It holds a value the site can read later —
        for example, a flag remembering that you have already accepted
        the cookie banner so we do not show it on every visit. Cookies
        cannot read other files on your device or run code by themselves.
      </p>

      <h2>2. Categories of cookie we use</h2>

      <h3>Strictly necessary cookies</h3>
      <p>
        These are required for the site to function. They do not track
        you across other sites and they do not need consent under PECR.
      </p>
      <ul>
        <li>
          <strong>cookie_consent</strong> — stores whether you accepted
          or declined analytics cookies, so we do not ask again on every
          page. Lifetime: up to 12 months. Set by: Hjem Kensington.
        </li>
      </ul>

      <h3>Analytics cookies (only if you have given consent)</h3>
      <p>
        These help us understand how the site is used in aggregate —
        which pages are popular, where visitors arrive from, what
        devices they use. They are <em>only</em> set after you click{" "}
        <em>Accept</em> on the cookie banner.
      </p>
      <ul>
        <li>
          <strong>_ga</strong> — distinguishes one visitor from another.
          Lifetime: up to 2 years. Set by: Google Analytics 4.
        </li>
        <li>
          <strong>_ga_&lt;container-id&gt;</strong> — keeps session
          state for Google Analytics 4. Lifetime: up to 2 years. Set
          by: Google Analytics 4.
        </li>
      </ul>

      <h2>3. How to change your mind</h2>
      <p>
        If you want to withdraw consent after previously accepting it,
        clear this site data in your browser. Most browsers let you
        do this from the lock icon in the address bar:
      </p>
      <ul>
        <li>
          <strong>Chrome / Edge:</strong> click the lock icon → Cookies
          and site data → See cookies and site data → Delete data.
        </li>
        <li>
          <strong>Safari:</strong> Settings → Privacy → Manage Website
          Data → search for hjemkensington → Remove.
        </li>
        <li>
          <strong>Firefox:</strong> click the lock icon → Clear cookies
          and site data.
        </li>
      </ul>
      <p>
        Once cleared, our cookie banner will appear again on your next
        visit and you can choose differently.
      </p>

      <h2>4. Third-party cookies</h2>
      <p>
        The only third-party cookies we set are those listed above
        under Analytics cookies — and only after consent. We do not
        embed third-party advertising, social-media trackers, or
        retargeting pixels on this site.
      </p>

      <h2>5. Do Not Track browser signals</h2>
      <p>
        Browsers can send a Do Not Track header. There is no
        industry-wide agreement on how sites should respond to it, so
        we treat the cookie banner as the authoritative signal. If you
        prefer not to be tracked, please click <em>Decline</em> on the
        banner.
      </p>

      <h2>6. Changes to this policy</h2>
      <p>
        If we add or remove a cookie, we will update the table above
        and the date at the top of this page. Material changes will be
        flagged on the homepage for at least two weeks before they
        take effect.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about cookies on this site can be sent through the
        contact form on the homepage. For broader data-protection
        questions, please refer to the{" "}
        <a href="/privacy-policy">Privacy Policy</a>.
      </p>
    </LegalLayout>
  );
}

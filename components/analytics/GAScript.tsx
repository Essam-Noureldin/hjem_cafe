"use client";

/**
 * WHAT: Mounts the GA4 (gtag.js) script tag into the document, but ONLY
 *       after the visitor has consented. Reads localStorage on every
 *       render via useSyncExternalStore so reload-with-stored-consent
 *       and first-click both work without an effect-then-setState
 *       pattern.
 * WHY:  GA cannot fire before consent (PECR/GDPR). The decoupled event
 *       model means CookieConsent doesn't need a direct reference to
 *       GAScript — both are mounted from layout.tsx and communicate via
 *       a window event.
 * IF REMOVED: GA never loads. Hjem's marketing dashboard stays empty.
 * COMMON MISTAKE: rendering the Script tag unconditionally and gating
 *                 with a runtime check. The script tag, once mounted,
 *                 fires immediately. Gating means deciding whether to
 *                 mount it AT ALL.
 */

import Script from "next/script";
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "cookie_consent";
const ACCEPT_EVENT = "cookie-consent-accepted";
const CHANGE_EVENT = "cookie-consent-changed";

interface GAScriptProps {
  /**
   * GA4 Measurement ID, e.g. "G-XXXXXXXXXX". When undefined the component
   * renders nothing — analytics is opt-in per environment, and a missing
   * ID means "no analytics here" rather than a configuration error.
   */
  gaId: string | undefined;
}

/**
 * Subscribe to anything that changes our derived "did the visitor accept?"
 * answer. Same three sources as CookieConsent — storage event for cross-
 * tab, ACCEPT_EVENT for first-click, CHANGE_EVENT for any same-tab change.
 */
function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(ACCEPT_EVENT, callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(ACCEPT_EVENT, callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot(): boolean {
  return window.localStorage.getItem(STORAGE_KEY) === "accepted";
}

function getServerSnapshot(): boolean {
  // Server doesn't know consent state. Default to "no GA" — safe fallback;
  // the script tag never renders in the SSR HTML payload.
  return false;
}

export default function GAScript({ gaId }: GAScriptProps) {
  const consented = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // No ID configured — silent no-op for environments without analytics.
  if (!gaId) return null;
  // Consent not given — render nothing.
  if (!consented) return null;

  return (
    <>
      {/* gtag.js loader — fetched from googletagmanager.com */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      {/* Inline initialiser — sets up dataLayer and the gtag() function,
          then fires a single page_view config call. The `id` prop is
          required by next/script for inline scripts. */}
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}

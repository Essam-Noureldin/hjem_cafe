"use client";

/**
 * WHAT: Bottom-fixed cookie consent banner. Shown on first visit. Records
 *       the visitor's choice in localStorage and, on Accept, dispatches a
 *       custom DOM event that GAScript listens for to inject the GA4 tag.
 * WHY:  PECR (UK) and GDPR (EU) require prior, informed, freely given
 *       consent before any non-essential cookie is set. GA4 sets non-
 *       essential cookies. Therefore GA cannot fire until the visitor
 *       clicks Accept — and the only honest way to enforce that is to
 *       gate the script tag behind this banner.
 * IF REMOVED: GA loads for every visitor, including UK/EU traffic, on
 *             first paint. That is a regulatory breach.
 * COMMON MISTAKE: reading localStorage during render, or via useEffect +
 *                 setState. The former crashes SSR (no localStorage on
 *                 the server); the latter is flagged by React 19.2's
 *                 react-hooks/set-state-in-effect rule. The blessed
 *                 pattern is useSyncExternalStore — it treats localStorage
 *                 as the external store it actually is, with a separate
 *                 server snapshot for SSR.
 */

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "cookie_consent";
const ACCEPT_EVENT = "cookie-consent-accepted";
const CHANGE_EVENT = "cookie-consent-changed";

/**
 * Subscribe to changes that should re-render any consumer of the consent
 * value. Two sources matter:
 *   1. The browser's built-in 'storage' event — fires when localStorage
 *      changes in *another* tab. Lets a click in tab A update the banner
 *      state in tab B without a refresh.
 *   2. Our own 'cookie-consent-changed' event — fires when localStorage
 *      changes in *the same tab*. The 'storage' event does not fire in
 *      the originating tab, so we dispatch our own to cover that case.
 */
function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot(): string | null {
  return window.localStorage.getItem(STORAGE_KEY);
}

/**
 * Server snapshot: localStorage doesn't exist on the server. Returning
 * null tells the renderer "treat as no consent yet" so SSR HTML includes
 * the banner. After hydration the client snapshot takes over; if a
 * returning visitor already consented, the banner unmounts on first
 * post-hydration render. A brief frame's flash for returning visitors,
 * no flash on first visit.
 */
function getServerSnapshot(): string | null {
  return null;
}

export default function CookieConsent() {
  const consent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  function handleAccept() {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    // Public event: GAScript listens for this to inject the GA tag.
    window.dispatchEvent(new Event(ACCEPT_EVENT));
    // Internal event: tells useSyncExternalStore subscribers in this same
    // tab to re-snapshot. The native 'storage' event only fires in OTHER
    // tabs, so without this our own banner would not unmount on click.
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  function handleDecline() {
    window.localStorage.setItem(STORAGE_KEY, "declined");
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  // Already chose — nothing to show.
  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 bg-moss text-bone p-4 sm:p-6 shadow-lg"
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed">
          We use cookies to understand how visitors use this site. Click{" "}
          <strong>Accept</strong> to enable analytics, or{" "}
          <strong>Decline</strong> to opt out. See our{" "}
          <a
            href="/cookie-policy"
            className="underline hover:text-clay focus:outline-none focus:ring-2 focus:ring-clay rounded-sm"
          >
            cookie policy
          </a>{" "}
          for details.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={handleAccept}
            className="px-5 py-2 bg-bone text-moss font-semibold rounded-sm hover:bg-clay hover:text-bone focus:outline-none focus:ring-2 focus:ring-clay transition-colors"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={handleDecline}
            className="px-5 py-2 border border-bone text-bone rounded-sm hover:bg-bone hover:text-moss focus:outline-none focus:ring-2 focus:ring-clay transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

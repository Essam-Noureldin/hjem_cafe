/**
 * WHAT: Integration test for the three legal pages — privacy-policy,
 *       terms-and-conditions, cookie-policy. Verifies that each page
 *       (a) renders without crashing, (b) exports unique metadata,
 *       (c) contains the business name in its rendered output.
 * WHY:  Master prompt mandates these three pages be present, each with
 *       unique <title>, meta description, and the business name visible
 *       in the body. Without this test, future refactors could quietly
 *       break required compliance copy or duplicate page titles (which
 *       hurts SEO and confuses users sharing links).
 * IF REMOVED: a developer could rename "Hjem Kensington" mid-page and
 *             break the legal pages without CI noticing — the site
 *             would still build green but the legal copy would be wrong.
 * COMMON MISTAKE: trying to assert on the rendered <title> tag in the
 *                 DOM. In App Router, metadata lives in the `metadata`
 *                 named export, not in the rendered React tree — Next
 *                 hoists it into <head> at request time. We assert on
 *                 the export directly.
 *
 * NOTE on the "200" requirement from the master prompt: in a Jest unit
 * environment there is no real HTTP layer. The accepted approximation
 * is "render the page component without throwing" — if rendering
 * succeeds, the route would respond 200 in production. The actual HTTP
 * behaviour is exercised end-to-end by the smoke tests in Step 20.
 */

import { render } from "@testing-library/react";
import type { Metadata } from "next";

import PrivacyPage, {
  metadata as privacyMetadata,
} from "@/app/privacy-policy/page";
import TermsPage, {
  metadata as termsMetadata,
} from "@/app/terms-and-conditions/page";
import CookiePage, {
  metadata as cookieMetadata,
} from "@/app/cookie-policy/page";

const BUSINESS_NAME = "Hjem Kensington";

/**
 * Helper: pull the title string out of a Metadata.title field, which can
 * be a plain string OR a `{ default, template, absolute }` object. The
 * root layout uses the object form for inheritance; per-page metadata
 * usually uses a plain string. Either is valid.
 */
function getTitleString(title: Metadata["title"]): string {
  if (typeof title === "string") return title;
  if (title && typeof title === "object" && "absolute" in title && title.absolute) {
    return title.absolute;
  }
  if (title && typeof title === "object" && "default" in title) {
    return title.default ?? "";
  }
  return "";
}

const pages = [
  {
    name: "privacy-policy",
    Component: PrivacyPage,
    metadata: privacyMetadata,
  },
  {
    name: "terms-and-conditions",
    Component: TermsPage,
    metadata: termsMetadata,
  },
  {
    name: "cookie-policy",
    Component: CookiePage,
    metadata: cookieMetadata,
  },
];

describe("Legal pages", () => {
  describe.each(pages)("/$name", ({ Component, metadata }) => {
    it("renders without throwing (HTTP 200 equivalent)", () => {
      // The render call itself is the assertion — if the page throws,
      // Jest fails the test with the underlying error. No `expect` needed.
      expect(() => render(<Component />)).not.toThrow();
    });

    it("contains the business name in the rendered body", () => {
      const { container } = render(<Component />);
      expect(container.textContent).toContain(BUSINESS_NAME);
    });

    it("exports a non-empty metadata.title", () => {
      const title = getTitleString(metadata.title);
      expect(title.length).toBeGreaterThan(0);
    });

    it("exports a non-empty metadata.description", () => {
      expect(metadata.description).toBeDefined();
      expect((metadata.description ?? "").length).toBeGreaterThan(0);
    });
  });

  it("each page has a unique metadata.title", () => {
    const titles = pages.map((p) => getTitleString(p.metadata.title));
    const unique = new Set(titles);
    expect(unique.size).toBe(pages.length);
  });
});

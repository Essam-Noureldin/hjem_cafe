/**
 * WHAT: Smoke test — every link rendered anywhere on the site resolves to
 *       something real. Internal links (starts with `/`) must point at a
 *       page route that exists; anchor links (`/#section`) must point at a
 *       section ID that's actually rendered on the homepage; external links
 *       must carry rel="noopener" so target=_blank can't tabnab the parent
 *       window. Footer must link all three legal pages.
 * WHY:  The single most embarrassing bug a brochure site can ship is a 404
 *       footer link. This test would have caught it if Cookie Policy had
 *       ever been linked at `/cookie-policy/` instead of `/cookie-policy`,
 *       or if a section id got renamed without updating the navbar.
 *
 * Approach: render the homepage (which composes navbar, all sections,
 * footer). Collect every <a> the page produced. Bucket by link kind and
 * apply the relevant rule to each bucket.
 *
 * COMMON MISTAKE: hard-coding "the navbar has 4 links" — every time the
 *                 navbar changes you'd update the test. Instead we assert
 *                 *rules* (every internal link resolves, every external
 *                 link has rel=noopener), which only break when the rule
 *                 is actually broken.
 */

import { render, screen } from "@testing-library/react";

import HomePage from "@/app/page";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Every page route the App Router serves. Source of truth for "is this
 * internal href real?" If a page is added under /app/, add it here too.
 */
const KNOWN_ROUTES: ReadonlySet<string> = new Set([
  "/",
  "/privacy-policy",
  "/terms-and-conditions",
  "/cookie-policy",
]);

/**
 * Render the homepage with navbar and footer wrapping it — mirrors what
 * the real layout produces. The root layout itself isn't rendered here
 * because layouts in App Router are server components that pull metadata
 * etc.; rendering Navbar/Home/Footer captures every link the visitor sees.
 */
function renderFullPage() {
  return render(
    <>
      <Navbar />
      <HomePage />
      <Footer />
    </>,
  );
}

describe("smoke — navigation", () => {
  it("renders at least one link", () => {
    renderFullPage();
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
  });

  it("every link has a non-empty href", () => {
    renderFullPage();
    const links = screen.getAllByRole("link");
    for (const link of links) {
      const href = link.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href!.length).toBeGreaterThan(0);
    }
  });

  it("every internal route link points at a known page", () => {
    renderFullPage();
    const links = screen.getAllByRole("link");
    const broken: string[] = [];

    for (const link of links) {
      const href = link.getAttribute("href")!;
      // Ignore anchors and externals — separate test for those.
      if (!href.startsWith("/")) continue;

      // Strip query and hash, then check the path against known routes.
      const pathOnly = href.split("#")[0].split("?")[0];
      if (!KNOWN_ROUTES.has(pathOnly)) {
        broken.push(href);
      }
    }

    expect(broken).toEqual([]);
  });

  it("every anchor link targets a section id that exists in the DOM", () => {
    renderFullPage();
    const links = screen.getAllByRole("link");
    const missing: string[] = [];

    for (const link of links) {
      const href = link.getAttribute("href")!;
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) continue;
      const sectionId = href.slice(hashIndex + 1);
      if (!sectionId) continue; // bare "#" — fine, scrolls to top

      if (!document.getElementById(sectionId)) {
        missing.push(`${href} — no element with id="${sectionId}"`);
      }
    }

    expect(missing).toEqual([]);
  });

  it("every external link has rel containing noopener (security)", () => {
    renderFullPage();
    const links = screen.getAllByRole("link");
    const insecure: string[] = [];

    for (const link of links) {
      const href = link.getAttribute("href")!;
      const isExternal = href.startsWith("http://") || href.startsWith("https://");
      if (!isExternal) continue;

      const rel = link.getAttribute("rel") ?? "";
      if (!rel.includes("noopener")) {
        insecure.push(`${href} — rel="${rel}"`);
      }
    }

    expect(insecure).toEqual([]);
  });

  it("footer links to all three legal pages", () => {
    renderFullPage();
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));

    expect(hrefs).toContain("/privacy-policy");
    expect(hrefs).toContain("/terms-and-conditions");
    expect(hrefs).toContain("/cookie-policy");
  });
});

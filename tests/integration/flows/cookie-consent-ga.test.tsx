/**
 * WHAT: Verifies the cross-component wiring between CookieConsent and
 *       GAScript. Asserts the regulatory-critical invariant: the GA
 *       script tag must NOT appear in the DOM until consent is given,
 *       and MUST appear once it is.
 * WHY:  This is the highest-risk regression in the project. If the
 *       wiring breaks silently, GA fires for UK/EU traffic without
 *       consent — a PECR/GDPR breach. Any change to either component
 *       must keep this test green.
 * IF REMOVED: GAScript and CookieConsent could drift independently and
 *             nothing would catch a regression until a user complains
 *             or the ICO issues a notice.
 *
 * NOTE on the next/script mock: in jsdom, `next/script` relies on
 * Next.js runtime infrastructure to actually inject script tags via
 * its strategy machinery. We don't have that runtime in tests. So we
 * mock next/script to render a plain <script> element — this isolates
 * what we're testing (the consent gate decides whether to render at
 * all) from what we're not (next/script's strategy implementation).
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("next/script", () => {
  // Render a plain <script> so DOM queries can find it. Inline scripts
  // pass children via the React node, external scripts pass a `src`.
  return function MockScript(props: {
    src?: string;
    id?: string;
    children?: React.ReactNode;
  }) {
    return (
      <script data-testid="ga-script" data-src={props.src} id={props.id}>
        {props.children}
      </script>
    );
  };
});

import CookieConsent from "@/components/CookieConsent";
import GAScript from "@/components/analytics/GAScript";

const TEST_GA_ID = "G-TEST00000";

function renderTogether() {
  return render(
    <>
      <GAScript gaId={TEST_GA_ID} />
      <CookieConsent />
    </>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("CookieConsent + GAScript wiring", () => {
  it("does NOT render the GA tag before consent (first visit)", () => {
    renderTogether();
    expect(screen.queryByTestId("ga-script")).not.toBeInTheDocument();
  });

  it("renders the GA tag after the visitor clicks Accept", async () => {
    const user = userEvent.setup();
    renderTogether();

    expect(screen.queryByTestId("ga-script")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /accept/i }));

    // Both the loader and the inline init script render — at least one
    // ga-script element in the DOM is enough to prove the gate opened.
    const scripts = screen.getAllByTestId("ga-script");
    expect(scripts.length).toBeGreaterThan(0);
    expect(
      scripts.some((s) => s.getAttribute("data-src")?.includes(TEST_GA_ID)),
    ).toBe(true);
  });

  it("does NOT render the GA tag after the visitor clicks Decline", async () => {
    const user = userEvent.setup();
    renderTogether();

    await user.click(screen.getByRole("button", { name: /decline/i }));
    expect(screen.queryByTestId("ga-script")).not.toBeInTheDocument();
  });

  it("renders the GA tag immediately on reload when consent was previously accepted", () => {
    window.localStorage.setItem("cookie_consent", "accepted");
    renderTogether();

    const scripts = screen.getAllByTestId("ga-script");
    expect(scripts.length).toBeGreaterThan(0);
  });

  it("does NOT render the GA tag on reload when consent was previously declined", () => {
    window.localStorage.setItem("cookie_consent", "declined");
    renderTogether();
    expect(screen.queryByTestId("ga-script")).not.toBeInTheDocument();
  });

  it("renders nothing when NEXT_PUBLIC_GA_ID is undefined, even with consent", () => {
    window.localStorage.setItem("cookie_consent", "accepted");
    render(
      <>
        <GAScript gaId={undefined} />
        <CookieConsent />
      </>,
    );
    expect(screen.queryByTestId("ga-script")).not.toBeInTheDocument();
  });
});

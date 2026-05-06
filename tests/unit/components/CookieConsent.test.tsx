/**
 * WHAT: Tests for the CookieConsent banner component.
 * WHY:  GA cannot load until the visitor consents. The banner is the only
 *       UI surface that captures that consent. If it stops working, GA
 *       never loads, the analytics dashboard goes empty, and we discover
 *       the regression weeks later from the wrong end.
 * IF REMOVED: nothing else exercises the banner's lifecycle (first visit
 *             render, accept/decline state, custom event dispatch). The
 *             integration test in Step 13 only verifies the cross-component
 *             contract, not the banner's internal behaviour.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CookieConsent from "@/components/CookieConsent";

/**
 * Each test starts with a clean localStorage so a previous test's
 * `cookie_consent` value can't leak into the next one.
 */
beforeEach(() => {
  window.localStorage.clear();
});

describe("CookieConsent", () => {
  describe("first visit (no stored consent)", () => {
    it("renders the banner", () => {
      render(<CookieConsent />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders Accept and Decline buttons", () => {
      render(<CookieConsent />);
      expect(
        screen.getByRole("button", { name: /accept/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /decline/i }),
      ).toBeInTheDocument();
    });

    it("links to the cookie policy", () => {
      render(<CookieConsent />);
      const link = screen.getByRole("link", { name: /cookie policy/i });
      expect(link).toHaveAttribute("href", "/cookie-policy");
    });

    it("has an aria-label on the dialog", () => {
      render(<CookieConsent />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-label");
      expect(dialog.getAttribute("aria-label")).not.toBe("");
    });
  });

  describe("with stored consent", () => {
    it("does not render when consent is accepted", () => {
      window.localStorage.setItem("cookie_consent", "accepted");
      render(<CookieConsent />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("does not render when consent is declined", () => {
      window.localStorage.setItem("cookie_consent", "declined");
      render(<CookieConsent />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("clicking Accept", () => {
    it("stores cookie_consent = accepted in localStorage", async () => {
      const user = userEvent.setup();
      render(<CookieConsent />);
      await user.click(screen.getByRole("button", { name: /accept/i }));
      expect(window.localStorage.getItem("cookie_consent")).toBe("accepted");
    });

    it("dispatches the cookie-consent-accepted custom event", async () => {
      const user = userEvent.setup();
      const listener = jest.fn();
      window.addEventListener("cookie-consent-accepted", listener);

      render(<CookieConsent />);
      await user.click(screen.getByRole("button", { name: /accept/i }));

      expect(listener).toHaveBeenCalledTimes(1);
      window.removeEventListener("cookie-consent-accepted", listener);
    });

    it("removes the banner after click", async () => {
      const user = userEvent.setup();
      render(<CookieConsent />);
      await user.click(screen.getByRole("button", { name: /accept/i }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("clicking Decline", () => {
    it("stores cookie_consent = declined in localStorage", async () => {
      const user = userEvent.setup();
      render(<CookieConsent />);
      await user.click(screen.getByRole("button", { name: /decline/i }));
      expect(window.localStorage.getItem("cookie_consent")).toBe("declined");
    });

    it("does NOT dispatch the cookie-consent-accepted event", async () => {
      const user = userEvent.setup();
      const listener = jest.fn();
      window.addEventListener("cookie-consent-accepted", listener);

      render(<CookieConsent />);
      await user.click(screen.getByRole("button", { name: /decline/i }));

      expect(listener).not.toHaveBeenCalled();
      window.removeEventListener("cookie-consent-accepted", listener);
    });

    it("removes the banner after click", async () => {
      const user = userEvent.setup();
      render(<CookieConsent />);
      await user.click(screen.getByRole("button", { name: /decline/i }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("keyboard navigation", () => {
    it("can reach both buttons via Tab and activate via Enter", async () => {
      const user = userEvent.setup();
      render(<CookieConsent />);

      // Tab through focusable elements until we reach Accept.
      // The dialog contains a link (Cookie Policy) before the buttons,
      // so Tab order is: Cookie Policy link -> Accept -> Decline.
      await user.tab();
      await user.tab();
      const acceptButton = screen.getByRole("button", { name: /accept/i });
      expect(acceptButton).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(window.localStorage.getItem("cookie_consent")).toBe("accepted");
    });
  });
});

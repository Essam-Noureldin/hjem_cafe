/**
 * WHAT: Tests for the ContactForm UI component — the only piece of the
 *       site that accepts free-text input from a stranger and forwards
 *       it to a real human inbox. The component is a thin wrapper around
 *       React 19's useActionState; the real work happens server-side in
 *       app/actions/contact.ts (covered by its own integration test).
 * WHY:  This test pins the behaviours that protect the user's experience
 *       — accessible labels, hidden honeypot, generic error messages,
 *       success feedback. Server-side rules (validation, rate limit,
 *       sanitisation) are exhaustively covered by the integration test;
 *       here we just confirm the UI surfaces whatever state arrives.
 *
 * Approach: mock the server action with a jest.fn so we can return any
 * state shape and assert how the component renders it. This is faster,
 * deterministic, and decouples UI tests from server logic — the
 * integration test owns the contract for action behaviour.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock the server action BEFORE importing the component so the
// component's import resolves to the mock.
jest.mock("@/app/actions/contact", () => ({
  submitContactForm: jest.fn(),
}));

import ContactForm from "@/components/ContactForm";
import { submitContactForm } from "@/app/actions/contact";

const submitMock = submitContactForm as unknown as jest.Mock;

async function fillValidFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name/i), "Real Visitor");
  await user.type(screen.getByLabelText(/email/i), "visitor@example.com");
  await user.type(
    screen.getByLabelText(/message/i),
    "Hello — I'd love to come by tomorrow morning if you have any cardamom buns left.",
  );
}

describe("ContactForm", () => {
  beforeEach(() => {
    submitMock.mockReset();
    // Default: action returns idle (no UI state change). Individual
    // tests override with mockResolvedValue to drive specific paths.
    submitMock.mockResolvedValue({ status: "idle" });
  });

  it("renders accessible name, email, and message fields", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    render(<ContactForm />);
    expect(
      screen.getByRole("button", { name: /send|submit/i }),
    ).toBeInTheDocument();
  });

  it("includes a honeypot field that is hidden from humans", () => {
    const { container } = render(<ContactForm />);
    // Convention: honeypot field name is "company_url" (a plausible
    // field name a bot would fill, but invisible to humans).
    const honeypot = container.querySelector(
      'input[name="company_url"]',
    ) as HTMLInputElement | null;
    expect(honeypot).not.toBeNull();

    // Bot-resistance: must use display:none (visibility:hidden is
    // skipped by some bots — see lib/honeypot.ts COMMON MISTAKE).
    // The wrapper element (or the input itself) carries display:none.
    const wrapper = honeypot!.closest('[data-honeypot]') as HTMLElement | null;
    const target = wrapper ?? honeypot!;
    expect(target.style.display).toBe("none");

    // Belt-and-braces: also off the focus order and a11y tree so a
    // real user with a keyboard or screen reader never lands on it.
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot).toHaveAttribute("aria-hidden", "true");
    expect(honeypot).toHaveAttribute("autocomplete", "off");
  });

  it("shows a thank-you message after a successful submission", async () => {
    submitMock.mockResolvedValue({ status: "success" });
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValidFields(user);
    await user.click(screen.getByRole("button", { name: /send|submit/i }));
    expect(
      await screen.findByText(/thanks|got it|received|in touch/i),
    ).toBeInTheDocument();
  });

  it("shows a generic error message on server error — no internals leaked", async () => {
    submitMock.mockResolvedValue({ status: "error", code: "server" });
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValidFields(user);
    await user.click(screen.getByRole("button", { name: /send|submit/i }));
    const error = await screen.findByText(/something went wrong|try again/i);
    expect(error).toBeInTheDocument();
    // None of these substrings should ever leak to the user.
    expect(error.textContent ?? "").not.toMatch(
      /stack|exception|undefined|resend|api key|sentry/i,
    );
  });

  it("shows a friendly rate-limit message when the action reports rate_limit", async () => {
    submitMock.mockResolvedValue({ status: "error", code: "rate_limit" });
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValidFields(user);
    await user.click(screen.getByRole("button", { name: /send|submit/i }));
    expect(
      await screen.findByText(/too many|wait|few minutes/i),
    ).toBeInTheDocument();
  });

  it("renders field-level validation errors returned by the action", async () => {
    submitMock.mockResolvedValue({
      status: "error",
      code: "validation",
      fieldErrors: { email: "Please enter a valid email address." },
    });
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValidFields(user);
    await user.click(screen.getByRole("button", { name: /send|submit/i }));
    expect(
      await screen.findByText(/valid email address/i),
    ).toBeInTheDocument();
  });
});

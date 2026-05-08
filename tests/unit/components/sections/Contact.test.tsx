/**
 * WHAT: Tests for the Contact section — the homepage band that hosts
 *       the form. The form's behaviour is exhaustively tested in
 *       ContactForm.test.tsx and contact-form.test.ts; this file pins
 *       the surrounding shape (id, heading, intro copy presence, form
 *       in the document).
 * WHY:  Without this, a regression that drops the section landmark or
 *       breaks the form mount would slip past the suite even though
 *       the form's own tests still pass.
 *
 * Note: the server action is mocked the same way ContactForm.test.tsx
 * mocks it — the form is rendered transitively via <Contact />, so we
 * still need to keep the action import out of the test runtime.
 */

import { render, screen } from "@testing-library/react";

jest.mock("@/app/actions/contact", () => ({
  submitContactForm: jest.fn(),
}));

import Contact from "@/components/sections/Contact";

describe("Contact", () => {
  it("renders inside a section with id='contact'", () => {
    const { container } = render(<Contact />);
    expect(container.querySelector("section#contact")).not.toBeNull();
  });

  it("has exactly one h2 — the section heading", () => {
    render(<Contact />);
    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s).toHaveLength(1);
  });

  it("renders the form (name, email, message fields) inside the section", () => {
    render(<Contact />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("renders intro copy that hints at the kinds of enquiries it accepts", () => {
    const { container } = render(<Contact />);
    // Loose assertion — copy can drift, but at least one of these
    // signal-words should always appear in the intro paragraph.
    expect(container.textContent).toMatch(
      /wholesale|allergens|press|hello/i,
    );
  });
});

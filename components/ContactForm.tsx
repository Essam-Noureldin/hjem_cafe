"use client";

/**
 * WHAT: Client-side contact form. Renders three fields (name, email,
 *       message), one hidden honeypot, and a submit button. The
 *       business logic lives entirely in the server action — this
 *       component only renders state returned from useActionState.
 *
 * WHY:  Server actions are the right primitive for form submissions
 *       in App Router (progressive enhancement, no separate API
 *       route needed). useActionState gives us a `pending` flag for
 *       free so the submit button can disable itself while the
 *       request is in flight.
 *
 * IF REMOVED: there's no UI to submit the form. The server action
 *             still works in theory but no humans can reach it.
 *
 * COMMON MISTAKE: showing the user different messages for "bot
 *                 caught" vs "rate limit hit". Both should look the
 *                 same to the user — bots that learn their honeypot
 *                 was rejected just iterate around it. We surface
 *                 rate-limit explicitly (a real human can hit it by
 *                 accident) but a bot rejection is silent (mapped
 *                 to a non-distinct error so we don't teach bots
 *                 that the form has bot defences).
 *
 * Honeypot: an `input[name="company_url"]` wrapped in a div with
 * inline `display: none`. The wrapper carries display:none rather
 * than the input itself so screen readers also ignore the wrapping
 * label. tabindex=-1 + aria-hidden + autocomplete=off complete the
 * defence — humans can't reach it, bots that auto-fill forms do.
 */

import { useActionState, useEffect, useId, useRef } from "react";
import {
  submitContactForm,
  type ContactFormState,
} from "@/app/actions/contact";

const INITIAL_STATE: ContactFormState = { status: "idle" };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    INITIAL_STATE,
  );

  const formRef = useRef<HTMLFormElement>(null);

  // Reset the form fields after a successful submission so a second
  // visitor can't accidentally re-send the previous message. Runs only
  // on the success transition — useEffect's dep on state.status takes
  // care of that.
  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  // Stable IDs for label/error pairing — useId is React 19's SSR-safe
  // way to do this (predictable across server and client renders).
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const nameErrorId = `${nameId}-error`;
  const emailErrorId = `${emailId}-error`;
  const messageErrorId = `${messageId}-error`;

  // Per-field error text, only present when the action returned a
  // validation error and named that field.
  const fieldErrors =
    state.status === "error" && state.code === "validation"
      ? state.fieldErrors
      : undefined;
  const nameError = fieldErrors?.name;
  const emailError = fieldErrors?.email;
  const messageError = fieldErrors?.message;

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className="space-y-5"
      aria-describedby="contact-form-status"
    >
      {/* Name */}
      <div>
        <label
          htmlFor={nameId}
          className="block font-body text-sm font-medium text-ink"
        >
          Your name
        </label>
        <input
          id={nameId}
          name="name"
          type="text"
          required
          autoComplete="name"
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? nameErrorId : undefined}
          className="mt-1 block w-full rounded-sm border border-ink/20 bg-bone px-3 py-2 font-body text-base text-ink shadow-sm focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
        />
        {nameError ? (
          <p
            id={nameErrorId}
            className="mt-1 font-body text-sm text-clay"
            role="alert"
          >
            {nameError}
          </p>
        ) : null}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor={emailId}
          className="block font-body text-sm font-medium text-ink"
        >
          Your email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? emailErrorId : undefined}
          className="mt-1 block w-full rounded-sm border border-ink/20 bg-bone px-3 py-2 font-body text-base text-ink shadow-sm focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
        />
        {emailError ? (
          <p
            id={emailErrorId}
            className="mt-1 font-body text-sm text-clay"
            role="alert"
          >
            {emailError}
          </p>
        ) : null}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor={messageId}
          className="block font-body text-sm font-medium text-ink"
        >
          Message
        </label>
        <textarea
          id={messageId}
          name="message"
          required
          rows={5}
          autoComplete="off"
          aria-invalid={Boolean(messageError)}
          aria-describedby={messageError ? messageErrorId : undefined}
          className="mt-1 block w-full rounded-sm border border-ink/20 bg-bone px-3 py-2 font-body text-base text-ink shadow-sm focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
        />
        {messageError ? (
          <p
            id={messageErrorId}
            className="mt-1 font-body text-sm text-clay"
            role="alert"
          >
            {messageError}
          </p>
        ) : null}
      </div>

      {/* Honeypot. Wrapper carries display:none so the entire field is
          invisible to humans (input + any decorative label). tabindex=-1
          + aria-hidden + autocomplete=off keep accidental keyboard or
          AT focus from landing on it. Bots that auto-fill every input
          will fill this — see lib/honeypot.ts. */}
      <div data-honeypot style={{ display: "none" }} aria-hidden="true">
        <label htmlFor="company_url">Company URL (leave empty)</label>
        <input
          id="company_url"
          name="company_url"
          type="text"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {/* Submit + status row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-sm bg-moss px-6 py-3 font-body text-sm uppercase tracking-widest text-bone transition-colors hover:bg-moss/90 focus:outline-none focus:ring-2 focus:ring-moss focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send message"}
        </button>

        <p
          id="contact-form-status"
          aria-live="polite"
          className="font-body text-sm"
        >
          {state.status === "success" ? (
            <span className="text-moss">
              Thanks — we&apos;ve got it. We&apos;ll be in touch shortly.
            </span>
          ) : null}
          {state.status === "error" && state.code === "rate_limit" ? (
            <span className="text-clay">
              That&apos;s a few too many in a short window — please wait a
              few minutes and try again.
            </span>
          ) : null}
          {state.status === "error" &&
          (state.code === "server" || state.code === "bot") ? (
            <span className="text-clay">
              Something went wrong sending that. Please try again, or
              email us directly at hello@hjemkensington.com.
            </span>
          ) : null}
        </p>
      </div>
    </form>
  );
}

/**
 * WHAT: A bright, unmissable banner shown at the top of each legal page,
 *       making it absolutely clear to any visitor that the page is a
 *       speculative demo and the policy text is not in force.
 * WHY:  This is a SPEC build — we are showing Hjem the site before they
 *       have agreed to anything. AI-generated legal templates that look
 *       authoritative but aren't reviewed by a solicitor would be a
 *       liability risk for both Essam (the developer) and Hjem (whose
 *       brand is on the page). The banner removes ambiguity: a real
 *       visitor lands here, sees the warning, and knows not to rely on
 *       the policy as binding.
 * IF REMOVED: a customer or competitor could screenshot the placeholder
 *             policy and hold Hjem to it, or the ICO could see it and
 *             treat it as Hjem's published privacy notice.
 * COMMON MISTAKE: making the banner subtle so it doesn't "ruin the
 *                 design". Don't. The whole point is to be loud.
 */

export default function DemoDisclaimer() {
  return (
    <aside
      role="note"
      aria-label="Demonstration site notice"
      className="bg-amber-100 border-l-4 border-amber-500 text-amber-900 px-6 py-4 mb-10 rounded-r-md"
    >
      <p className="font-semibold mb-1">Demonstration site — not in force</p>
      <p className="text-sm leading-relaxed">
        This page is part of a speculative website demo. The policy text
        below is an AI-generated template and has not been reviewed by a
        solicitor. It is not the legally binding policy of Hjem
        Kensington. For questions about this demo, contact{" "}
        <a
          href="mailto:esam.noureldin@gmail.com"
          className="underline hover:text-amber-950"
        >
          esam.noureldin@gmail.com
        </a>
        .
      </p>
    </aside>
  );
}

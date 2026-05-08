# HANDOVER.md

The document handed to you on launch day. Print it, save it, email it to
yourself — keep it somewhere you can find again. Most of what's here is
practical: who to call, what to do, where things are.

> ℹ️ **Note (for the developer):** This file is filled in pre-launch with
> the client's actual details (live URL, login emails, etc.). Until then,
> the placeholders below stay in. **Do not send this file to the client
> with the placeholders unfilled.**

---

## Welcome — your website is live

Your new website is at:

> **https://[live-url]** ← (filled in on launch day)

Everything that was promised in the proposal is built and tested. This
document is the operating manual.

---

## What was built

| Page | URL | What it does |
|---|---|---|
| Home | `/` | The whole story — hero, your story, today's specials, menu, testimonials, where to find you, contact form |
| Privacy Policy | `/privacy-policy` | Explains what data is collected from visitors (legally required) |
| Terms & Conditions | `/terms-and-conditions` | Sets the rules of use (legally required) |
| Cookie Policy | `/cookie-policy` | Explains the cookies the site uses (legally required) |

The site is mobile-first (designed for phones first, desktop second), passes
modern accessibility checks, and loads fast even on poor connections.

---

## Your contact for changes

| | |
|---|---|
| **Name** | Essam Noureldin |
| **Email** | onoureldin@gmail.com |
| **Response time** | Next business day for emails. Same-day for urgent issues (site down, form broken). |
| **Hours** | Monday–Friday, UK time. Weekend response only for emergencies. |

---

## How to ask for a change

Email Essam with this template:

```
Subject: Hjem website — change request

Hi Essam,

Could you make this change to my website:

What: [the change in plain English]

Where: [which page, or which section]

Example: [a sentence showing what it looks like now and what you want it to look like]

Thanks,
[your name]
```

Screenshots help a lot — feel free to attach phone screenshots with arrows
or notes drawn on them.

---

## What your retainer covers

```
✓ Hosting and domain renewal
✓ SSL certificate (the padlock in the browser)
✓ Up to 1 hour of small content changes per month (rolls over up to 3 hours)
✓ Monthly health check
✓ Security patches when needed
✓ Quarterly Lighthouse + accessibility audit
✓ Email support — next-business-day response
✓ Annual legal page review (technical updates; solicitor fees separate)
```

Out of scope:

```
✗ Solicitor fees for legal review
✗ Major new sections (quoted per project)
✗ Photography
✗ Copywriting for new content
✗ Email marketing campaigns
✗ Social media management
```

---

## Login credentials

> 🚨 **Critical — security:** treat these like the keys to the shop. Don't
> share them with anyone you wouldn't trust with the alarm code. We'll never
> ask you for them by email or phone.

> ℹ️ **Note (for developer):** fill in pre-launch. Use a password manager
> (Bitwarden, 1Password) to share — never paste passwords into this file
> directly if it'll live in any shared cloud folder.

| Service | URL | Username | Password | Notes |
|---|---|---|---|---|
| Vercel (hosting) | https://vercel.com | `[email]` | (in your password manager) | Where the site runs |
| Resend (email delivery) | https://resend.com | `[email]` | (in your password manager) | What sends the contact-form emails |
| Domain registrar | `[registrar]` | `[email]` | (in your password manager) | Where you renew the domain |
| GitHub (code repo) | `[repo URL]` | `[username]` | (in your password manager) | Where the code lives |
| Google Analytics | https://analytics.google.com | `[email]` | (in your password manager) | If/when GA is enabled |
| Sentry (error monitoring) | https://sentry.io | `[email]` | (in your password manager) | If/when Sentry is enabled |

---

## What NOT to do

> ⚠️ **Each of these can take the site down or cost you money.**

- **Don't buy hosting elsewhere.** The site already lives on Vercel.
  Buying a new hosting plan (Bluehost, GoDaddy, etc.) won't make the site
  work there — Next.js needs specific runtime support that those don't have.
- **Don't install plugins.** This isn't WordPress. There are no plugins to
  install. Anyone offering you "plugins for your Next.js site" is selling
  you something you can't use.
- **Don't change DNS records without telling us.** Pointing your domain at
  somewhere new takes the site offline. If you're moving the domain to a
  new registrar, fine — just let us know first so we can coordinate.
- **Don't share the Vercel password.** Anyone with that password can take
  the site offline. If a marketing agency, SEO consultant, or "tech expert"
  asks for it, say no and email us first.
- **Don't accept calls or emails claiming to be from "Google" or "your web
  host" asking for renewal payments.** These are scams. We handle hosting
  and domain renewal — you'll only ever see those bills from *us* through
  your retainer.

---

## Important reminders

> 🚨 **Critical — legal review.** The Privacy Policy, Terms & Conditions, and
> Cookie Policy on your site are templates we drafted in good faith. They are
> **not solicitor-reviewed**. Before relying on them legally, **please have
> a UK solicitor specialising in privacy/data protection review them.**
> Most charges are reasonable for a brochure-site review (~£200–£500). See
> [LEGAL.md](LEGAL.md) for what to bring to that review.
>
> 🚨 **Critical — Google Business Profile.** Update your profile to point at
> your new website (https://business.google.com → your business → Edit
> profile → Website). This is the single biggest action for being found in
> "bakery near me" searches.

---

## Pre-launch checklist (we'll walk through this together on launch day)

```
□ Live URL works in your browser
□ Live URL works on your phone
□ All footer links go to working pages
□ Contact form: submit a real test → email arrives in your inbox
□ Cookie banner appears on first load (try in an incognito window)
□ Open Graph: paste the URL into a WhatsApp chat → preview card appears
□ Address, hours, and contact details are correct
□ All photos look right (no broken images)
□ Spelling, grammar, and tone read as expected
□ Phone number works (if displayed)
□ Domain certificate (the padlock) is present
□ You have all credentials saved in your password manager
□ You have read the legal review reminder above
□ You have updated your Google Business Profile
```

When all boxes are ticked, the site is yours.

---

## Next steps for you

After launch, in the first week:

```
□ Share your website URL on Instagram (bio + a launch post)
□ Update your Google Business Profile to point at the new URL
□ Add the URL to your email signature
□ Send the URL to 5 customers who are likely to give honest feedback
□ Tell your suppliers and neighbours — they'll often link to you
□ Add the URL to any printed materials (cards, takeaway bags, signage)
□ Note any feedback for our first month's change pass
□ Engage a solicitor for the legal page review (don't put this off)
```

---

## What success looks like

| Metric | Realistic at month 3 | Realistic at month 12 |
|---|---|---|
| Visitors per month | 200–500 | 1,500–4,000 |
| Contact form messages per month | 2–8 | 10–25 |
| Google ranking for "Hjem Kensington" | #1 | #1 |
| Google ranking for generic local search ("bakery Kensington") | Top 20 | Top 5 (with active Google Business + reviews) |

These are typical for a small, well-built local-business site. Faster
growth comes from active social, press coverage, and reviews — not from
the site alone.

---

## What to do if something seems wrong

| Situation | What to do |
|---|---|
| Site doesn't load | Email us. We'll check Vercel. |
| Contact form not working | Email us. Note the time + what the visitor saw. |
| Spammy form submissions | Forward one to us. We can tighten defences. |
| Wrong information showing | Email us with the correction. |
| Someone says the site is "broken" on their phone | Ask them which phone + browser. Email us with that detail. |
| Google review tied to the site complaining about something on the site | Email us — we can usually address quickly. |
| Customer asks about the privacy policy specifically | Refer to your solicitor — that's their job, not ours. |

---

## Closing note

This was built with care. We hope you enjoy having it.

If something on it looks wrong, sounds wrong, or feels wrong, tell us — most
fixes are quick. The worst outcome is finding out about a problem six months
in because nobody mentioned it.

Best of luck with Hjem.

— Essam

/**
 * WHAT: The single, typed gateway to environment variables. Every other
 *       file in the app should import `env` from here, not read
 *       `process.env.*` directly.
 *
 * WHY:  Three reasons:
 *       1. Type safety — `env.RATE_LIMIT_MAX` is `number`, not
 *          `string | undefined` like raw process.env.
 *       2. Boot-time validation — if a required var is missing, we
 *          throw a clear error at module load instead of failing
 *          silently when a user submits the contact form three months
 *          later.
 *       3. One place to audit what the app needs. New env var? It
 *          appears in this file's schema or it's not a real env var.
 *
 * IF REMOVED: every consumer would need to repeat parsing logic
 *             (parseInt for numbers, "true"/"false" for booleans),
 *             missing vars would surface only at the moment they were
 *             used — long after deploy — and TypeScript would lose
 *             the type guarantees.
 *
 * COMMON MISTAKE: importing `process.env.NEXT_PUBLIC_GA_ID` directly
 *                 elsewhere in the codebase. The bypass means this
 *                 file's validation gives no protection. ESLint can be
 *                 configured later to forbid this.
 */


// ---------------------------------------------------------------------------
// Schema — the typed shape of validated env. Exported so consumers can
// reference EnvSchema in their own type signatures if needed.
// ---------------------------------------------------------------------------

export type EnvSchema = {
  // Required, public (safe to expose)
  NEXT_PUBLIC_SITE_URL: string;

  // Optional, public — undefined means the related feature is disabled
  NEXT_PUBLIC_GA_ID: string | undefined;
  NEXT_PUBLIC_SENTRY_DSN: string | undefined;

  // Required, server-only
  CONTACT_FORM_TO_EMAIL: string;

  // Optional, server-only — both empty = Resend stub mode (logs, no send)
  CONTACT_FORM_FROM_EMAIL: string | undefined;
  RESEND_API_KEY: string | undefined;

  // Required, parsed to numbers
  RATE_LIMIT_MAX: number;
  RATE_LIMIT_WINDOW_MS: number;

  // Required, parsed to boolean
  COOKIE_CONSENT_REQUIRED: boolean;
};


// ---------------------------------------------------------------------------
// Required-var list. Anything not in this list is optional — its absence
// means the feature it controls is disabled, not that the app is broken.
// ---------------------------------------------------------------------------

const REQUIRED_VARS = [
  "NEXT_PUBLIC_SITE_URL",
  "CONTACT_FORM_TO_EMAIL",
  "RATE_LIMIT_MAX",
  "RATE_LIMIT_WINDOW_MS",
  "COOKIE_CONSENT_REQUIRED",
] as const;


// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Treat undefined, empty string, and whitespace-only string as "missing".
 * Empty .env values are a common foot-gun: developer types `FOO=` instead
 * of `FOO=value`, app boots, FOO is "" — silently broken without this.
 */
function isEmpty(value: string | undefined): boolean {
  return value === undefined || value.trim() === "";
}

/**
 * Read an optional env var. Returns undefined if missing OR empty —
 * NOT empty string. Rest of the app can branch on `if (env.NEXT_PUBLIC_GA_ID)`
 * confidently without checking for empty strings too.
 */
type EnvSource = Record<string, string | undefined>;

function readOptional(
  source: EnvSource,
  name: string,
): string | undefined {
  const value = source[name];
  return isEmpty(value) ? undefined : value;
}

/**
 * Parse a numeric env var. Throws with a specific error message if the
 * string can't be cleanly parsed as a non-negative integer.
 *
 * Why Number() and not parseInt(): parseInt("3xyz") returns 3 (silent
 * data corruption). Number("3xyz") returns NaN. We want the strict
 * version — env vars should be unambiguously numeric or rejected.
 */
function parseInteger(value: string, name: string): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) {
    throw new Error(
      `${name} must be a non-negative integer; received: "${value}"`,
    );
  }
  return n;
}

/**
 * Parse a boolean env var. Accepts "true" / "false" case-insensitively.
 * Anything else is treated as false rather than throwing — env files
 * sometimes have stray comments or whitespace, and a flag erring toward
 * "off" is safer than crashing the boot.
 */
function parseBoolean(value: string): boolean {
  return value.trim().toLowerCase() === "true";
}


// ---------------------------------------------------------------------------
// validate() — the testable core. Pure function: takes any process.env-shaped
// object, returns a typed schema or throws. Tests call this directly with
// custom inputs instead of mutating real process.env.
// ---------------------------------------------------------------------------

export function validate(
  source: EnvSource = process.env,
): EnvSchema {
  // Step 1: collect ALL missing required vars (not just the first) so
  // the error message tells you everything to fix in one go.
  const missing = REQUIRED_VARS.filter((name) => isEmpty(source[name]));
  if (missing.length > 0) {
    throw new Error(
      `Missing required env var(s): ${missing.join(", ")}. ` +
        `Check .env.local for local development, or the Vercel project ` +
        `settings for deployed environments.`,
    );
  }

  // Step 2: parse numeric vars (will throw with a clear message on bad input).
  // Non-null assertions (!) are safe here because the missing-vars check
  // above already proved these are non-empty strings.
  const rateLimitMax = parseInteger(
    source.RATE_LIMIT_MAX!,
    "RATE_LIMIT_MAX",
  );
  const rateLimitWindow = parseInteger(
    source.RATE_LIMIT_WINDOW_MS!,
    "RATE_LIMIT_WINDOW_MS",
  );

  return {
    NEXT_PUBLIC_SITE_URL: source.NEXT_PUBLIC_SITE_URL!,
    NEXT_PUBLIC_GA_ID: readOptional(source, "NEXT_PUBLIC_GA_ID"),
    NEXT_PUBLIC_SENTRY_DSN: readOptional(source, "NEXT_PUBLIC_SENTRY_DSN"),
    CONTACT_FORM_TO_EMAIL: source.CONTACT_FORM_TO_EMAIL!,
    CONTACT_FORM_FROM_EMAIL: readOptional(source, "CONTACT_FORM_FROM_EMAIL"),
    RESEND_API_KEY: readOptional(source, "RESEND_API_KEY"),
    RATE_LIMIT_MAX: rateLimitMax,
    RATE_LIMIT_WINDOW_MS: rateLimitWindow,
    COOKIE_CONSENT_REQUIRED: parseBoolean(source.COOKIE_CONSENT_REQUIRED!),
  };
}


// ---------------------------------------------------------------------------
// env — the singleton. Validates process.env once at module load.
// Anywhere in the app: `import { env } from '@/lib/env'`.
// ---------------------------------------------------------------------------

/**
 * WHY the NODE_ENV !== 'test' guard:
 * Validation runs at module load. If the test runner imports anything
 * that imports this module (which it will, transitively), validation
 * would fire BEFORE any test can stub process.env — crashing the entire
 * test suite even though tests use validate() directly with custom input.
 *
 * The guard makes the singleton an empty placeholder during tests; tests
 * don't read it, so the empty object is never observed.
 *
 * NODE_ENV='production' during `next build` is intentional — it forces
 * env vars to be set in the deploy environment (Vercel) before deploy
 * succeeds.
 */
export const env: EnvSchema =
  process.env.NODE_ENV === "test"
    ? ({} as EnvSchema)
    : validate(process.env);

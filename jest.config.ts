/**
 * WHAT: Jest configuration. Tells Jest how to find tests, what environment
 *       to run them in, what to count toward coverage, and what threshold
 *       to fail builds at.
 * WHY:  Without this, Jest uses defaults that don't match our project
 *       structure (e.g. wouldn't resolve `@/lib/...` imports the way
 *       Next does, wouldn't ignore `.next/`, wouldn't enforce coverage).
 * IF REMOVED: every test file would need to repeat the config inline,
 *             coverage thresholds wouldn't enforce, CI wouldn't fail
 *             on regressions.
 * COMMON MISTAKE: hand-rolling the Babel/SWC transform config. Don't —
 *                 `next/jest` already does it, matching how Next compiles
 *                 the real app. Keeps tests and prod in sync.
 */

import type { Config } from "jest";
import nextJest from "next/jest.js";

/**
 * `nextJest({ dir: "./" })` returns a function that wraps your Jest config
 * with Next-aware defaults: SWC transform, automatic .env.test loading,
 * CSS module mocking, and resolution of next/font etc. in tests.
 */
const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  /**
   * jsdom is the default — most tests render React components, which
   * need a fake browser DOM. Server-only tests (API routes, security
   * headers) override this with a Jest "@jest-environment node" docblock
   * at the top of the test file.
   */
  testEnvironment: "jest-environment-jsdom",

  /**
   * `jest.setup.ts` runs once after Jest's framework loads but before
   * tests run. It registers @testing-library/jest-dom's custom matchers
   * (.toBeInTheDocument(), etc.) and sets up mocks needed across all
   * test files.
   */
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  /**
   * Map TypeScript path aliases the same way next/jest already does —
   * stating it explicitly here makes the rule visible and makes typo
   * errors clearer if someone breaks it.
   */
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  /**
   * Don't try to run tests inside build outputs or dependency trees.
   * Without these excludes, Jest sometimes picks up compiled output and
   * runs duplicates.
   */
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/coverage/",
  ],

  /**
   * `modulePathIgnorePatterns` excludes folders from Jest's module
   * resolver entirely. We need this for /.next/ because `next build`
   * (Phase 5) drops a copy of package.json into .next/standalone/ and
   * Jest's haste-map sees two modules with the same name. Excluding
   * the build output silences the collision warning.
   */
  modulePathIgnorePatterns: [
    "<rootDir>/.next/",
  ],

  /**
   * Where to find tests. Convention: tests live under /tests, mirroring
   * the source folder structure (tests/unit/lib/foo.test.ts tests
   * lib/foo.ts).
   */
  testMatch: [
    "<rootDir>/tests/**/*.test.{ts,tsx}",
  ],

  /**
   * What counts toward coverage. Components, lib utilities, and API
   * routes — not config files, not type-only files, not tests themselves.
   */
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "app/api/**/*.{ts,tsx}",
    "app/actions/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/*.test.{ts,tsx}",
    "!**/index.ts",
  ],

  /**
   * Coverage gates per master prompt: 80% across all four metrics.
   * If a feature drops coverage below this, CI fails — forcing the
   * developer to either write the missing test or remove dead code.
   */
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  /**
   * Cache speeds up subsequent runs significantly. Stored in a folder
   * gitignored by .gitignore.
   */
  cacheDirectory: "<rootDir>/.jest-cache",

  /**
   * Clear mock state between tests so one test's mock setup doesn't
   * leak into the next test's assertions.
   */
  clearMocks: true,
};

export default createJestConfig(config);

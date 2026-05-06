import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Project additions:
    "coverage/**",        // Jest's HTML coverage report (auto-generated)
    ".jest-cache/**",     // Jest's transform cache
    ".husky/_/**",        // Husky's internal helper scripts
  ]),
]);

export default eslintConfig;

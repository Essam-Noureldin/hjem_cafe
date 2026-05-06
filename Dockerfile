# =============================================================================
# Dockerfile — Hjem Kensington
# =============================================================================
# WHAT: A multi-stage build that produces a minimal production image of the
#       Next.js app. Three stages — deps (install), builder (compile),
#       runner (final image with only what's needed to serve).
#
# WHY:  Multi-stage keeps the final image small (~150 MB vs ~1.5 GB if we
#       shipped the whole build environment). Smaller image = faster deploys,
#       smaller attack surface, cheaper bandwidth.
#
# REQUIRES: next.config.ts must have `output: "standalone"` for the runner
#           stage to work. Wired up in Phase 5.
#
# COMMON MISTAKE: copying node_modules from the host into the image. Host
#                 modules might be compiled for macOS/Windows; the image is
#                 Linux. We always run `npm install` inside the container.
# =============================================================================


# ---------- Stage 1: deps ----------------------------------------------------
# Just installs npm dependencies. Cached as a separate layer so changes to
# source code don't force a re-install — only changes to package*.json do.
# ----------------------------------------------------------------------------

FROM node:20-alpine AS deps
WORKDIR /app

# Copy only the manifest files first. If only source code changes (not
# dependencies), Docker reuses this whole layer from cache.
COPY package.json package-lock.json* ./

# `npm ci` is like `npm install` but stricter — it requires a lockfile and
# never updates it. Right choice for builds: deterministic, fast, fails loud
# if the lockfile is out of sync.
RUN npm ci


# ---------- Stage 2: builder -------------------------------------------------
# Takes the installed deps from stage 1 + the source code, runs `next build`,
# and produces the compiled .next/ output.
# ----------------------------------------------------------------------------

FROM node:20-alpine AS builder
WORKDIR /app

# Bring node_modules over from the deps stage instead of reinstalling.
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next telemetry in builds — we don't want our internal CI/build
# runs sending pings to Vercel by default.
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build


# ---------- Stage 3: runner --------------------------------------------------
# The final image. Has only what's strictly required to serve the app:
#   - The Node runtime
#   - The standalone build output (a self-contained server.js + minimal deps)
#   - The static assets (.next/static, public/)
# Everything else (build tools, source code, dev deps) is left behind.
# ----------------------------------------------------------------------------

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create a non-root user. Running as root inside a container is a security
# anti-pattern: if an attacker compromises the app, they shouldn't also
# have root access to the container's filesystem.
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copy the standalone build output. `output: "standalone"` (next.config.ts)
# tells Next to bundle a minimal server.js + only the runtime deps actually
# used into .next/standalone. We copy that whole tree.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

# `node server.js` is what `output: "standalone"` produces. Don't replace
# this with `npm start` — that runs `next start`, which re-reads the full
# .next/ output and won't be present here.
CMD ["node", "server.js"]

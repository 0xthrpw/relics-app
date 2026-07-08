# Build with the repo root as context: docker build .
#
# NEXT_PUBLIC_* values are baked into the client bundle by `next build`, which
# auto-loads the committed .env.production — that file is the single place to
# set public config (API URLs, site URL, feature flags). The deploy platform
# injects only true runtime env (OPENSEA_API_KEY, CACHE_INVALIDATION_TOKEN, ...).

FROM node:20-slim AS builder
WORKDIR /app

# Bun is the package manager (bun.lockb); the official binary from the
# oven/bun image runs fine on the same debian base.
COPY --from=oven/bun:1 /usr/local/bin/bun /usr/local/bin/bun

# vendor/ holds the locally-built ethereum-identity-kit tarball (file: dep) —
# it must exist before install, not just at the `COPY . .` layer.
COPY package.json bun.lockb ./
COPY vendor ./vendor
RUN bun install --frozen-lockfile

COPY . .

# Browser-exposed project IDs, injected as build args by the deploy platform
# (hotbox passes every non-secret variable; only keys declared here reach the
# build). Kept out of the committed .env.production so public-repo scrapers
# don't get them. NEXT_PUBLIC_* values are inlined into the client bundle by
# `next build` — changing any of them means a rebuild.
ARG NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
ARG NEXT_PUBLIC_MAINNET_ALCHEMY_ID
ARG NEXT_PUBLIC_BASE_ALCHEMY_ID
ARG NEXT_PUBLIC_OPTIMISM_ALCHEMY_ID
ARG NEXT_PUBLIC_QUICKNODE_ID
ARG NEXT_PUBLIC_ENS_SUBGRAPH_API_KEY
ARG NEXT_PUBLIC_OPENSEA_API_KEY
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=$NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID \
    NEXT_PUBLIC_MAINNET_ALCHEMY_ID=$NEXT_PUBLIC_MAINNET_ALCHEMY_ID \
    NEXT_PUBLIC_BASE_ALCHEMY_ID=$NEXT_PUBLIC_BASE_ALCHEMY_ID \
    NEXT_PUBLIC_OPTIMISM_ALCHEMY_ID=$NEXT_PUBLIC_OPTIMISM_ALCHEMY_ID \
    NEXT_PUBLIC_QUICKNODE_ID=$NEXT_PUBLIC_QUICKNODE_ID \
    NEXT_PUBLIC_ENS_SUBGRAPH_API_KEY=$NEXT_PUBLIC_ENS_SUBGRAPH_API_KEY \
    NEXT_PUBLIC_OPENSEA_API_KEY=$NEXT_PUBLIC_OPENSEA_API_KEY \
    NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY \
    NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST

# next/font downloads Google fonts (Inter, Sedan SC) during the build and
# self-hosts them — the build needs network access, the runtime doesn't.
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN bun run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
# Also present at runtime: server-side code reads e.g. RELICS_API_URL from
# process.env; platform-injected env always wins over these defaults.
COPY --from=builder --chown=node:node /app/.env.production ./

USER node
ENV PORT=3000 HOSTNAME=0.0.0.0
EXPOSE 3000
CMD ["node", "server.js"]

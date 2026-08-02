# syntax=docker/dockerfile:1
#
# Build from the monorepo root: docker build -f apps/server/Dockerfile .
# Bun workspaces link packages via symlinks into a single root node_modules,
# so `bun install` must see every workspace's package.json up front, and the
# final image must keep the same apps/*, packages/* layout for those
# symlinks to resolve at runtime.

FROM oven/bun:1-alpine AS base
WORKDIR /repo

FROM base AS deps
COPY package.json bun.lock ./
COPY apps/server/package.json apps/server/package.json
COPY apps/client/package.json apps/client/package.json
COPY apps/mock-device/package.json apps/mock-device/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN bun install --frozen-lockfile

FROM deps AS runtime
ENV NODE_ENV=production
COPY packages/shared packages/shared
COPY apps/server apps/server
WORKDIR /repo/apps/server

EXPOSE 4000 4001
CMD ["bun", "src/index.ts"]

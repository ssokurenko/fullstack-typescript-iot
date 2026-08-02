# syntax=docker/dockerfile:1
#
# Build from the monorepo root: docker build -f apps/mock-device/Dockerfile .
# Dev-only fake sensor — useful in docker-compose for a self-contained demo,
# not meant to be deployed anywhere real.

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
COPY apps/mock-device apps/mock-device
WORKDIR /repo/apps/mock-device

CMD ["bun", "src/index.ts"]

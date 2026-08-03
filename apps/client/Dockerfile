# syntax=docker/dockerfile:1
#
# Build from the monorepo root: docker build -f apps/client/Dockerfile .
# Vite bakes VITE_* env vars into the bundle at BUILD time, not runtime — set
# VITE_GRAPHQL_URL via --build-arg to point a built image at your API.

FROM oven/bun:1-alpine AS base
WORKDIR /repo

FROM base AS deps
COPY package.json bun.lock ./
COPY apps/server/package.json apps/server/package.json
COPY apps/client/package.json apps/client/package.json
COPY apps/mock-device/package.json apps/mock-device/package.json
COPY apps/e2e/package.json apps/e2e/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN bun install --frozen-lockfile

FROM deps AS build
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/client apps/client
WORKDIR /repo/apps/client

ARG VITE_GRAPHQL_URL=http://localhost:4000/graphql
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL
RUN bun run build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /repo/apps/client/dist /usr/share/nginx/html
COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

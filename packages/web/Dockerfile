# Debian slim, not Alpine: Prisma's `postinstall` (`prisma generate`)
# needs OpenSSL/glibc that Alpine's musl-based image doesn't ship by
# default, which makes the engine step fail during `npm install` on some
# platforms' build environments (surfaces as a generic "npm install"
# failure with no obviously-Prisma-related error text).
FROM node:20-bookworm-slim AS base
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Prisma needs a syntactically valid DATABASE_URL to generate the client
# (postinstall) and to typecheck during `next build`, even though the build
# never connects to it. The real value is supplied at container runtime via
# docker-compose / the platform's env — this only satisfies the build step.
ARG DATABASE_URL="postgresql://build:build@localhost:5432/build"
ENV DATABASE_URL=${DATABASE_URL}

# @playwright/test pulls in `playwright`, which has its own postinstall
# that downloads browser binaries from an external CDN unless told not to
# — a common cause of Docker build failures on platforms with restricted
# build-time network egress. This image never runs Playwright, so skip it.
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
# Migrations run at container start (not build time) — the real DATABASE_URL
# for a linked Postgres service is only guaranteed to be reachable at
# runtime on platforms like Railway, not during the image build.
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]

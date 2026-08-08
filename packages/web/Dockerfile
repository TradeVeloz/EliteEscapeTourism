FROM node:20-alpine AS base
WORKDIR /app

# Prisma needs a syntactically valid DATABASE_URL to generate the client
# (postinstall) and to typecheck during `next build`, even though the build
# never connects to it. The real value is supplied at container runtime via
# docker-compose / the platform's env — this only satisfies the build step.
ARG DATABASE_URL="postgresql://build:build@localhost:5432/build"
ENV DATABASE_URL=${DATABASE_URL}

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
# Migrations run at container start (not build time) — the real DATABASE_URL
# for a linked Postgres service is only guaranteed to be reachable at
# runtime on platforms like Railway, not during the image build.
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]

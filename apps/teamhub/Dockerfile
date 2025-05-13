# syntax=docker/dockerfile:1.4
FROM node:22-alpine

# Install pnpm and turbo globally (remove pm2)
RUN npm install -g pnpm turbo

WORKDIR /app

# Copy only lockfiles and all package.json files for install caching
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY apps/teamhub/package.json ./apps/teamhub/
COPY packages/teamhub-db/package.json ./packages/teamhub-db/
COPY packages/teamhub-ai/package.json ./packages/teamhub-ai/

# Install dependencies with pnpm, using BuildKit cache for pnpm store
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store pnpm install

# Copy the rest of the code
COPY . .

# Build your Next.js app using the root script (turbo cache enabled by default)
RUN pnpm build:teamhub:prod

EXPOSE 3000

CMD ["pnpm", "start"]

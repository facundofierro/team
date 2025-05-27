# syntax=docker/dockerfile:1.4

# Build stage
FROM node:22-alpine AS builder

# Install pnpm and turbo globally
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

# Production stage
FROM node:22-alpine AS production

# Install pnpm globally (only what we need for production)
RUN npm install -g pnpm

WORKDIR /app

# Copy package files for production install
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY apps/teamhub/package.json ./apps/teamhub/
COPY packages/teamhub-db/package.json ./packages/teamhub-db/
COPY packages/teamhub-ai/package.json ./packages/teamhub-ai/

# Install only production dependencies
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store pnpm install --prod --frozen-lockfile

# Copy built application from builder stage
COPY --from=builder /app/apps/teamhub/.next ./apps/teamhub/.next
COPY --from=builder /app/apps/teamhub/public ./apps/teamhub/public
COPY --from=builder /app/packages ./packages

# Copy any other necessary files
COPY --from=builder /app/apps/teamhub/next.config.mjs ./apps/teamhub/
COPY --from=builder /app/apps/teamhub/package.json ./apps/teamhub/
COPY --from=builder /app/apps/teamhub/middleware.ts ./apps/teamhub/

EXPOSE 3000

CMD ["pnpm", "start"]

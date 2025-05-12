FROM node:22-alpine

# Install pnpm and pm2 globally
RUN npm install -g pnpm pm2

WORKDIR /app

# Copy lockfile, workspace config, and app package.json for install caching
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/teamhub/package.json ./
COPY packages ./packages
COPY apps/teamhub ./
COPY apps/teamhub/tsconfig.json ./

# Install dependencies (will use workspaces)
RUN pnpm install --prod

# Build your Next.js app
RUN ls -l tsconfig.json
RUN pnpm build

EXPOSE 3000

# Start with PM2 in cluster mode (uses all available CPU cores)
CMD ["pm2-runtime", "ecosystem.config.js"]

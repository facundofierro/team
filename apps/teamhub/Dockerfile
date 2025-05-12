FROM node:22-alpine

# Install pnpm and pm2 globally
RUN npm install -g pnpm pm2

WORKDIR /app

# Copy lockfile and workspace config for install caching
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Copy the entire repository, preserving structure
COPY . .

# Set working directory to the app
WORKDIR /app/apps/teamhub

# Install dependencies (will use workspaces)
RUN pnpm install

# Build your Next.js app
RUN pnpm build:teamhub:prod

EXPOSE 3000

# Start with PM2 in cluster mode (uses all available CPU cores)
CMD ["pm2-runtime", "ecosystem.config.js"]

FROM node:22-alpine

# Install pnpm and pm2 globally
RUN npm install -g pnpm pm2

WORKDIR /app

# Copy only the necessary files for install first (for better caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --prod

# Copy the rest of your app
COPY . .

# Build your Next.js app
RUN pnpm build

EXPOSE 3000

# Start with PM2 in cluster mode (uses all available CPU cores)
CMD ["pm2-runtime", "ecosystem.config.js"]

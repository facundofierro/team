FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

COPY ./src ./src

EXPOSE 4000

CMD ["node", "src/index.js"]

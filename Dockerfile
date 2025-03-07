FROM node:lts as builder
WORKDIR /build
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY page/package.json ./page/
RUN npm install -g corepack \
    && corepack enable \
    && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run --recursive build

FROM builder

FROM node:slim as prod-bot
COPY --from=builder /build/backend /build/node_modules /app/
ENV NODE_ENV production
WORKDIR /app/backend
CMD ["node", "./dist/main.js"]

FROM node:slim as prod-page
COPY --from=builder /build/page /app/
WORKDIR /app/page
CMD ["npm", "run", "start"]


FROM node:lts AS builder
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

FROM node:slim AS prod-bot
COPY --from=builder /build/ /app/
ENV NODE_ENV production
WORKDIR /app/backend
CMD ["node", "./dist/index.js"]

FROM node:slim AS prod-page
COPY --from=builder /build/ /app/
WORKDIR /app/page
CMD ["npm", "run", "start"]

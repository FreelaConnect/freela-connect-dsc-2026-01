FROM node:22-alpine AS deps

WORKDIR /app

RUN npm install -g pnpm@10 \
  && pnpm config set dangerouslyAllowAllBuilds true

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY . .
RUN pnpm run build

FROM node:22-alpine AS prod-deps

WORKDIR /app

RUN npm install -g pnpm@10 \
  && pnpm config set dangerouslyAllowAllBuilds true

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV PORT=3002
ENV TYPEORM_SYNCHRONIZE=false

WORKDIR /app

COPY --chown=node:node --from=prod-deps /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node package.json ./

USER node

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3002/health >/dev/null || exit 1

CMD ["node", "dist/main.js"]

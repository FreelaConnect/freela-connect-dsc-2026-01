# Build stage
FROM node:lts-alpine AS builder
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Production stage
FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy built dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Build the application
RUN pnpm run build

# User setup for security
RUN chown -R node /usr/src/app
USER node

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/hello', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["npm", "start"]

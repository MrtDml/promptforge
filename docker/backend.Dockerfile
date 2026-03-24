# ─── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies required for native modules (e.g. bcrypt)
RUN apk add --no-cache python3 make g++

# Copy package manifests and install ALL dependencies (including devDeps for build)
COPY backend/package*.json ./
RUN npm ci

# Copy Prisma schema first so we can generate the client
COPY backend/prisma ./prisma
RUN npx prisma generate

# Copy the rest of the source and build
COPY backend/ .
RUN npm run build

# ─── Stage 2: Production ─────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install runtime-only system deps
RUN apk add --no-cache dumb-init wget

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Copy package manifests and install production deps only
COPY backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy Prisma schema + generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy compiled application
COPY --from=builder /app/dist ./dist

# Use non-root user
USER nestjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=15s --timeout=10s --start-period=60s --retries=5 \
  CMD wget -qO- http://localhost:3001/health || exit 1

# Entrypoint: run migrations then start the server
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

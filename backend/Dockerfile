# ─── Build stage ───────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (layer cache optimisation)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production=false

# Copy source and compile
COPY tsconfig.json ./
COPY src ./src
RUN npx prisma generate && npm run build

# ─── Production stage ──────────────────────────────────────────
FROM node:22-alpine AS production

# dumb-init for proper signal forwarding
RUN apk add --no-cache dumb-init

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Production dependencies only
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production && npm cache clean --force

# Copy compiled app and generated Prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/health/live', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]

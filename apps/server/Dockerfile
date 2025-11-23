# ============================================================================
# Multi-stage Dockerfile for MADLAB Backend API
# Optimized for both development and production
# ============================================================================

# ============================================================================
# Stage 1: Base Image
# ============================================================================
FROM node:20-alpine AS base

WORKDIR /app

# Install production dependencies only
RUN apk add --no-cache \
    tini \
    dumb-init

# ============================================================================
# Stage 2: Dependencies
# ============================================================================
FROM base AS dependencies

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# ============================================================================
# Stage 3: Build
# ============================================================================
FROM dependencies AS build

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# ============================================================================
# Stage 4: Development
# ============================================================================
FROM dependencies AS development

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Use tini for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start development server with hot reload
CMD ["npm", "run", "dev"]

# ============================================================================
# Stage 5: Production
# ============================================================================
FROM base AS production

# Set NODE_ENV
ENV NODE_ENV=production

# Copy package files and install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start production server
CMD ["node", "dist/index.js"]

# ============================================================================
# Multi-stage Dockerfile for MADLAB Frontend Client
# Optimized for both development and production
# ============================================================================

# ============================================================================
# Stage 1: Base Image
# ============================================================================
FROM node:20-alpine AS base

WORKDIR /app

# ============================================================================
# Stage 2: Dependencies
# ============================================================================
FROM base AS dependencies

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# ============================================================================
# Stage 3: Build
# ============================================================================
FROM dependencies AS build

# Copy source code
COPY . .

# Build application
RUN npm run build

# ============================================================================
# Stage 4: Development
# ============================================================================
FROM dependencies AS development

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ============================================================================
# Stage 5: Production (Nginx)
# ============================================================================
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

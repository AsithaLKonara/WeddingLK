# Perfect Dockerfile for WeddingLK Next.js Application
# Uses Debian-based image to avoid Alpine compilation issues

# Use Node.js 20 Debian slim for better compatibility
FROM node:20-slim AS base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies with better error handling
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --legacy-peer-deps --no-audit --no-fund

# Copy source code
COPY . .

# Disable telemetry and set build environment
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Set build-time environment variables to avoid build errors
ENV MONGODB_URI="mongodb://localhost:27017/weddinglk"
ENV NEXTAUTH_URL="http://localhost:3000"
ENV NEXTAUTH_SECRET="build-secret"
ENV OPENAI_API_KEY="build-key"

# Build the application
RUN npm run build

# Create production stage
FROM node:20-slim AS production

# Install only essential runtime dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --only=production --legacy-peer-deps --no-audit --no-fund

# Copy built application from build stage
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.mjs ./
COPY --from=base /app/middleware.ts ./
COPY --from=base /app/tailwind.config.js ./

# Create non-root user for security
RUN groupadd -r nextjs && useradd -r -g nextjs nextjs

# Set proper permissions
RUN chown -R nextjs:nextjs /app && \
    chmod -R 755 /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check with proper error handling
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "start"] 
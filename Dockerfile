# Multi-stage build for WeddingLK Next.js application with MongoDB
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Install system dependencies including MongoDB
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    git \
    mongodb \
    mongodb-tools

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies
RUN \
  if [ -f package-lock.json ]; then npm ci --only=production --legacy-peer-deps; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile --legacy-peer-deps; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install MongoDB for build stage
RUN apk add --no-cache mongodb mongodb-tools

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install MongoDB and create necessary directories
RUN apk add --no-cache \
    mongodb \
    mongodb-tools \
    && mkdir -p /data/db \
    && mkdir -p /var/log/mongodb \
    && chown -R nobody:nobody /data/db \
    && chown -R nobody:nobody /var/log/mongodb

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Set up Next.js cache directory
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy MongoDB configuration
COPY --from=builder /app/mongod.conf /etc/mongod.conf

# Copy startup script
COPY --from=builder /app/start.sh /start.sh
RUN chmod +x /start.sh

# Expose ports
EXPOSE 3000 27017

# Set environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV MONGODB_URI="mongodb://localhost:27017/weddinglk"

# Start the application with MongoDB
CMD ["/start.sh"] 
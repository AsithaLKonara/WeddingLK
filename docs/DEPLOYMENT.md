# 🚀 Deployment Guide - WeddingLK NextJS

Complete guide to deploying the WeddingLK platform across different environments.

## 🎯 Overview

### Deployment Environments
- **Development**: Local development with hot reload
- **Staging**: Pre-production testing environment
- **Production**: Live production environment

### Deployment Methods
- **Docker**: Containerized deployment
- **PM2**: Process management deployment
- **Vercel**: Serverless deployment (optional)
- **Traditional**: Direct server deployment

## 🐳 Docker Deployment

### Prerequisites
- Docker installed
- Docker Compose installed
- Environment variables configured

### Quick Start
```bash
# Build the image
docker build -t weddinglk-nextjs .

# Run the container
docker run -p 3000:3000 \
  -e MONGODB_URI=your-mongodb-uri \
  -e NEXTAUTH_SECRET=your-secret \
  weddinglk-nextjs

# Using Docker Compose
docker-compose up -d
```

### Dockerfile
```dockerfile
# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/weddinglk
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    restart: unless-stopped

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mongo_data:
  redis_data:
```

## 🔧 PM2 Deployment

### Installation
```bash
# Install PM2 globally
npm install -g pm2

# Install PM2 ecosystem
pm2 install pm2-logrotate
```

### Ecosystem Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'weddinglk-nextjs',
      script: 'npm',
      args: 'start',
      cwd: '/path/to/your/app',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-org/weddinglk-asitha.git',
      path: '/var/www/weddinglk',
      'pre-deploy-local': '',
      'post-deploy': 'npm install --legacy-peer-deps && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
```

### PM2 Commands
```bash
# Start the application
pm2 start ecosystem.config.js

# Start in production mode
pm2 start ecosystem.config.js --env production

# Monitor applications
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart weddinglk-nextjs

# Stop application
pm2 stop weddinglk-nextjs

# Delete application
pm2 delete weddinglk-nextjs

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

## 🌐 Nginx Configuration

### Reverse Proxy Setup
```nginx
# /etc/nginx/sites-available/weddinglk
upstream weddinglk_backend {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Client Max Body Size
    client_max_body_size 50M;

    # Proxy Configuration
    location / {
        proxy_pass http://weddinglk_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static Files
    location /_next/static/ {
        alias /var/www/weddinglk/.next/static/;
        expires 365d;
        access_log off;
    }

    # API Routes
    location /api/ {
        proxy_pass http://weddinglk_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health Check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### SSL Certificate Setup
```bash
# Generate SSL certificate with Let's Encrypt
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add this line for auto-renewal
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔐 Environment Configuration

### Production Environment Variables
```env
# Application
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# Database
MONGODB_URI=mongodb://username:password@host:port/database
REDIS_URL=redis://username:password@host:port

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-domain.com

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Payment
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

### Environment-Specific Configs
```bash
# Development
cp .env.example .env.local

# Staging
cp .env.example .env.staging

# Production
cp .env.example .env.production
```

## 📊 Monitoring and Logging

### PM2 Monitoring
```bash
# Install PM2 monitoring
pm2 install pm2-server-monit

# View monitoring dashboard
pm2 monit

# View logs
pm2 logs --lines 100
pm2 logs weddinglk-nextjs --err
pm2 logs weddinglk-nextjs --out
```

### Application Logging
```typescript
// lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'weddinglk-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### Health Checks
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check database connection
    const dbStatus = await checkDatabaseConnection();
    
    // Check Redis connection
    const redisStatus = await checkRedisConnection();
    
    // Check external services
    const externalStatus = await checkExternalServices();
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      services: {
        database: dbStatus,
        redis: redisStatus,
        external: externalStatus
      }
    };
    
    const isHealthy = dbStatus && redisStatus && externalStatus;
    
    return NextResponse.json(healthStatus, {
      status: isHealthy ? 200 : 503
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 503 });
  }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci --legacy-peer-deps
      
      - name: Run tests
        run: npm run test:all
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /var/www/weddinglk
            git pull origin main
            npm install --legacy-peer-deps
            npm run build
            pm2 reload ecosystem.config.js --env production
      
      - name: Health check
        run: |
          sleep 30
          curl -f https://your-domain.com/health || exit 1
```

### Deployment Scripts
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Starting deployment..."

# Pull latest changes
git pull origin main

# Install dependencies
npm install --legacy-peer-deps

# Run tests
npm run test:all

# Build application
npm run build

# Reload PM2
pm2 reload ecosystem.config.js --env production

# Health check
echo "🔍 Performing health check..."
sleep 10
curl -f http://localhost:3000/health

echo "✅ Deployment completed successfully!"
```

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm start
```

#### Memory Issues
```bash
# Check memory usage
pm2 monit

# Restart with memory limit
pm2 restart weddinglk-nextjs --max-memory-restart 1G

# Check system memory
free -h
```

#### Database Connection Issues
```bash
# Test MongoDB connection
mongo your-database-uri

# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod
```

#### SSL Certificate Issues
```bash
# Check SSL certificate
openssl x509 -in /etc/nginx/ssl/cert.pem -text -noout

# Renew Let's Encrypt certificate
sudo certbot renew

# Test Nginx configuration
sudo nginx -t
```

### Performance Optimization

#### Database Optimization
```javascript
// Enable MongoDB query logging
mongoose.set('debug', true);

// Use database indexes
db.users.createIndex({ email: 1 });
db.vendors.createIndex({ category: 1, rating: -1 });
db.bookings.createIndex({ date: 1, status: 1 });
```

#### Caching Strategy
```javascript
// Redis caching for frequently accessed data
const cacheKey = `vendor:${vendorId}`;
let vendor = await redis.get(cacheKey);

if (!vendor) {
  vendor = await Vendor.findById(vendorId);
  await redis.setex(cacheKey, 3600, JSON.stringify(vendor));
}
```

#### Image Optimization
```typescript
// Next.js Image component with optimization
import Image from 'next/image';

<Image
  src="/vendor-image.jpg"
  alt="Vendor"
  width={400}
  height={300}
  priority={true}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer (HAProxy, Nginx)
- Multiple application instances
- Database read replicas
- Redis cluster for caching

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement efficient caching
- Use CDN for static assets

### Microservices Architecture
- Split into smaller services
- API gateway pattern
- Service discovery
- Event-driven communication

---

**For more information, see the main [README.md](../README.md) or contact the DevOps team.** 
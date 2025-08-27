# WeddingLK Production Deployment Guide

## Overview
This guide covers the production deployment of WeddingLK using Docker, Nginx, MongoDB, Redis, and monitoring tools.

## Prerequisites
- Docker and Docker Compose installed
- At least 2GB RAM available
- Ports 80, 443, 3000, 27017, 6379, 9090, 3001 available

## Quick Start

### 1. Build and Deploy
```bash
# Make script executable (first time only)
chmod +x scripts/build-production.sh

# Run production deployment
./scripts/build-production.sh
```

### 2. Manual Deployment
```bash
# Build production image
docker build -f Dockerfile.production -t weddinglk:production .

# Start services
docker-compose -f docker-compose.production.yml up -d

# Check status
docker-compose -f docker-compose.production.yml ps
```

## Services

### Application (Next.js)
- **Port**: 3000
- **Health Check**: `/api/health`
- **Resource Limits**: 1GB RAM, 0.5 CPU

### Nginx (Reverse Proxy)
- **Ports**: 80 (HTTP), 443 (HTTPS)
- **SSL**: Self-signed certificates
- **Features**: Rate limiting, compression, caching

### MongoDB
- **Port**: 27017
- **Database**: weddinglk_prod
- **Credentials**: admin/password123

### Redis
- **Port**: 6379
- **Purpose**: Caching and sessions

### Prometheus
- **Port**: 9090
- **Purpose**: Metrics collection

### Grafana
- **Port**: 3001
- **Credentials**: admin/admin123
- **Purpose**: Monitoring dashboards

## Configuration

### Environment Variables
Copy `env.production` to `.env.local` and update values:
```bash
cp env.production .env.local
# Edit .env.local with your actual values
```

### SSL Certificates
Self-signed certificates are generated automatically. For production:
1. Replace `nginx/ssl/cert.pem` and `nginx/ssl/key.pem`
2. Update `nginx/conf.d/default.conf` if needed

### Database
- MongoDB data persists in `mongodb_data` volume
- Redis data persists in `redis_data` volume

## Monitoring

### Health Checks
- Application: `http://localhost:3000/api/health`
- Nginx: `http://localhost/health`

### Metrics
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001`

### Logs
```bash
# View all logs
docker-compose -f docker-compose.production.yml logs

# View specific service logs
docker-compose -f docker-compose.production.yml logs app
docker-compose -f docker-compose.production.yml logs nginx
```

## Performance Optimization

### Docker Build
- Multi-stage build for smaller images
- Layer caching for faster builds
- Production-only dependencies

### Application
- Next.js standalone output
- Image optimization enabled
- CSS and package optimization
- Gzip compression

### Nginx
- HTTP/2 support
- Static file caching
- Rate limiting
- Security headers

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process if needed
kill -9 <PID>
```

#### Container Health Issues
```bash
# Check container status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs app

# Restart service
docker-compose -f docker-compose.production.yml restart app
```

#### SSL Issues
```bash
# Regenerate SSL certificates
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Restart Nginx
docker-compose -f docker-compose.production.yml restart nginx
```

### Performance Issues
1. Check resource usage: `docker stats`
2. Monitor logs for errors
3. Verify database connections
4. Check Redis cache hit rates

## Security

### Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: enabled
- Referrer-Policy: strict-origin-when-cross-origin

### Rate Limiting
- API: 10 requests/second
- Login: 5 requests/minute

### SSL/TLS
- TLS 1.2 and 1.3 only
- Strong cipher suites
- HSTS headers

## Backup and Recovery

### Database Backup
```bash
# MongoDB backup
docker exec weddinglk_mongodb mongodump --out /backup

# Redis backup
docker exec weddinglk_redis redis-cli BGSAVE
```

### Volume Backup
```bash
# Backup volumes
docker run --rm -v weddinglk_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb_backup.tar.gz -C /data .
```

## Scaling

### Horizontal Scaling
```bash
# Scale application instances
docker-compose -f docker-compose.production.yml up -d --scale app=3
```

### Load Balancer
Add HAProxy or Traefik in front of multiple app instances.

## Updates

### Application Updates
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.production.yml down
docker build -f Dockerfile.production -t weddinglk:production .
docker-compose -f docker-compose.production.yml up -d
```

### Database Migrations
Run migrations before updating the application:
```bash
# Example migration script
docker exec weddinglk_app npm run migrate
```

## Support

For issues or questions:
1. Check logs first
2. Verify configuration
3. Test individual services
4. Check resource usage
5. Review security settings

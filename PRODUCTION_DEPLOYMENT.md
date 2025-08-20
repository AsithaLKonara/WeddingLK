# 🚀 WeddingLK Production Deployment Guide

This guide covers the complete production deployment of your WeddingLK application with load balancing, caching, monitoring, and CI/CD.

## 📋 **Prerequisites**

- Docker & Docker Compose installed
- At least 4GB RAM available
- 20GB disk space
- Git repository access
- Domain name (for production)

## 🏗️ **Architecture Overview**

```
Internet → Nginx (Load Balancer) → App1:3000, App2:3000, App3:3000 → MongoDB + Redis
                                    ↓
                            Monitoring Stack (Prometheus + Grafana + cAdvisor)
```

## 🚀 **Quick Start**

### 1. **Clone and Setup**
```bash
git clone <your-repo>
cd wedding-lk-asitha
cp env.production.example env.production
# Edit env.production with your production values
```

### 2. **Deploy Production Stack**
```bash
# Make deployment script executable
chmod +x scripts/deploy-production.sh

# Full production deployment
./scripts/deploy-production.sh deploy

# Or step by step:
./scripts/deploy-production.sh health      # Check health
./scripts/deploy-production.sh test        # Run tests
./scripts/deploy-production.sh monitor     # Show monitoring
./scripts/deploy-production.sh logs        # Follow logs
```

### 3. **Access Your Application**
- **Main App**: http://localhost
- **Grafana**: http://localhost:3001 (admin/admin123)
- **Prometheus**: http://localhost:9090
- **cAdvisor**: http://localhost:8080

## 🔧 **Configuration**

### **Environment Variables** (`env.production`)
```bash
# App Configuration
NODE_ENV=production
PORT=3000
TRUST_PROXY=1

# Database
MONGODB_URI=mongodb://admin:password123@mongo:27017/weddinglk?authSource=admin
MAX_POOL_SIZE=50
MIN_POOL_SIZE=10

# Redis
REDIS_URL=redis://redis:6379

# Security
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120
```

### **Docker Compose Services**
- **app1, app2, app3**: Next.js application replicas with PM2 clustering
- **nginx**: Reverse proxy with load balancing and rate limiting
- **redis**: Distributed caching
- **mongo**: Database (use MongoDB Atlas in production)
- **prometheus**: Metrics collection
- **grafana**: Monitoring dashboards
- **cadvisor**: Container metrics

## 📊 **Performance Monitoring**

### **Grafana Dashboards**
1. **Application Metrics**
   - Request rates and response times
   - Error rates and status codes
   - Cache hit rates

2. **Infrastructure Metrics**
   - CPU and memory usage
   - Network I/O
   - Disk usage

3. **Database Metrics**
   - Query performance
   - Connection pool status
   - Slow query analysis

### **Key Metrics to Monitor**
- **Response Time**: P95 < 1000ms, P99 < 2000ms
- **Error Rate**: < 1%
- **Cache Hit Rate**: > 80%
- **CPU Usage**: < 80%
- **Memory Usage**: < 85%

## 🧪 **Load Testing**

### **Run Load Tests**
```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery run tests/load/load-test.yml

# Run with specific environment
artillery run tests/load/load-test.yml --environment production
```

### **Load Test Scenarios**
- **Warm-up**: 5 req/s for 1 minute
- **Ramp-up**: 10 req/s for 2 minutes
- **Sustained**: 25 req/s for 5 minutes
- **Peak**: 50 req/s for 2 minutes
- **Cool-down**: 10 req/s for 1 minute

## 🔄 **CI/CD Pipeline**

### **GitHub Actions** (`.github/workflows/deploy.yml`)
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to server
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /srv/weddinglk
            git pull origin main
            ./scripts/deploy-production.sh deploy
```

### **Manual Deployment Commands**
```bash
# Build and deploy
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d

# Scale services
docker-compose -f docker-compose.production.yml up -d --scale app1=2 --scale app2=2 --scale app3=2

# Rolling restart (zero downtime)
docker-compose -f docker-compose.production.yml up -d --no-deps app1
docker-compose -f docker-compose.production.yml up -d --no-deps app2
docker-compose -f docker-compose.production.yml up -d --no-deps app3
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Services Not Starting**
```bash
# Check logs
docker-compose -f docker-compose.production.yml logs app1
docker-compose -f docker-compose.production.yml logs nginx

# Check health
./scripts/deploy-production.sh health
```

#### **2. Performance Issues**
```bash
# Check resource usage
docker stats

# Monitor metrics
./scripts/deploy-production.sh monitor

# Run performance test
./scripts/deploy-production.sh test
```

#### **3. Database Connection Issues**
```bash
# Check MongoDB status
docker-compose -f docker-compose.production.yml exec mongo mongosh --eval "db.adminCommand('ping')"

# Check connection pool
docker-compose -f docker-compose.production.yml exec app1 node -e "console.log(require('mongoose').connection.pool.status())"
```

### **Log Analysis**
```bash
# Follow all logs
docker-compose -f docker-compose.production.yml logs -f

# Follow specific service
docker-compose -f docker-compose.production.yml logs -f app1

# Search logs
docker-compose -f docker-compose.production.yml logs | grep "ERROR"
```

## 🔒 **Security Hardening**

### **Production Security Checklist**
- [ ] HTTPS/TLS enabled
- [ ] Rate limiting configured
- [ ] Security headers set
- [ ] Non-root containers
- [ ] Secrets management
- [ ] Regular security updates
- [ ] Access logging enabled
- [ ] Backup strategy implemented

### **SSL/TLS Setup**
```bash
# Using Let's Encrypt
docker run -it --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v /var/lib/letsencrypt:/var/lib/letsencrypt \
  certbot/certbot certonly \
  --standalone \
  -d yourdomain.com
```

## 📈 **Scaling**

### **Vertical Scaling**
```bash
# Increase container resources
docker-compose -f docker-compose.production.yml up -d \
  --scale app1=1 --scale app2=1 --scale app3=1 \
  --scale nginx=1
```

### **Horizontal Scaling**
```bash
# Add more app replicas
docker-compose -f docker-compose.production.yml up -d \
  --scale app1=3 --scale app2=3 --scale app3=3
```

### **Database Scaling**
- Use MongoDB Atlas with auto-scaling
- Implement read replicas
- Add connection pooling

## 🗄️ **Backup & Recovery**

### **Database Backup**
```bash
# Create backup
docker-compose -f docker-compose.production.yml exec mongo \
  mongodump --out /backup/$(date +%Y%m%d_%H%M%S)

# Restore backup
docker-compose -f docker-compose.production.yml exec mongo \
  mongorestore /backup/backup_folder/
```

### **Application Backup**
```bash
# Backup configuration
cp docker-compose.production.yml docker-compose.production.backup.yml
cp env.production env.production.backup

# Restore
cp docker-compose.production.backup.yml docker-compose.production.yml
cp env.production.backup env.production
```

## 📚 **Additional Resources**

### **Documentation**
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Prometheus Monitoring](https://prometheus.io/docs/)
- [Grafana Dashboards](https://grafana.com/docs/)

### **Support**
- Check application logs for errors
- Monitor Grafana dashboards
- Use load testing to identify bottlenecks
- Review performance metrics regularly

## 🎯 **Performance Targets**

| Metric | Target | Current | Status |
|--------|--------|---------|---------|
| **API Response Time** | < 1000ms | ~13,800ms | ⚠️ Needs Work |
| **Cache Hit Rate** | > 80% | TBD | 📊 Monitoring |
| **Error Rate** | < 1% | TBD | 📊 Monitoring |
| **Uptime** | > 99.9% | TBD | 📊 Monitoring |

## 🚀 **Next Steps**

1. **Immediate**: Deploy and test the production stack
2. **Short-term**: Optimize remaining slow endpoints
3. **Medium-term**: Implement Redis clustering
4. **Long-term**: Move to Kubernetes for advanced orchestration

---

**Your WeddingLK application is now ready for production deployment with enterprise-grade features!** 🎉 
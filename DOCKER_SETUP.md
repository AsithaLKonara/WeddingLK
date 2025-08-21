# 🐳 WEDDINGLK DOCKER SETUP GUIDE

## 🚀 **COMPLETE PRODUCTION-READY DOCKER STACK**

### **🏗️ Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx (80/443)│────│  Next.js App   │────│   MongoDB      │
│   Load Balancer │    │   (Port 3000)  │    │   (Port 27017) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         │              ┌─────────────────┐    ┌─────────────────┐
         │              │     Redis       │    │  Mongo Express  │
         │              │   (Port 6379)   │    │   (Port 8081)  │
         │              └─────────────────┘    └─────────────────┘
         │                       │
         │              ┌─────────────────┐
         │              │ Redis Commander │
         │              │   (Port 8082)   │
         │              └─────────────────┘
         │
┌─────────────────┐
│   SSL Certs     │
│   (Self-signed) │
└─────────────────┘
```

### **📁 File Structure**

```
weddinglk-asitha/
├── Dockerfile                    # Production Next.js app
├── docker-compose.yml            # Complete stack orchestration
├── nginx/
│   ├── nginx.conf               # Nginx configuration
│   └── ssl/                     # SSL certificates
│       ├── cert.pem
│       └── key.pem
├── scripts/
│   └── init-mongo.js            # MongoDB initialization
├── build-production.sh           # Build script
├── env.development              # Development environment
└── env.production               # Production environment
```

### **🔧 Services Included**

1. **Nginx (Port 80/443)**
   - Load balancing & reverse proxy
   - SSL termination
   - Rate limiting
   - Gzip compression
   - Security headers

2. **Next.js Application (Port 3000)**
   - Frontend + Backend
   - Production optimized
   - Health checks
   - Volume mounts for uploads/logs

3. **MongoDB (Port 27017)**
   - Database with authentication
   - Performance indexes
   - Health checks
   - Persistent data

4. **Redis (Port 6379)**
   - Caching layer
   - Memory optimization
   - Health checks
   - Persistent data

5. **Mongo Express (Port 8081)**
   - Database management UI
   - Authentication required
   - Health checks

6. **Redis Commander (Port 8082)**
   - Redis management UI
   - Real-time monitoring

### **🚀 Quick Start**

#### **Option 1: Automated Build (Recommended)**
```bash
# Make script executable
chmod +x build-production.sh

# Run complete build
./build-production.sh
```

#### **Option 2: Manual Build**
```bash
# 1. Create SSL certificates
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/key.pem \
    -out nginx/ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=WeddingLK/CN=localhost"

# 2. Set permissions
chmod 600 nginx/ssl/key.pem
chmod 644 nginx/ssl/cert.pem

# 3. Build and start
docker-compose build --no-cache
docker-compose up -d
```

### **🌐 Access URLs**

- **Main Application**: https://localhost
- **MongoDB Express**: http://localhost:8081
- **Redis Commander**: http://localhost:8082
- **Health Check**: https://localhost/api/health

### **🔐 Default Credentials**

- **MongoDB**: admin / password123
- **Mongo Express**: admin / admin123
- **Redis**: No authentication (internal network)

### **📊 Health Monitoring**

All services include health checks:
- **Nginx**: HTTP health endpoint
- **App**: API health endpoint
- **MongoDB**: Database ping
- **Redis**: Connection test

### **🔒 Security Features**

- SSL/TLS encryption
- Rate limiting
- Security headers
- Internal network isolation
- Authentication required for admin tools

### **💾 Data Persistence**

- **MongoDB**: `mongodb_data` volume
- **Redis**: `redis_data` volume
- **App**: `app_uploads`, `app_logs` volumes
- **Nginx**: `nginx_logs`, `nginx_cache` volumes

### **📝 Environment Configuration**

#### **Development**
```bash
cp env.development .env
# Edit .env with your values
```

#### **Production**
```bash
cp env.production .env
# Edit .env with your production values
```

### **🛠️ Management Commands**

```bash
# View logs
docker-compose logs -f [service-name]

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Update and rebuild
docker-compose pull
docker-compose build --no-cache
docker-compose up -d

# View resource usage
docker stats

# Access containers
docker exec -it weddinglk-app sh
docker exec -it weddinglk-mongodb mongosh
docker exec -it weddinglk-redis redis-cli
```

### **🔍 Troubleshooting**

#### **Common Issues**

1. **Port conflicts**: Ensure ports 80, 443, 8081, 8082 are free
2. **SSL errors**: Accept self-signed certificate in browser
3. **Permission errors**: Check SSL certificate permissions
4. **Memory issues**: Ensure Docker has enough RAM (4GB+)

#### **Debug Commands**

```bash
# Check container status
docker-compose ps

# Check service health
docker-compose exec nginx wget --quiet --tries=1 --spider http://localhost/nginx-health
docker-compose exec app curl -f http://localhost:3000/api/health
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
docker-compose exec redis redis-cli ping

# View logs
docker-compose logs nginx
docker-compose logs app
docker-compose logs mongodb
docker-compose logs redis
```

### **📈 Performance Optimizations**

- **Nginx**: Gzip compression, caching, rate limiting
- **MongoDB**: Performance indexes, connection pooling
- **Redis**: Memory optimization, LRU eviction
- **App**: Production build, health checks

### **🚀 Production Deployment**

1. Update `env.production` with real values
2. Use real SSL certificates
3. Configure domain names
4. Set up monitoring
5. Configure backups

### **🎯 Benefits of This Setup**

- **Production-ready**: Enterprise-grade configuration
- **Scalable**: Easy to add more app instances
- **Secure**: SSL, authentication, rate limiting
- **Monitored**: Health checks for all services
- **Maintainable**: Clear separation of concerns
- **Performance**: Optimized for speed and reliability

---

**🎉 Your WeddingLK application is now running with a world-class Docker infrastructure!** 
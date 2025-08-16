# 🐳 Docker Setup for WeddingLK

This guide covers how to containerize and run the WeddingLK application using Docker.

## 🚀 Quick Start

### 1. Build Docker Images

```bash
# Build all images (development and production)
./scripts/docker-build.sh

# Or build specific images
./scripts/docker-build.sh dev    # Development only
./scripts/docker-build.sh prod   # Production only
```

### 2. Start Services

```bash
# Start development environment (default)
./scripts/docker-manage.sh start

# Start production environment
./scripts/docker-manage.sh start prod

# Start with default docker-compose
docker-compose up -d
```

### 3. Access the Application

- **WeddingLK App**: http://localhost:3000
- **MongoDB Express**: http://localhost:8081 (admin/admin)
- **MongoDB**: localhost:27017

## 📁 Docker Files Structure

```
├── Dockerfile                    # Multi-stage Docker build
├── docker-compose.yml           # Main compose file
├── docker-compose.dev.yml       # Development environment
├── docker-compose.prod.yml      # Production environment
├── .dockerignore                # Docker build exclusions
├── scripts/
│   ├── docker-build.sh         # Build script
│   ├── docker-manage.sh        # Management script
│   └── mongo-init.js           # MongoDB initialization
└── app/api/health/route.ts     # Health check endpoint
```

## 🏗️ Multi-Stage Docker Build

The Dockerfile uses multi-stage builds for optimization:

### Stages:
- **base**: Common dependencies and setup
- **development**: Development environment with hot reloading
- **builder**: Build the Next.js application
- **production**: Production runtime with minimal dependencies

### Benefits:
- Smaller production images
- Faster builds with layer caching
- Development and production from same Dockerfile

## 🔧 Docker Compose Configurations

### Development Environment (`docker-compose.dev.yml`)

```yaml
services:
  mongodb:          # MongoDB 7.0 with authentication
  weddinglk-dev:    # Development app with hot reloading
  mongo-express:    # MongoDB admin UI
  redis:            # Caching layer
```

**Features:**
- Hot reloading for development
- Volume mounting for live code changes
- MongoDB Express for database management
- Redis for caching

### Production Environment (`docker-compose.prod.yml`)

```yaml
services:
  mongodb:          # MongoDB with resource limits
  weddinglk:        # Production app
  nginx:            # Reverse proxy (optional)
```

**Features:**
- Optimized production build
- Resource limits and health checks
- Optional Nginx reverse proxy
- Production-ready MongoDB configuration

## 🛠️ Management Scripts

### Docker Build Script (`scripts/docker-build.sh`)

```bash
# Build all images
./scripts/docker-build.sh

# Build specific image
./scripts/docker-build.sh dev
./scripts/docker-build.sh prod
```

### Docker Management Script (`scripts/docker-manage.sh`)

```bash
# Start services
./scripts/docker-manage.sh start [dev|prod]

# Stop services
./scripts/docker-manage.sh stop [dev|prod]

# Restart services
./scripts/docker-manage.sh restart [dev|prod]

# Show status
./scripts/docker-manage.sh status

# Show logs
./scripts/docker-manage.sh logs [SERVICE]

# Clean up resources
./scripts/docker-manage.sh clean

# Seed database
./scripts/docker-manage.sh seed

# Show help
./scripts/docker-manage.sh help
```

## 🌍 Environment Variables

### Required Environment Variables

```bash
# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=weddinglk123

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OpenAI (optional)
OPENAI_API_KEY=your-openai-api-key
```

### Environment File Setup

Create `.env` file:

```env
# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=weddinglk123

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Production overrides
NEXTAUTH_URL=https://yourdomain.com
```

## 🚀 Running the Application

### Development Mode

```bash
# 1. Build development image
./scripts/docker-build.sh dev

# 2. Start development services
./scripts/docker-manage.sh start dev

# 3. Access the application
open http://localhost:3000
```

### Production Mode

```bash
# 1. Build production image
./scripts/docker-build.sh prod

# 2. Start production services
./scripts/docker-manage.sh start prod

# 3. Access the application
open http://localhost:3000
```

### With Nginx (Production)

```bash
# Start with Nginx reverse proxy
docker-compose -f docker-compose.prod.yml --profile nginx up -d
```

## 📊 Monitoring and Health Checks

### Health Check Endpoint

- **URL**: `/api/health`
- **Method**: GET
- **Response**: Application status, database connection, memory usage

### Container Health Checks

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Monitoring Commands

```bash
# Check container status
./scripts/docker-manage.sh status

# View logs
./scripts/docker-manage.sh logs weddinglk-dev

# Monitor resources
docker stats weddinglk-dev-app
```

## 🗄️ Database Management

### MongoDB Access

```bash
# Connect to MongoDB container
docker exec -it weddinglk-mongodb mongosh -u admin -p weddinglk123

# Access MongoDB Express UI
open http://localhost:8081
# Username: admin, Password: weddinglk123
```

### Database Seeding

```bash
# Seed with test data
./scripts/docker-manage.sh seed

# Or manually
docker exec weddinglk-dev-app npm run seed:comprehensive
```

### Database Backup

```bash
# Backup MongoDB
docker exec weddinglk-mongodb mongodump --out /data/backup

# Copy backup from container
docker cp weddinglk-mongodb:/data/backup ./backup
```

## 🔒 Security Features

### Non-Root User

- Application runs as non-root user (`nextjs`)
- Proper file permissions
- Minimal system dependencies

### Network Isolation

- Custom Docker networks
- Service-to-service communication only
- Port exposure only where needed

### Environment Variable Security

- No hardcoded secrets
- Environment-specific configurations
- Production-ready security practices

## 📈 Performance Optimization

### Multi-Stage Builds

- Reduced image size
- Faster deployment
- Better caching

### Resource Limits

```yaml
deploy:
  resources:
    limits:
      memory: 1G
    reservations:
      memory: 512M
```

### Health Checks

- Automatic container restart on failure
- Load balancer integration
- Monitoring and alerting

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Conflicts

```bash
# Check what's using port 3000
lsof -i :3000

# Use different port
docker-compose -f docker-compose.dev.yml up -d
```

#### 2. Database Connection Issues

```bash
# Check MongoDB status
docker logs weddinglk-mongodb

# Restart MongoDB
docker restart weddinglk-mongodb
```

#### 3. Build Failures

```bash
# Clean up and rebuild
./scripts/docker-manage.sh clean
./scripts/docker-build.sh
```

#### 4. Permission Issues

```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Rebuild with proper permissions
./scripts/docker-build.sh
```

### Debug Commands

```bash
# View all logs
docker-compose -f docker-compose.dev.yml logs

# Follow specific service logs
docker-compose -f docker-compose.dev.yml logs -f weddinglk-dev

# Check container health
docker ps --format "table {{.Names}}\t{{.HealthStatus}}"

# Inspect container
docker inspect weddinglk-dev-app
```

## 🚀 Deployment

### Local Development

```bash
# Start development environment
./scripts/docker-manage.sh start dev

# Make code changes (auto-reload)
# Access at http://localhost:3000
```

### Production Deployment

```bash
# Build production image
./scripts/docker-build.sh prod

# Start production services
./scripts/docker-manage.sh start prod

# With Nginx
docker-compose -f docker-compose.prod.yml --profile nginx up -d
```

### CI/CD Integration

```bash
# Build and test
./scripts/docker-build.sh prod
docker-compose -f docker-compose.prod.yml up -d

# Run tests
docker exec weddinglk-prod-app npm test

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Additional Resources

### Docker Commands Reference

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# View images
docker images

# View volumes
docker volume ls

# View networks
docker network ls
```

### Docker Compose Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale weddinglk=3
```

### Useful Aliases

Add to your `.bashrc` or `.zshrc`:

```bash
alias dcp="docker-compose"
alias dcpd="docker-compose down"
alias dcpu="docker-compose up -d"
alias dcpul="docker-compose up -d && docker-compose logs -f"
alias dcpb="docker-compose build"
alias dcpf="docker-compose logs -f"
```

## 🎯 Best Practices

### Development

1. Use development compose file for local development
2. Enable volume mounting for hot reloading
3. Use MongoDB Express for database management
4. Monitor logs during development

### Production

1. Use production compose file
2. Set proper environment variables
3. Enable health checks
4. Monitor resource usage
5. Use reverse proxy for SSL termination

### Security

1. Change default passwords
2. Use environment variables for secrets
3. Limit container resource usage
4. Regular security updates
5. Network isolation

---

**Happy Containerizing! 🐳✨** 
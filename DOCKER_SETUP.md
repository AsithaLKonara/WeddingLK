# 🐳 Docker Setup Guide for WeddingLK

This guide will help you set up and run the WeddingLK application using Docker containers.

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose installed
- At least 4GB of available RAM
- Ports 3000, 27017, 6379, and 8081 available

## 🚀 Quick Start

### 1. Development Environment

```bash
# Clone the repository (if not already done)
git clone https://github.com/AsithaLKonara/WeddingLK.git
cd WeddingLK

# Start development environment
docker-compose -f docker-compose.dev.yml up --build
```

### 2. Production Environment

```bash
# Start production environment
docker-compose up --build
```

## 📁 Docker Files Structure

```
WeddingLK/
├── Dockerfile              # Production Dockerfile
├── Dockerfile.dev          # Development Dockerfile
├── docker-compose.yml      # Production services
├── docker-compose.dev.yml  # Development services
├── .dockerignore           # Files to exclude from build
├── scripts/
│   └── mongo-init.js       # MongoDB initialization script
└── DOCKER_SETUP.md         # This guide
```

## 🔧 Services Overview

### Production Services (`docker-compose.yml`)

| Service | Port | Description |
|---------|------|-------------|
| `weddinglk-app` | 3000 | Next.js application |
| `mongodb` | 27017 | MongoDB database |
| `redis` | 6379 | Redis cache |
| `mongo-express` | 8081 | MongoDB admin interface (dev only) |

### Development Services (`docker-compose.dev.yml`)

| Service | Port | Description |
|---------|------|-------------|
| `weddinglk-app-dev` | 3000 | Next.js app with hot reload |
| `mongodb` | 27017 | MongoDB database |
| `redis` | 6379 | Redis cache |
| `mongo-express` | 8081 | MongoDB admin interface |

## 🛠️ Docker Commands

### Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Start in background
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# Rebuild and start
docker-compose -f docker-compose.dev.yml up --build
```

### Production Commands

```bash
# Start production environment
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop production environment
docker-compose down

# Rebuild and start
docker-compose up --build
```

### General Docker Commands

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View container logs
docker logs <container_name>

# Execute commands in running container
docker exec -it <container_name> /bin/sh

# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune

# Remove all unused volumes
docker volume prune

# Clean everything (use with caution)
docker system prune -a
```

## 🔐 Environment Variables

### Required Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://mongodb:27017/weddinglk

# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Redis (optional)
REDIS_URL=redis://redis:6379

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth (optional)
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

### Default Values (Docker Compose)

The Docker Compose files include default environment variables:

- `MONGODB_URI=mongodb://mongodb:27017/weddinglk`
- `NEXTAUTH_SECRET=your-production-secret-key-here`
- `NEXTAUTH_URL=http://localhost:3000`
- `REDIS_URL=redis://redis:6379`

## 🗄️ Database Setup

### MongoDB

The MongoDB container is automatically initialized with:

- **Database**: `weddinglk`
- **Collections**: `users`, `vendors`, `venues`, `bookings`, `reviews`, `services`
- **Indexes**: Optimized for performance
- **Sample Data**: Demo users, vendors, and venues

### Access MongoDB

```bash
# Connect to MongoDB container
docker exec -it weddinglk-mongodb-1 mongosh

# Use the database
use weddinglk

# View collections
show collections

# View sample data
db.users.find()
db.vendors.find()
db.venues.find()
```

### MongoDB Express (Web Interface)

Access MongoDB Express at: http://localhost:8081

- **Username**: `admin`
- **Password**: `admin123`

## 🔄 Development Workflow

### 1. Start Development Environment

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### 2. Access Application

- **Main App**: http://localhost:3000
- **MongoDB Express**: http://localhost:8081

### 3. Make Changes

The development environment includes volume mounts for hot reloading:

- Source code changes are automatically reflected
- No need to rebuild containers for code changes
- Node modules are cached in a Docker volume

### 4. View Logs

```bash
# View all logs
docker-compose -f docker-compose.dev.yml logs -f

# View specific service logs
docker-compose -f docker-compose.dev.yml logs -f weddinglk-app-dev
```

## 🚀 Production Deployment

### 1. Build Production Image

```bash
# Build the production image
docker build -t weddinglk:latest .

# Or use Docker Compose
docker-compose build
```

### 2. Start Production Services

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

### 3. Scale Services (Optional)

```bash
# Scale the application
docker-compose up -d --scale weddinglk-app=3
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Check what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>
```

#### 2. Container Won't Start

```bash
# Check container logs
docker logs <container_name>

# Check container status
docker ps -a
```

#### 3. Database Connection Issues

```bash
# Check MongoDB container
docker exec -it weddinglk-mongodb-1 mongosh

# Check network connectivity
docker network ls
docker network inspect weddinglk_weddinglk-network
```

#### 4. Build Issues

```bash
# Clean build cache
docker builder prune

# Rebuild without cache
docker-compose build --no-cache
```

### Performance Optimization

#### 1. Resource Limits

Add resource limits to `docker-compose.yml`:

```yaml
services:
  weddinglk-app:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
```

#### 2. Volume Optimization

```yaml
volumes:
  - .:/app
  - /app/node_modules  # Exclude node_modules from host
  - /app/.next         # Exclude Next.js build cache
```

## 📊 Monitoring

### Health Checks

Add health checks to your services:

```yaml
services:
  weddinglk-app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Logging

```bash
# View real-time logs
docker-compose logs -f --tail=100

# Export logs
docker-compose logs > app.log
```

## 🔒 Security Considerations

### 1. Environment Variables

- Never commit `.env` files to version control
- Use Docker secrets for sensitive data in production
- Rotate secrets regularly

### 2. Network Security

```yaml
networks:
  weddinglk-network:
    driver: bridge
    internal: true  # Isolate from external network
```

### 3. Container Security

```yaml
services:
  weddinglk-app:
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
      - /var/cache/nginx
```

## 📈 Scaling

### Horizontal Scaling

```bash
# Scale the application
docker-compose up -d --scale weddinglk-app=3

# Use a load balancer
docker-compose -f docker-compose.yml -f docker-compose.override.yml up
```

### Load Balancer Configuration

Create `docker-compose.override.yml`:

```yaml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - weddinglk-app
```

## 🎯 Best Practices

1. **Use Multi-stage Builds**: Reduces final image size
2. **Cache Dependencies**: Optimize build times
3. **Health Checks**: Monitor container health
4. **Resource Limits**: Prevent resource exhaustion
5. **Security**: Run containers as non-root users
6. **Logging**: Implement proper logging strategy
7. **Backup**: Regular database backups
8. **Updates**: Keep base images updated

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review container logs
3. Verify environment variables
4. Check network connectivity
5. Ensure ports are available

For additional help, refer to the main project documentation or create an issue on GitHub.

---

**Happy Dockerizing! 🐳✨** 
#!/bin/bash

# ========================================
# WEDDINGLK PRODUCTION BUILD SCRIPT
# Complete rebuild with no cache
# ========================================

set -e

echo "🚀 WEDDINGLK PRODUCTION BUILD STARTING..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Clean up any existing containers and images
print_status "🧹 Cleaning up existing Docker resources..."
docker-compose down -v 2>/dev/null || true
docker system prune -a -f --volumes 2>/dev/null || true

# Remove any existing images
print_status "🗑️ Removing existing images..."
docker rmi $(docker images -q weddinglk-* 2>/dev/null) 2>/dev/null || true

# Create necessary directories
print_status "📁 Creating necessary directories..."
mkdir -p nginx/ssl
mkdir -p uploads
mkdir -p logs

# Check if SSL certificates exist, if not create them
if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
    print_status "🔐 Creating SSL certificates..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/key.pem \
        -out nginx/ssl/cert.pem \
        -subj "/C=US/ST=State/L=City/O=WeddingLK/CN=localhost"
    print_success "SSL certificates created successfully"
else
    print_success "SSL certificates already exist"
fi

# Set proper permissions
print_status "🔒 Setting proper permissions..."
chmod 600 nginx/ssl/key.pem
chmod 644 nginx/ssl/cert.pem

# Check if environment file exists
if [ ! -f ".env" ]; then
    print_warning "No .env file found. Creating from env.development..."
    if [ -f "env.development" ]; then
        cp env.development .env
        print_success "Environment file created from env.development"
    else
        print_error "No environment file found. Please create .env or copy from env.development"
        exit 1
    fi
fi

# Build all containers with no cache
print_status "🏗️ Building containers with no cache..."
docker-compose build --no-cache

# Start the services
print_status "🚀 Starting all services..."
docker-compose up -d

# Wait for services to be healthy
print_status "⏳ Waiting for services to be healthy..."
sleep 30

# Check service health
print_status "🏥 Checking service health..."

# Check nginx
if docker exec weddinglk-nginx wget --quiet --tries=1 --spider http://localhost/nginx-health 2>/dev/null; then
    print_success "Nginx is healthy"
else
    print_warning "Nginx health check failed"
fi

# Check app
if docker exec weddinglk-app curl -f http://localhost:3000/api/health 2>/dev/null; then
    print_success "Application is healthy"
else
    print_warning "Application health check failed"
fi

# Check MongoDB
if docker exec weddinglk-mongodb mongosh --eval "db.adminCommand('ping')" --quiet 2>/dev/null; then
    print_success "MongoDB is healthy"
else
    print_warning "MongoDB health check failed"
fi

# Check Redis
if docker exec weddinglk-redis redis-cli ping 2>/dev/null | grep -q "PONG"; then
    print_success "Redis is healthy"
else
    print_warning "Redis health check failed"
fi

# Show running containers
print_status "📊 Current running containers:"
docker-compose ps

# Show service URLs
echo ""
print_success "🎉 BUILD COMPLETED SUCCESSFULLY!"
echo "=========================================="
echo "🌐 Main Application: http://localhost (redirects to https)"
echo "🔒 Secure Application: https://localhost"
echo "🗄️ MongoDB Express: http://localhost:8081"
echo "🔴 Redis Commander: http://localhost:8082"
echo "📊 Application Health: https://localhost/api/health"
echo ""
echo "📝 Next steps:"
echo "1. Update .env with your actual values"
echo "2. Access the application at https://localhost"
echo "3. Check logs with: docker-compose logs -f"
echo "4. Stop services with: docker-compose down"
echo ""
print_success "Your WeddingLK application is now running with production-grade Docker setup!" 
#!/bin/bash

# Production Build Script for WeddingLK
# This script builds and deploys the application to production

set -e

echo "🚀 Starting WeddingLK Production Build..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build the production image
echo "🔨 Building production Docker image..."
docker build -f Dockerfile.production -t weddinglk:production .

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.production.yml down --remove-orphans

# Start production services
echo "🚀 Starting production services..."
docker-compose -f docker-compose.production.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service health
echo "🏥 Checking service health..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Application is healthy!"
else
    echo "❌ Application health check failed"
    docker-compose -f docker-compose.production.yml logs app
    exit 1
fi

# Check Nginx
if curl -f http://localhost:80 > /dev/null 2>&1; then
    echo "✅ Nginx is running!"
else
    echo "❌ Nginx health check failed"
    docker-compose -f docker-compose.production.yml logs nginx
    exit 1
fi

echo "🎉 Production deployment completed successfully!"
echo "📱 Application: http://localhost:3000"
echo "🌐 Nginx: http://localhost:80 (redirects to HTTPS)"
echo "🔒 HTTPS: https://localhost:443"
echo "📊 Prometheus: http://localhost:9090"
echo "📈 Grafana: http://localhost:3001 (admin/admin123)"

# Show running containers
echo "🐳 Running containers:"
docker-compose -f docker-compose.production.yml ps

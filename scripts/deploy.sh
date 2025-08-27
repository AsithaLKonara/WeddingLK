#!/bin/bash

# Production Deployment Script for WeddingLK
set -e

echo "🚀 Deploying WeddingLK to Production..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ .env.production file not found!"
    echo "📝 Please copy env.production.template to .env.production and configure it"
    exit 1
fi

# Load environment variables
source .env.production

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🏥 Checking service health..."
docker-compose ps

# Test application
echo "🧪 Testing application..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Application is healthy!"
else
    echo "❌ Application health check failed!"
    docker-compose logs app
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "🌐 Application is running at: http://localhost:3000"
echo "📊 MongoDB: localhost:27017"
echo "🔴 Redis: localhost:6379"
echo "🌍 Nginx: localhost:80"

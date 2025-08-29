#!/bin/bash

echo "🚀 Starting WeddingLK Local Development Environment"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.dev.yml down

# Remove old volumes (optional - uncomment if you want fresh data)
# echo "🗑️  Removing old volumes..."
# docker-compose -f docker-compose.dev.yml down -v

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.dev.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo "📊 Service Status:"
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "✅ WeddingLK is starting up!"
echo "🌐 Frontend: http://localhost:3000"
echo "🗄️  MongoDB: localhost:27017"
echo "🔴 Redis: localhost:6379"
echo ""
echo "📝 Logs: docker-compose -f docker-compose.dev.yml logs -f app"
echo "🛑 Stop: docker-compose -f docker-compose.dev.yml down"
echo ""
echo "🎓 Ready for your university presentation!"

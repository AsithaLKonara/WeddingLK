#!/bin/bash

# Simple Production Startup Script
echo "🚀 Starting WeddingLK Production..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "📝 Creating .env.production from template..."
    cp env.production.template .env.production
    echo "⚠️  Please edit .env.production with your production values"
    echo "💡 Then run: ./start-production.sh"
    exit 1
fi

# Start services
echo "🔨 Starting Docker services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 20

echo "🏥 Checking service health..."
docker-compose ps

echo "🎉 Production services started!"
echo "🌐 Web: http://localhost:3000"
echo "📊 MongoDB: localhost:27017"
echo "🔴 Redis: localhost:6379"
echo "🌍 Nginx: localhost:80"
echo ""
echo "📝 To stop: docker-compose down"
echo "📝 To view logs: docker-compose logs -f"

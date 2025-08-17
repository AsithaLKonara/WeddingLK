run test #!/bin/bash

# Development Docker management script for WeddingLK

echo "🔄 Stopping existing containers..."
docker-compose down

echo "🧹 Cleaning up Docker cache..."
docker system prune -f

echo "🔨 Rebuilding development container..."
docker-compose build --no-cache weddinglk

echo "🚀 Starting services..."
docker-compose up -d

echo "📊 Checking container status..."
docker-compose ps

echo "📝 Viewing logs (Ctrl+C to exit)..."
docker-compose logs -f weddinglk 
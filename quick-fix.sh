#!/bin/bash

echo "🔧 Quick Fix Script for WeddingLK"
echo "=================================="

# Fix permissions
echo "🔐 Fixing file permissions..."
chmod +x start-local.sh
chmod +x quick-fix.sh

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
docker-compose down 2>/dev/null || true

# Remove any dangling images
echo "🗑️  Cleaning up Docker images..."
docker image prune -f

# Check if ports are available
echo "🔍 Checking port availability..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is in use. Stopping process..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
fi

if lsof -Pi :27017 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 27017 is in use. Stopping process..."
    lsof -ti:27017 | xargs kill -9 2>/dev/null || true
fi

if lsof -Pi :6379 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 6379 is in use. Stopping process..."
    lsof -ti:6379 | xargs kill -9 2>/dev/null || true
fi

echo ""
echo "✅ Quick fix completed!"
echo "🚀 Now run: ./start-local.sh"
echo ""
echo "📝 If you still have issues, try:"
echo "   docker system prune -f"
echo "   docker volume prune -f"

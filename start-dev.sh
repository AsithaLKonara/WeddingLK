#!/bin/bash

# ========================================
# WEDDINGLK DEVELOPMENT STARTUP SCRIPT
# ========================================

echo "🚀 Starting WeddingLK Development Environment..."

# Check if MongoDB is running locally
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running locally."
    echo "   Please start MongoDB with: brew services start mongodb-community"
    echo "   Or install MongoDB if not installed: brew install mongodb-community"
    echo ""
    echo "   Alternatively, you can use Docker:"
    echo "   docker run -d -p 27017:27017 --name mongodb mongo:7.0"
    echo ""
fi

# Check if Redis is running locally
if ! pgrep -x "redis-server" > /dev/null; then
    echo "⚠️  Redis is not running locally."
    echo "   Please start Redis with: brew services start redis"
    echo "   Or install Redis if not installed: brew install redis"
    echo ""
    echo "   Alternatively, you can use Docker:"
    echo "   docker run -d -p 6379:6379 --name redis redis:7.2-alpine"
    echo ""
fi

# Set environment variables for development
export NODE_ENV=development
export MONGODB_URI=mongodb://localhost:27017/weddinglk

echo "📋 Environment Variables Set:"
echo "   NODE_ENV: $NODE_ENV"
echo "   MONGODB_URI: $MONGODB_URI"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the application
echo "🔨 Building the application..."
npm run build

# Start the development server
echo "🌐 Starting development server..."
npm run dev 
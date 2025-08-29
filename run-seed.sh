#!/bin/bash

echo "🌱 WeddingLK Database Seeding Script"
echo "====================================="

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if ! curl -s http://localhost:27017 > /dev/null 2>&1; then
    echo "❌ MongoDB is not running. Please start your Docker containers first:"
    echo "   ./start-presentation.sh"
    exit 1
fi

echo "✅ MongoDB is running"

# Check if the seeding script exists
if [ ! -f "seed-db.js" ]; then
    echo "❌ seed-db.js not found. Please make sure the file exists."
    exit 1
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
if ! npm list @faker-js/faker > /dev/null 2>&1; then
    echo "📥 Installing faker dependency..."
    npm install @faker-js/faker
fi

# Run the seeding script
echo "🚀 Starting database seeding..."
node seed-db.js

echo ""
echo "🎉 Seeding completed! Your database is now populated with sample data."
echo "🎓 Ready for your university presentation!"

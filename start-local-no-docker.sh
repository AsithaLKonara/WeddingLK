#!/bin/bash

echo "🚀 Starting WeddingLK Locally (No Docker)"
echo "=========================================="

# Colors for output
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

# Check if Node.js is installed
print_status "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node --version)"
    echo "   Please update Node.js from: https://nodejs.org/"
    exit 1
fi

print_success "Node.js $(node --version) is installed"

# Check if npm is installed
print_status "Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm $(npm --version) is installed"

# Check if MongoDB is accessible
print_status "Checking MongoDB connection..."
if ! curl -s http://localhost:27017 > /dev/null 2>&1; then
    print_warning "MongoDB is not running on localhost:27017"
    echo ""
    echo "📋 MongoDB Options:"
    echo "   1. Install MongoDB locally:"
    echo "      • macOS: brew install mongodb-community"
    echo "      • Windows: Download from https://www.mongodb.com/try/download/community"
    echo "      • Linux: sudo apt install mongodb"
    echo ""
    echo "   2. Use MongoDB Atlas (cloud - recommended for demo):"
    echo "      • Go to: https://www.mongodb.com/atlas/database"
    echo "      • Create free account and database"
    echo "      • Update MONGODB_URI in env.local.no-docker"
    echo ""
    echo "   3. Start MongoDB service:"
    echo "      • macOS: brew services start mongodb-community"
    echo "      • Linux: sudo systemctl start mongodb"
    echo ""
    read -p "Press Enter to continue without MongoDB check..."
else
    print_success "MongoDB is accessible on localhost:27017"
fi

# Copy environment file
print_status "Setting up environment..."
if [ -f "env.local.no-docker" ]; then
    cp env.local.no-docker .env.local
    print_success "Environment file created"
else
    print_warning "env.local.no-docker not found, using default environment"
fi

# Install dependencies
print_status "Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    print_success "Dependencies installed"
else
    print_status "Dependencies already installed, checking for updates..."
    npm install
fi

# Check for required packages
print_status "Checking required packages..."
REQUIRED_PACKAGES=("@faker-js/faker" "bcryptjs" "mongoose")
for package in "${REQUIRED_PACKAGES[@]}"; do
    if ! npm list "$package" > /dev/null 2>&1; then
        print_status "Installing $package..."
        npm install "$package"
    fi
done

# Seed database if needed
print_status "Checking if database needs seeding..."
if [ -f "seed-db.js" ]; then
    echo ""
    read -p "Do you want to seed the database with sample data? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Seeding database..."
        node seed-db.js
    fi
fi

# Start the application
echo ""
print_status "Starting WeddingLK application..."
echo ""
echo "🎉 WeddingLK is starting up!"
echo "🌐 Frontend: http://localhost:3000"
echo "🗄️  MongoDB: localhost:27017 (or your Atlas connection)"
echo ""
echo "📝 Commands:"
echo "   • Stop: Ctrl+C"
echo "   • Restart: npm run dev"
echo "   • Seed DB: node seed-db.js"
echo ""
echo "🎓 Ready for your university presentation!"
echo ""

# Start the development server
npm run dev

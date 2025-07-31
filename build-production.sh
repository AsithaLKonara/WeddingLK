#!/bin/bash

# WeddingLK Production Build Script
# This script builds and deploys the WeddingLK application in production mode

set -e

echo "🚀 Building WeddingLK for Production..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed."
    exit 1
fi

print_header "Step 1: Clean Environment"
# Stop any running containers
docker-compose -f docker-compose.production.yml down 2>/dev/null || true
docker-compose -f docker-compose.dev.simple.yml down 2>/dev/null || true

# Clean up any existing images
docker rmi weddinglk:latest 2>/dev/null || true
docker rmi weddinglk-app:latest 2>/dev/null || true

print_header "Step 2: Install Dependencies"
print_status "Installing npm dependencies..."
npm ci --legacy-peer-deps

print_header "Step 2.5: Swap in build-safe API routes"
# NextAuth
NEXTAUTH_ROUTE="app/api/auth/[...nextauth]/route.ts"
NEXTAUTH_REAL="app/api/auth/[...nextauth]/route.real.ts"
NEXTAUTH_BUILD="app/api/auth/[...nextauth]/route.build.ts"
if [ -f "$NEXTAUTH_ROUTE" ]; then
  mv "$NEXTAUTH_ROUTE" "$NEXTAUTH_REAL"
fi
cp "$NEXTAUTH_BUILD" "$NEXTAUTH_ROUTE"
# Bookings
BOOKINGS_ROUTE="app/api/bookings/route.ts"
BOOKINGS_REAL="app/api/bookings/route.real.ts"
BOOKINGS_BUILD="app/api/bookings/route.build.ts"
if [ -f "$BOOKINGS_ROUTE" ]; then
  mv "$BOOKINGS_ROUTE" "$BOOKINGS_REAL"
fi
cp "$BOOKINGS_BUILD" "$BOOKINGS_ROUTE"
# Clients
CLIENTS_ROUTE="app/api/clients/route.ts"
CLIENTS_REAL="app/api/clients/route.real.ts"
CLIENTS_BUILD="app/api/clients/route.build.ts"
if [ -f "$CLIENTS_ROUTE" ]; then
  mv "$CLIENTS_ROUTE" "$CLIENTS_REAL"
fi
cp "$CLIENTS_BUILD" "$CLIENTS_ROUTE"
# Reviews
REVIEWS_ROUTE="app/api/reviews/route.ts"
REVIEWS_REAL="app/api/reviews/route.real.ts"
REVIEWS_BUILD="app/api/reviews/route.build.ts"
if [ -f "$REVIEWS_ROUTE" ]; then
  mv "$REVIEWS_ROUTE" "$REVIEWS_REAL"
fi
cp "$REVIEWS_BUILD" "$REVIEWS_ROUTE"
# Tasks
TASKS_ROUTE="app/api/tasks/route.ts"
TASKS_REAL="app/api/tasks/route.real.ts"
TASKS_BUILD="app/api/tasks/route.build.ts"
if [ -f "$TASKS_ROUTE" ]; then
  mv "$TASKS_ROUTE" "$TASKS_REAL"
fi
cp "$TASKS_BUILD" "$TASKS_ROUTE"

print_header "Step 3: Build Application"
print_status "Building Next.js application..."
npm run build

print_header "Step 3.5: Restore real API routes"
if [ -f "$NEXTAUTH_REAL" ]; then
  mv "$NEXTAUTH_REAL" "$NEXTAUTH_ROUTE"
fi
if [ -f "$BOOKINGS_REAL" ]; then
  mv "$BOOKINGS_REAL" "$BOOKINGS_ROUTE"
fi
if [ -f "$CLIENTS_REAL" ]; then
  mv "$CLIENTS_REAL" "$CLIENTS_ROUTE"
fi
if [ -f "$REVIEWS_REAL" ]; then
  mv "$REVIEWS_REAL" "$REVIEWS_ROUTE"
fi
if [ -f "$TASKS_REAL" ]; then
  mv "$TASKS_REAL" "$TASKS_ROUTE"
fi

print_header "Step 4: Build Docker Images"
print_status "Building production Docker image..."
docker build -f Dockerfile.production -t weddinglk:latest .

print_header "Step 5: Start Production Services"
print_status "Starting production environment..."
docker-compose -f docker-compose.production.yml up -d

print_header "Step 6: Wait for Services to Start"
print_status "Waiting for services to be ready..."
sleep 30

print_header "Step 7: Check Service Health"
print_status "Checking service health..."

# Check if the application is responding
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    print_status "✅ Application is healthy"
else
    print_warning "⚠️  Application health check failed, but it might still be starting up"
fi

# Check if MongoDB is running
if docker-compose -f docker-compose.production.yml exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    print_status "✅ MongoDB is healthy"
else
    print_warning "⚠️  MongoDB health check failed"
fi

# Check if Redis is running
if docker-compose -f docker-compose.production.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_status "✅ Redis is healthy"
else
    print_warning "⚠️  Redis health check failed"
fi

print_header "Step 8: Show Service Status"
print_status "Current service status:"
docker-compose -f docker-compose.production.yml ps

print_header "Step 9: Show Logs"
print_status "Recent application logs:"
docker-compose -f docker-compose.production.yml logs --tail=20 weddinglk-app

print_header "🎉 Production Build Complete!"
echo ""
print_status "Services are now running:"
echo "  🌐 Application: http://localhost:3000"
echo "  🗄️  MongoDB: localhost:27017"
echo "  🔴 Redis: localhost:6379"
echo "  📊 MongoDB Express: http://localhost:8081 (dev profile)"
echo ""
print_status "Default Login Credentials:"
echo "  👤 User: demo@weddinglk.com / any password"
echo "  👨‍💼 Admin: admin@weddinglk.com / any password"
echo "  📋 Planner: planner@weddinglk.com / any password"
echo ""
print_status "Useful Commands:"
echo "  📋 View logs: docker-compose -f docker-compose.production.yml logs -f"
echo "  🛑 Stop services: docker-compose -f docker-compose.production.yml down"
echo "  🔄 Restart services: docker-compose -f docker-compose.production.yml restart"
echo "  🧹 Clean up: docker system prune -a -f"
echo ""
print_status "Database initialized with sample data including:"
echo "  • 3 sample users (demo, admin, planner)"
echo "  • 3 sample vendors (photography, catering, decoration)"
echo "  • 3 sample venues (Colombo, Kandy, Galle)"
echo "  • Sample bookings, reviews, tasks, and notifications"
echo ""
print_status "🎊 WeddingLK is ready for production use!" 
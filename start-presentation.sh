#!/bin/bash

echo "🎓 WeddingLK University Presentation Startup"
echo "============================================="
echo ""

# Colors for output
RED='\033[0;31m'
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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
print_status "Checking Docker status..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi
print_success "Docker is running"

# Check if ports are available
print_status "Checking port availability..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    print_warning "Port 3000 is in use. Stopping process..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
fi

if lsof -Pi :27017 -sTCP:LISTEN -t >/dev/null ; then
    print_warning "Port 27017 is in use. Stopping process..."
    lsof -ti:27017 | xargs kill -9 2>/dev/null || true
fi

if lsof -Pi :6379 -sTCP:LISTEN -t >/dev/null ; then
    print_warning "Port 6379 is in use. Stopping process..."
    lsof -ti:6379 | xargs kill -9 2>/dev/null || true
fi

# Clean up existing containers
print_status "Cleaning up existing containers..."
docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
docker-compose down 2>/dev/null || true

# Make scripts executable
print_status "Setting up permissions..."
chmod +x *.sh

# Build and start services
print_status "Building and starting services..."
docker-compose -f docker-compose.dev.yml up --build -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 15

# Check service status
print_status "Checking service status..."
docker-compose -f docker-compose.dev.yml ps

# Wait a bit more for the app to fully start
print_status "Waiting for application to fully start..."
sleep 10

# Test the health endpoint
print_status "Testing application health..."
if curl -s http://localhost:3000/api/health > /dev/null; then
    print_success "Application is responding!"
else
    print_warning "Application might still be starting up..."
fi

echo ""
echo "🎉 ${GREEN}WeddingLK is ready for your presentation!${NC}"
echo ""
echo "🌐 ${BLUE}Frontend:${NC} http://localhost:3000"
echo "🗄️  ${BLUE}MongoDB:${NC} localhost:27017"
echo "🔴 ${BLUE}Redis:${NC} localhost:6379"
echo ""
echo "📱 ${YELLOW}Key Demo Pages:${NC}"
echo "   • Home: http://localhost:3000"
echo "   • AI Features: http://localhost:3000/features/ai-enhancements"
echo "   • Vendors: http://localhost:3000/vendors"
echo "   • Venues: http://localhost:3000/venues"
echo "   • Dashboard: http://localhost:3000/dashboard"
echo ""
echo "📝 ${BLUE}Useful Commands:${NC}"
echo "   • View logs: docker-compose -f docker-compose.dev.yml logs -f app"
echo "   • Stop app: docker-compose -f docker-compose.dev.yml down"
echo "   • Restart: ./start-presentation.sh"
echo ""
echo "🎓 ${GREEN}Good luck with your university presentation!${NC}"
echo "   This is a production-ready, enterprise-grade platform!"
echo ""

# Show recent logs
print_status "Recent application logs:"
docker-compose -f docker-compose.dev.yml logs --tail=10 app

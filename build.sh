#!/bin/bash

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

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to clean up Docker resources
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker system prune -f
    docker volume prune -f
    print_success "Cleanup completed"
}

# Function to check Docker status
status() {
    print_status "Checking Docker container status..."
    docker-compose ps
}

# Function to show logs
logs() {
    print_status "Showing logs for WeddingLK containers..."
    docker-compose logs -f weddinglk
}

# Function to start development environment
dev() {
    print_status "Starting development environment with MongoDB..."
    check_docker
    print_status "Building and starting development containers..."
    docker-compose -f docker-compose.dev.yml up --build -d
    print_success "Development environment started!"
    print_status "Access points:"
    echo "  - Application: http://localhost:3000"
    echo "  - MongoDB: localhost:27017"
    echo "  - Mongo Express: http://localhost:8081 (admin/admin123)"
    print_status "To view logs: ./build.sh logs"
}

# Function to start production environment
prod() {
    print_status "Starting production environment with MongoDB..."
    check_docker
    print_status "Building and starting production containers..."
    docker-compose up --build -d
    print_success "Production environment started!"
    print_status "Access points:"
    echo "  - Application: http://localhost:3000"
    echo "  - MongoDB: localhost:27017"
    echo "  - Mongo Express: http://localhost:8081 (admin/admin123)"
    print_status "To view logs: ./build.sh logs"
}

# Function to build Docker images
build() {
    print_status "Building Docker images..."
    check_docker
    docker-compose build --no-cache
    print_success "Docker images built successfully!"
}

# Function to stop containers
stop() {
    print_status "Stopping containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    print_success "Containers stopped"
}

# Function to seed database
seed() {
    print_status "Seeding database..."
    if docker-compose ps | grep -q "weddinglk.*Up"; then
        docker-compose exec weddinglk node scripts/seed-database-production.mjs
        print_success "Database seeded successfully!"
    else
        print_error "WeddingLK container is not running. Start it first with ./build.sh dev or ./build.sh prod"
    fi
}

# Function to show help
help() {
    echo "WeddingLK Docker Management Script"
    echo ""
    echo "Usage: ./build.sh [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev     - Start development environment with MongoDB"
    echo "  prod    - Start production environment with MongoDB"
    echo "  build   - Build Docker images"
    echo "  stop    - Stop all containers"
    echo "  status  - Show container status"
    echo "  logs    - Show application logs"
    echo "  seed    - Seed database with sample data"
    echo "  cleanup - Clean up Docker resources"
    echo "  help    - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./build.sh dev    # Start development environment"
    echo "  ./build.sh prod   # Start production environment"
    echo "  ./build.sh logs   # View logs"
    echo ""
    echo "Access Points:"
    echo "  - Application: http://localhost:3000"
    echo "  - MongoDB: localhost:27017"
    echo "  - Mongo Express: http://localhost:8081 (admin/admin123)"
    echo ""
    echo "Test Accounts (after seeding):"
    echo "  - Admin: admin@weddinglk.lk / admin123"
    echo "  - Couple: john@example.com / password123"
    echo "  - Vendor: photographer@example.com / password123"
}

# Main script logic
case "$1" in
    dev)
        dev
        ;;
    prod)
        prod
        ;;
    build)
        build
        ;;
    stop)
        stop
        ;;
    status)
        status
        ;;
    logs)
        logs
        ;;
    seed)
        seed
        ;;
    cleanup)
        cleanup
        ;;
    help|--help|-h)
        help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        help
        exit 1
        ;;
esac 
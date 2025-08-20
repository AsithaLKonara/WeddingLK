#!/bin/bash

# WeddingLK Docker Build and Run Script
# This script builds and runs the complete WeddingLK application with Docker

set -e

echo "🚀 WeddingLK Docker Build and Run Script"
echo "========================================"

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
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Clean up existing containers and images
cleanup() {
    print_status "Cleaning up existing containers and images..."
    
    # Stop and remove containers
    docker-compose down --remove-orphans -v 2>/dev/null || true
    
    # Remove old images
    docker image prune -f 2>/dev/null || true
    
    print_success "Cleanup completed"
}

# Build the application
build_app() {
    print_status "Building WeddingLK application..."
    
    # Build the Docker image
    docker-compose build --no-cache weddinglk-app
    
    if [ $? -eq 0 ]; then
        print_success "Application built successfully"
    else
        print_error "Failed to build application"
        exit 1
    fi
}

# Start all services
start_services() {
    print_status "Starting all services..."
    
    # Start services in detached mode
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        print_success "Services started successfully"
    else
        print_error "Failed to start services"
        exit 1
    fi
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for MongoDB
    print_status "Waiting for MongoDB..."
    until docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
        sleep 2
    done
    print_success "MongoDB is ready"
    
    # Wait for Redis
    print_status "Waiting for Redis..."
    until docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do
        sleep 2
    done
    print_success "Redis is ready"
    
    # Wait for Next.js app
    print_status "Waiting for Next.js application..."
    until curl -f http://localhost:3000/api/health > /dev/null 2>&1; do
        sleep 5
    done
    print_success "Next.js application is ready"
}

# Show service status
show_status() {
    print_status "Service Status:"
    docker-compose ps
    
    echo ""
    print_status "Application URLs:"
    echo -e "  🌐 Main App: ${GREEN}http://localhost:3000${NC}"
    echo -e "  🗄️  MongoDB: ${GREEN}mongodb://localhost:27017${NC}"
    echo -e "  🔴 Redis: ${GREEN}redis://localhost:6379${NC}"
    echo -e "  📊 Mongo Express: ${GREEN}http://localhost:8081${NC}"
    echo -e "     Username: admin, Password: admin123"
}

# Show logs
show_logs() {
    print_status "Showing application logs..."
    docker-compose logs -f weddinglk-app
}

# Main execution
main() {
    case "${1:-build}" in
        "build")
            check_docker
            cleanup
            build_app
            start_services
            wait_for_services
            show_status
            ;;
        "start")
            check_docker
            start_services
            wait_for_services
            show_status
            ;;
        "stop")
            print_status "Stopping services..."
            docker-compose down
            print_success "Services stopped"
            ;;
        "restart")
            print_status "Restarting services..."
            docker-compose restart
            wait_for_services
            show_status
            ;;
        "logs")
            show_logs
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  build    - Build and start all services (default)"
            echo "  start    - Start existing services"
            echo "  stop     - Stop all services"
            echo "  restart  - Restart all services"
            echo "  logs     - Show application logs"
            echo "  status   - Show service status"
            echo "  cleanup  - Clean up containers and images"
            echo "  help     - Show this help message"
            ;;
        *)
            print_error "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@" 
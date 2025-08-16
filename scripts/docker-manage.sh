#!/bin/bash

# Docker Management Script for WeddingLK
# Usage: ./scripts/docker-manage.sh [start|stop|restart|status|logs|clean|seed]

set -e

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

# Function to start services
start_services() {
    print_status "Starting WeddingLK services..."
    docker-compose up -d
    
    print_success "Services started successfully!"
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Show status
    show_status
}

# Function to stop services
stop_services() {
    print_status "Stopping WeddingLK services..."
    docker-compose down
    
    print_success "Services stopped successfully!"
}

# Function to restart services
restart_services() {
    print_status "Restarting WeddingLK services..."
    stop_services
    start_services
}

# Function to show service status
show_status() {
    print_status "Service Status:"
    echo "=================="
    
    # Show running containers
    echo "Running Containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep weddinglk || echo "No WeddingLK containers running"
    
    echo ""
    
    # Show container health
    echo "Container Health:"
    docker ps --format "table {{.Names}}\t{{.HealthStatus}}" | grep weddinglk || echo "No WeddingLK containers running"
    
    echo ""
    
    # Show resource usage
    echo "Resource Usage:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" | grep weddinglk || echo "No WeddingLK containers running"
}

# Function to show logs
show_logs() {
    local service=${1:-weddinglk}
    
    print_status "Showing logs for $service..."
    docker-compose logs -f $service
}

# Function to clean up
clean_up() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up Docker resources..."
        
        # Stop and remove containers
        docker-compose down -v 2>/dev/null || true
        
        # Remove images
        docker rmi weddinglk:test 2>/dev/null || true
        
        # Remove unused volumes
        docker volume prune -f
        
        # Remove unused networks
        docker network prune -f
        
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to seed database
seed_database() {
    print_status "Seeding database..."
    
    # Check if MongoDB is running
    if ! docker ps | grep -q weddinglk-mongodb; then
        print_error "MongoDB is not running. Please start services first."
        exit 1
    fi
    
    # Run the seeding script
    if docker exec weddinglk-app npm run seed:comprehensive; then
        print_success "Database seeded successfully!"
    else
        print_error "Failed to seed database."
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "Docker Management Script for WeddingLK"
    echo "====================================="
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start               Start services"
    echo "  stop                Stop services"
    echo "  restart             Restart services"
    echo "  status              Show service status"
    echo "  logs [SERVICE]      Show logs for a service"
    echo "  clean               Clean up all Docker resources"
    echo "  seed                Seed the database with test data"
    echo "  help                Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start           # Start services"
    echo "  $0 logs mongodb    # Show MongoDB logs"
    echo "  $0 clean           # Clean up all resources"
}

# Main script logic
case "${1:-help}" in
    "start")
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs "$2"
        ;;
    "clean")
        clean_up
        ;;
    "seed")
        seed_database
        ;;
    "help"|*)
        show_help
        ;;
esac 
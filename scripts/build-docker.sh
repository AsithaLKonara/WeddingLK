#!/bin/bash

# ========================================
# WEDDINGLK DOCKER BUILD SCRIPT
# Optimized Docker builds for development and production
# ========================================

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Function to build development environment
build_dev() {
    print_status "🏗️ Building development environment..."
    
    # Clean up existing containers
    docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
    
    # Build with no cache for fresh start
    docker-compose -f docker-compose.dev.yml build --no-cache
    
    print_success "Development environment built successfully!"
}

# Function to build production environment
build_prod() {
    print_status "🏗️ Building production environment..."
    
    # Clean up existing containers
    docker-compose -f docker-compose.prod.yml down -v 2>/dev/null || true
    
    # Build with no cache for fresh start
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    print_success "Production environment built successfully!"
}

# Function to start development environment
start_dev() {
    print_status "🚀 Starting development environment..."
    docker-compose -f docker-compose.dev.yml up -d
    
    print_success "Development environment started!"
    print_status "📱 Application: http://localhost:3000"
    print_status "🗄️ MongoDB: localhost:27017"
    print_status "🔴 Redis: localhost:6379"
    print_status "📊 Mongo Express: http://localhost:8081"
}

# Function to start production environment
start_prod() {
    print_status "🚀 Starting production environment..."
    docker-compose -f docker-compose.prod.yml up -d
    
    print_success "Production environment started!"
    print_status "📱 Application: http://localhost:3000"
    print_status "🌐 Nginx: http://localhost:80, https://localhost:443"
    print_status "🗄️ MongoDB: localhost:27017"
    print_status "🔴 Redis: localhost:6379"
}

# Function to stop all environments
stop_all() {
    print_status "🛑 Stopping all environments..."
    docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml down -v 2>/dev/null || true
    print_success "All environments stopped!"
}

# Function to show logs
show_logs() {
    local env=${1:-dev}
    print_status "📋 Showing logs for $env environment..."
    
    if [ "$env" = "prod" ]; then
        docker-compose -f docker-compose.prod.yml logs -f
    else
        docker-compose -f docker-compose.dev.yml logs -f
    fi
}

# Function to show status
show_status() {
    print_status "📊 Docker containers status:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Main script logic
case "${1:-help}" in
    "dev")
        build_dev
        start_dev
        ;;
    "prod")
        build_prod
        start_prod
        ;;
    "build-dev")
        build_dev
        ;;
    "build-prod")
        build_prod
        ;;
    "start-dev")
        start_dev
        ;;
    "start-prod")
        start_prod
        ;;
    "stop")
        stop_all
        ;;
    "logs")
        show_logs "$2"
        ;;
    "status")
        show_status
        ;;
    "clean")
        print_status "🧹 Cleaning up Docker resources..."
        docker system prune -a -f --volumes
        print_success "Cleanup completed!"
        ;;
    "help"|*)
        echo "🚀 WEDDINGLK DOCKER BUILD SCRIPT"
        echo "=================================="
        echo ""
        echo "Usage: $0 [COMMAND]"
        echo ""
        echo "Commands:"
        echo "  dev          Build and start development environment"
        echo "  prod         Build and start production environment"
        echo "  build-dev    Build development environment only"
        echo "  build-prod   Build production environment only"
        echo "  start-dev    Start development environment"
        echo "  start-prod   Start production environment"
        echo "  stop         Stop all environments"
        echo "  logs [env]   Show logs (dev/prod)"
        echo "  status       Show container status"
        echo "  clean        Clean up Docker resources"
        echo "  help         Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 dev       # Build and start development"
        echo "  $0 prod      # Build and start production"
        echo "  $0 logs dev  # Show development logs"
        ;;
esac 
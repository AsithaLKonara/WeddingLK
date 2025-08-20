#!/bin/bash

# Comprehensive Production Build Script for WeddingLK
# This script builds and deploys the complete production stack

set -e

# Configuration
PROJECT_NAME="weddinglk"
APP_IMAGE="weddinglk/app:production"
NGINX_IMAGE="nginx:1.25-alpine"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking build prerequisites..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Check if env.production exists
    if [ ! -f "env.production" ]; then
        log_warning "env.production not found. Creating from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example env.production
            log_success "env.production created from .env.example"
        else
            log_error "env.production not found and no .env.example to copy from."
            exit 1
        fi
    fi
    
    # Check if nginx directory exists
    if [ ! -d "nginx" ]; then
        log_warning "nginx directory not found. Creating..."
        mkdir -p nginx
    fi
    
    log_success "Prerequisites check passed"
}

# Clean previous builds
clean_previous_builds() {
    log_info "Cleaning previous builds..."
    
    # Stop and remove existing containers
    docker-compose -f docker-compose.production.yml down 2>/dev/null || true
    
    # Remove old images
    docker rmi $APP_IMAGE 2>/dev/null || true
    
    # Clean Next.js build artifacts
    rm -rf .next
    rm -rf out
    
    log_success "Previous builds cleaned"
}

# Build the application
build_application() {
    log_info "Building WeddingLK application..."
    
    # Install dependencies
    log_info "Installing dependencies..."
    npm ci --legacy-peer-deps
    
    # Build the application
    log_info "Building Next.js application..."
    npm run build
    
    log_success "Application built successfully"
}

# Build Docker image
build_docker_image() {
    log_info "Building Docker image..."
    
    # Build the production image
    docker build -f Dockerfile.production -t $APP_IMAGE .
    
    log_success "Docker image built successfully"
}

# Create SSL certificates (self-signed for development)
create_ssl_certificates() {
    log_info "Creating SSL certificates..."
    
    # Create nginx/ssl directory
    mkdir -p nginx/ssl
    
    # Generate self-signed certificate
    if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout nginx/ssl/key.pem \
            -out nginx/ssl/cert.pem \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
        log_success "SSL certificates created"
    else
        log_info "SSL certificates already exist"
    fi
}

# Deploy the stack
deploy_stack() {
    log_info "Deploying production stack..."
    
    # Start the stack
    docker-compose -f docker-compose.production.yml up -d
    
    log_success "Production stack deployed successfully"
}

# Health check
health_check() {
    log_info "Performing health checks..."
    
    # Wait for services to start
    sleep 30
    
    # Check app health
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        log_success "Application is healthy"
    else
        log_warning "Application health check failed"
    fi
    
    # Check nginx
    if curl -f http://localhost/nginx-health > /dev/null 2>&1; then
        log_success "Nginx is healthy"
    else
        log_warning "Nginx health check failed"
    fi
    
    # Check MongoDB
    if docker exec weddinglk-mongo mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        log_success "MongoDB is healthy"
    else
        log_warning "MongoDB health check failed"
    fi
    
    # Check Redis
    if docker exec weddinglk-redis redis-cli ping > /dev/null 2>&1; then
        log_success "Redis is healthy"
    else
        log_warning "Redis health check failed"
    fi
}

# Show deployment info
show_deployment_info() {
    log_success "🎉 Production deployment completed!"
    echo ""
    echo "📱 Application: http://localhost:3000"
    echo "🌐 Nginx: http://localhost:80 (redirects to HTTPS)"
    echo "🔒 HTTPS: https://localhost:443"
    echo "🗄️  MongoDB: localhost:27017"
    echo "🔴 Redis: localhost:6379"
    echo "📊 Mongo Express: http://localhost:8081"
    echo ""
    echo "📋 Useful commands:"
    echo "  View logs: docker-compose -f docker-compose.production.yml logs -f"
    echo "  Stop stack: docker-compose -f docker-compose.production.yml down"
    echo "  Restart: docker-compose -f docker-compose.production.yml restart"
    echo ""
}

# Main build process
main() {
    local action=${1:-"deploy"}
    
    case $action in
        "build")
            log_info "Starting production build..."
            check_prerequisites
            clean_previous_builds
            build_application
            build_docker_image
            log_success "Production build completed successfully!"
            ;;
        "deploy")
            log_info "Starting complete production deployment..."
            check_prerequisites
            clean_previous_builds
            build_application
            build_docker_image
            create_ssl_certificates
            deploy_stack
            health_check
            show_deployment_info
            ;;
        "clean")
            log_info "Cleaning build artifacts..."
            clean_previous_builds
            log_success "Clean completed"
            ;;
        "health")
            health_check
            ;;
        *)
            log_error "Unknown action: $action"
            log_info "Usage: $0 [build|deploy|clean|health]"
            exit 1
            ;;
    esac
}

# Run main function
main "$@" 
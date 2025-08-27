#!/bin/bash

# Docker Test Script for WeddingLK
# This script runs comprehensive tests inside Docker containers

set -e

echo "🚀 Starting Docker Test Pipeline for WeddingLK..."

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

# Function to build Docker images
build_images() {
    print_status "Building Docker images..."
    
    # Build development image
    docker build -f Dockerfile.dev -t weddinglk:dev .
    print_success "Development image built successfully"
    
    # Build production image
    docker build -f Dockerfile -t weddinglk:prod .
    print_success "Production image built successfully"
}

# Function to start services
start_services() {
    print_status "Starting Docker services..."
    
    # Start development services
    docker-compose up -d mongodb redis
    print_success "MongoDB and Redis started"
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check MongoDB health
    if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        print_success "MongoDB is healthy"
    else
        print_error "MongoDB health check failed"
        exit 1
    fi
    
    # Check Redis health
    if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        print_success "Redis is healthy"
    else
        print_error "Redis health check failed"
        exit 1
    fi
}

# Function to run tests
run_tests() {
    print_status "Running tests inside Docker container..."
    
    # Run unit tests
    print_status "Running unit tests..."
    docker run --rm \
        --network weddinglk-nextjs_weddinglk-network \
        -e MONGODB_URI=mongodb://mongodb:27017/weddinglk_test \
        -e REDIS_URL=redis://redis:6379 \
        -e NODE_ENV=test \
        weddinglk:dev \
        npm run test:unit
    
    print_success "Unit tests completed"
    
    # Run API tests
    print_status "Running API tests..."
    docker run --rm \
        --network weddinglk-nextjs_weddinglk-network \
        -e MONGODB_URI=mongodb://mongodb:27017/weddinglk_test \
        -e REDIS_URL=redis://redis:6379 \
        -e NODE_ENV=test \
        weddinglk:dev \
        npm run test:api
    
    print_success "API tests completed"
    
    # Run integration tests
    print_status "Running integration tests..."
    docker run --rm \
        --network weddinglk-nextjs_weddinglk-network \
        -e MONGODB_URI=mongodb://mongodb:27017/weddinglk_test \
        -e REDIS_URL=redis://redis:6379 \
        -e NODE_ENV=test \
        weddinglk:dev \
        npm run test:integration
    
    print_success "Integration tests completed"
}

# Function to run performance tests
run_performance_tests() {
    print_status "Running performance tests..."
    
    # Start the application
    docker-compose up -d app
    
    # Wait for app to be ready
    print_status "Waiting for application to be ready..."
    sleep 15
    
    # Run k6 performance tests
    if command -v k6 &> /dev/null; then
        print_status "Running k6 load tests..."
        k6 run --out influxdb=http://localhost:8086/k6 k6-load-test.js
        print_success "Performance tests completed"
    else
        print_warning "k6 not found, skipping performance tests"
    fi
}

# Function to run security tests
run_security_tests() {
    print_status "Running security tests..."
    
    # Run npm audit
    print_status "Running npm audit..."
    docker run --rm weddinglk:dev npm audit --audit-level=moderate
    
    # Run OWASP ZAP security scan (if available)
    if command -v zap-baseline.py &> /dev/null; then
        print_status "Running OWASP ZAP security scan..."
        zap-baseline.py -t http://localhost:3000
        print_success "Security scan completed"
    else
        print_warning "OWASP ZAP not found, skipping security scan"
    fi
}

# Function to generate test report
generate_report() {
    print_status "Generating test report..."
    
    # Create reports directory
    mkdir -p reports
    
    # Generate coverage report
    docker run --rm \
        --network weddinglk-nextjs_weddinglk-network \
        -v $(pwd)/reports:/app/reports \
        weddinglk:dev \
        npm run test:coverage
    
    print_success "Test report generated in reports/ directory"
}

# Function to cleanup
cleanup() {
    print_status "Cleaning up Docker resources..."
    
    # Stop all services
    docker-compose down
    
    # Remove test images
    docker rmi weddinglk:dev weddinglk:prod 2>/dev/null || true
    
    print_success "Cleanup completed"
}

# Main execution
main() {
    echo "=========================================="
    echo "🐳 WeddingLK Docker Test Pipeline"
    echo "=========================================="
    
    # Check prerequisites
    check_docker
    
    # Build and test
    build_images
    start_services
    run_tests
    run_performance_tests
    run_security_tests
    generate_report
    
    echo "=========================================="
    print_success "All tests completed successfully! 🎉"
    echo "=========================================="
    
    # Ask user if they want to cleanup
    read -p "Do you want to cleanup Docker resources? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cleanup
    fi
}

# Trap to cleanup on script exit
trap cleanup EXIT

# Run main function
main "$@"

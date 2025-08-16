#!/bin/bash

# Docker Build Script for WeddingLK
# Usage: ./scripts/docker-build.sh [dev|prod|all]

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

# Function to build Docker image
build_image() {
    local target=$1
    local tag=$2
    
    print_status "Building Docker image for target: $target"
    
    if docker build --target $target -t weddinglk:$tag .; then
        print_success "Successfully built weddinglk:$tag"
    else
        print_error "Failed to build weddinglk:$tag"
        exit 1
    fi
}

# Function to build all images
build_all() {
    print_status "Building all Docker images..."
    
    # Build development image
    build_image "base" "dev"
    
    # Build production image
    build_image "production" "prod"
    
    print_success "All images built successfully!"
}

# Main script logic
case "${1:-all}" in
    "dev")
        print_status "Building development image only..."
        build_image "base" "dev"
        ;;
    "prod")
        print_status "Building production image only..."
        build_image "production" "prod"
        ;;
    "all")
        build_all
        ;;
    *)
        print_error "Invalid option. Use: dev, prod, or all"
        echo "Usage: $0 [dev|prod|all]"
        exit 1
        ;;
esac

# Show built images
print_status "Docker images:"
docker images | grep weddinglk

print_success "Build process completed!" 
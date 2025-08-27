#!/bin/bash

# Production Deployment Script for WeddingLK
# This script deploys the application to a production VPS/cloud environment

set -e

echo "🚀 Starting Production Deployment for WeddingLK..."

# Configuration
APP_NAME="weddinglk"
DEPLOY_USER="deploy"
DEPLOY_HOST="${DEPLOY_HOST:-your-vps-ip}"
DEPLOY_PATH="/opt/weddinglk"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-}"
DOCKER_IMAGE="${DOCKER_IMAGE:-weddinglk:latest}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if [ -z "$DEPLOY_HOST" ] || [ "$DEPLOY_HOST" = "your-vps-ip" ]; then
        print_error "Please set DEPLOY_HOST environment variable"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed locally"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed locally"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to build production image
build_production_image() {
    print_status "Building production Docker image..."
    
    docker build -f Dockerfile -t $DOCKER_IMAGE .
    print_success "Production image built successfully"
}

# Function to run tests before deployment
run_pre_deployment_tests() {
    print_status "Running pre-deployment tests..."
    
    # Run unit tests
    npm run test:unit
    
    # Run API tests
    npm run test:api
    
    # Run build check
    npm run build
    
    print_success "Pre-deployment tests passed"
}

# Function to deploy to production
deploy_to_production() {
    print_status "Deploying to production server..."
    
    # Create deployment package
    print_status "Creating deployment package..."
    tar -czf deployment.tar.gz \
        --exclude=node_modules \
        --exclude=.next \
        --exclude=.git \
        --exclude=coverage \
        --exclude=reports \
        .
    
    # Copy files to server
    print_status "Copying files to production server..."
    scp deployment.tar.gz $DEPLOY_USER@$DEPLOY_HOST:/tmp/
    scp docker-compose.production.yml $DEPLOY_USER@$DEPLOY_HOST:/tmp/
    scp scripts/mongo-init.js $DEPLOY_USER@$DEPLOY_HOST:/tmp/
    
    # Execute deployment on server
    print_status "Executing deployment on production server..."
    ssh $DEPLOY_USER@$DEPLOY_HOST << 'EOF'
        set -e
        
        # Create deployment directory
        sudo mkdir -p $DEPLOY_PATH
        sudo chown $DEPLOY_USER:$DEPLOY_USER $DEPLOY_PATH
        
        # Extract deployment package
        cd $DEPLOY_PATH
        tar -xzf /tmp/deployment.tar.gz
        
        # Copy configuration files
        cp /tmp/docker-compose.production.yml docker-compose.yml
        mkdir -p scripts
        cp /tmp/mongo-init.js scripts/
        
        # Create environment file
        if [ ! -f .env ]; then
            echo "Please create .env file with production configuration"
            exit 1
        fi
        
        # Stop existing services
        docker-compose down || true
        
        # Pull latest images
        docker-compose pull
        
        # Start services
        docker-compose up -d
        
        # Wait for services to be ready
        echo "Waiting for services to be ready..."
        sleep 30
        
        # Health check
        if curl -f http://localhost/health > /dev/null 2>&1; then
            echo "✅ Application is healthy"
        else
            echo "❌ Application health check failed"
            exit 1
        fi
        
        # Cleanup
        rm -f /tmp/deployment.tar.gz
        rm -f /tmp/docker-compose.production.yml
        rm -f /tmp/mongo-init.js
        
        echo "🚀 Deployment completed successfully!"
EOF
    
    print_success "Deployment completed successfully"
}

# Function to run post-deployment tests
run_post_deployment_tests() {
    print_status "Running post-deployment tests..."
    
    # Wait for application to be ready
    sleep 10
    
    # Test health endpoint
    if curl -f http://$DEPLOY_HOST/health > /dev/null 2>&1; then
        print_success "Production health check passed"
    else
        print_error "Production health check failed"
        exit 1
    fi
    
    # Test main application
    if curl -f http://$DEPLOY_HOST > /dev/null 2>&1; then
        print_success "Production application is accessible"
    else
        print_error "Production application is not accessible"
        exit 1
    fi
    
    print_success "Post-deployment tests passed"
}

# Function to cleanup
cleanup() {
    print_status "Cleaning up deployment files..."
    rm -f deployment.tar.gz
    print_success "Cleanup completed"
}

# Main execution
main() {
    echo "=========================================="
    echo "🚀 WeddingLK Production Deployment"
    echo "=========================================="
    
    check_prerequisites
    run_pre_deployment_tests
    build_production_image
    deploy_to_production
    run_post_deployment_tests
    cleanup
    
    echo "=========================================="
    print_success "Production deployment completed successfully! 🎉"
    echo "=========================================="
    echo "Your application is now running at: http://$DEPLOY_HOST"
}

# Trap to cleanup on script exit
trap cleanup EXIT

# Run main function
main "$@"

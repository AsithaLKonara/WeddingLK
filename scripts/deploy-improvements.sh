#!/bin/bash

# WeddingLK Platform - Comprehensive Improvements Deployment Script
# This script automates the deployment of all new features and improvements

set -e  # Exit on any error

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -lt 18 ]; then
            print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
            exit 1
        fi
        print_success "Node.js version: $(node -v)"
    else
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
}

# Function to check npm version
check_npm_version() {
    if command_exists npm; then
        print_success "npm version: $(npm -v)"
    else
        print_error "npm is not installed."
        exit 1
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install new dependencies
    npm install cloudinary@^2.0.1 openai@^4.68.0 redis@^4.6.13 crypto@^1.0.1
    
    # Install all dependencies
    npm install
    
    print_success "Dependencies installed successfully"
}

# Function to set up environment
setup_environment() {
    print_status "Setting up environment..."
    
    if [ ! -f .env.local ]; then
        if [ -f env.example ]; then
            cp env.example .env.local
            print_warning "Please edit .env.local with your API keys and configuration"
        else
            print_error "env.example file not found"
            exit 1
        fi
    else
        print_warning ".env.local already exists. Please verify your configuration."
    fi
}

# Function to run database setup
setup_database() {
    print_status "Setting up database..."
    
    # Check if MongoDB is running
    if command_exists mongod; then
        print_status "MongoDB detected. Please ensure MongoDB is running."
    else
        print_warning "MongoDB not found. Please install and start MongoDB."
    fi
    
    # Run database seed if available
    if npm run | grep -q "seed"; then
        print_status "Running database seed..."
        npm run seed
    else
        print_warning "Database seed script not found. Please set up your database manually."
    fi
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    if npm run | grep -q "test"; then
        npm test
        print_success "Tests completed successfully"
    else
        print_warning "Test script not found"
    fi
}

# Function to build the application
build_application() {
    print_status "Building application..."
    
    npm run build
    
    print_success "Application built successfully"
}

# Function to start the application
start_application() {
    print_status "Starting application..."
    
    if [ "$1" = "production" ]; then
        npm start
    else
        npm run dev
    fi
}

# Function to check system requirements
check_system_requirements() {
    print_status "Checking system requirements..."
    
    check_node_version
    check_npm_version
    
    # Check available memory
    if command_exists free; then
        MEMORY_GB=$(free -g | awk '/^Mem:/{print $2}')
        if [ "$MEMORY_GB" -lt 2 ]; then
            print_warning "Recommended: At least 2GB of RAM available. Current: ${MEMORY_GB}GB"
        else
            print_success "Memory: ${MEMORY_GB}GB available"
        fi
    fi
    
    # Check disk space
    if command_exists df; then
        DISK_GB=$(df -BG . | awk 'NR==2 {print $4}' | sed 's/G//')
        if [ "$DISK_GB" -lt 5 ]; then
            print_warning "Recommended: At least 5GB of free disk space. Current: ${DISK_GB}GB"
        else
            print_success "Disk space: ${DISK_GB}GB available"
        fi
    fi
}

# Function to validate configuration
validate_configuration() {
    print_status "Validating configuration..."
    
    if [ -f .env.local ]; then
        # Check for required environment variables
        REQUIRED_VARS=(
            "MONGODB_URI"
            "NEXTAUTH_SECRET"
            "NEXTAUTH_URL"
        )
        
        for var in "${REQUIRED_VARS[@]}"; do
            if ! grep -q "^${var}=" .env.local; then
                print_warning "Missing required environment variable: ${var}"
            fi
        done
        
        print_success "Configuration validation completed"
    else
        print_error ".env.local file not found. Please run setup first."
        exit 1
    fi
}

# Function to show deployment status
show_deployment_status() {
    print_status "Deployment Status:"
    echo "=================="
    
    # Check if application is running
    if pgrep -f "next" > /dev/null; then
        print_success "Application is running"
    else
        print_warning "Application is not running"
    fi
    
    # Check if database is accessible
    if command_exists mongo; then
        if mongo --eval "db.runCommand('ping')" > /dev/null 2>&1; then
            print_success "Database is accessible"
        else
            print_warning "Database is not accessible"
        fi
    fi
    
    # Check if tests pass
    if npm run | grep -q "test"; then
        if npm test --silent > /dev/null 2>&1; then
            print_success "Tests are passing"
        else
            print_warning "Tests are failing"
        fi
    fi
}

# Function to show help
show_help() {
    echo "WeddingLK Platform - Deployment Script"
    echo "======================================"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  setup     - Initial setup (install dependencies, setup environment)"
    echo "  test      - Run tests"
    echo "  build     - Build the application"
    echo "  start     - Start the application in development mode"
    echo "  prod      - Start the application in production mode"
    echo "  deploy    - Full deployment (setup + test + build + start)"
    echo "  status    - Show deployment status"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup    # Initial setup"
    echo "  $0 deploy   # Full deployment"
    echo "  $0 status   # Check deployment status"
}

# Main deployment function
main_deployment() {
    print_status "Starting WeddingLK Platform deployment..."
    
    check_system_requirements
    install_dependencies
    setup_environment
    setup_database
    run_tests
    build_application
    validate_configuration
    
    print_success "Deployment completed successfully!"
    print_status "You can now start the application with: $0 start"
}

# Parse command line arguments
case "${1:-help}" in
    "setup")
        print_status "Running initial setup..."
        check_system_requirements
        install_dependencies
        setup_environment
        setup_database
        print_success "Setup completed successfully!"
        ;;
    "test")
        run_tests
        ;;
    "build")
        build_application
        ;;
    "start")
        start_application "development"
        ;;
    "prod")
        start_application "production"
        ;;
    "deploy")
        main_deployment
        ;;
    "status")
        show_deployment_status
        ;;
    "help"|*)
        show_help
        ;;
esac

# Show next steps
if [ "$1" = "setup" ] || [ "$1" = "deploy" ]; then
    echo ""
    echo "Next Steps:"
    echo "==========="
    echo "1. Edit .env.local with your API keys and configuration"
    echo "2. Ensure MongoDB is running"
    echo "3. Start the application: $0 start"
    echo "4. Check deployment status: $0 status"
    echo ""
    echo "For help: $0 help"
fi 
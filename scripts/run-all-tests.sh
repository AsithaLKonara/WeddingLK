#!/bin/bash

# Run All Tests Script for WeddingLK
# This script runs comprehensive tests locally

set -e

echo "🧪 Starting Comprehensive Test Suite for WeddingLK..."

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

# Function to run linting
run_lint() {
    print_status "Running ESLint..."
    npm run lint
    print_success "Linting completed"
}

# Function to run type checking
run_type_check() {
    print_status "Running TypeScript type check..."
    npm run type-check
    print_success "Type checking completed"
}

# Function to run unit tests
run_unit_tests() {
    print_status "Running unit tests..."
    npm run test:unit
    print_success "Unit tests completed"
}

# Function to run API tests
run_api_tests() {
    print_status "Running API tests..."
    npm run test:api
    print_success "API tests completed"
}

# Function to run component tests
run_component_tests() {
    print_status "Running component tests..."
    npm run test:components
    print_success "Component tests completed"
}

# Function to run coverage tests
run_coverage_tests() {
    print_status "Running coverage tests..."
    npm run test:coverage
    print_success "Coverage tests completed"
}

# Function to run build test
run_build_test() {
    print_status "Testing build process..."
    npm run build
    print_success "Build test completed"
}

# Function to run all tests
run_all_tests() {
    print_status "Running comprehensive test suite..."
    
    run_lint
    run_type_check
    run_unit_tests
    run_api_tests
    run_component_tests
    run_coverage_tests
    run_build_test
    
    print_success "All tests completed successfully! 🎉"
}

# Main execution
main() {
    echo "=========================================="
    echo "🧪 WeddingLK Comprehensive Test Suite"
    echo "=========================================="
    
    run_all_tests
    
    echo "=========================================="
    print_success "Test suite completed successfully! 🎉"
    echo "=========================================="
}

# Run main function
main "$@"

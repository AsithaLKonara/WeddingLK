#!/bin/bash

# Production Deployment Script for WeddingLK
# This script handles building, deploying, and monitoring the production environment

set -e  # Exit on any error

# Configuration
PROJECT_NAME="weddinglk"
DOCKER_COMPOSE_FILE="docker-compose.production.yml"
ENV_FILE="env.production"
HEALTH_CHECK_URL="http://localhost/api/health"
NGINX_HEALTH_URL="http://localhost/nginx-health"
GRAFANA_URL="http://localhost:3001"
PROMETHEUS_URL="http://localhost:9090"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
    log_info "Checking prerequisites..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Check if Docker Compose is available
    if ! command -v docker-compose > /dev/null 2>&1; then
        log_error "Docker Compose is not installed. Please install it and try again."
        exit 1
    fi
    
    # Check if environment file exists
    if [ ! -f "$ENV_FILE" ]; then
        log_error "Environment file $ENV_FILE not found. Please create it first."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Build production images
build_images() {
    log_info "Building production Docker images..."
    
    # Build the main application image
    docker build -f Dockerfile.production -t weddinglk/app:prod .
    
    # Build nginx image
    docker build -f nginx/Dockerfile -t weddinglk/nginx:prod ./nginx
    
    log_success "Images built successfully"
}

# Deploy the stack
deploy_stack() {
    log_info "Deploying production stack..."
    
    # Stop existing stack if running
    if docker-compose -f $DOCKER_COMPOSE_FILE ps | grep -q "Up"; then
        log_info "Stopping existing stack..."
        docker-compose -f $DOCKER_COMPOSE_FILE down
    fi
    
    # Start the stack
    docker-compose -f $DOCKER_COMPOSE_FILE up -d
    
    log_success "Stack deployment initiated"
}

# Wait for services to be healthy
wait_for_health() {
    log_info "Waiting for services to be healthy..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log_info "Health check attempt $attempt/$max_attempts..."
        
        # Check nginx health
        if curl -f -s $NGINX_HEALTH_URL > /dev/null; then
            log_success "Nginx is healthy"
        else
            log_warning "Nginx health check failed"
            attempt=$((attempt + 1))
            sleep 10
            continue
        fi
        
        # Check application health
        if curl -f -s $HEALTH_CHECK_URL > /dev/null; then
            log_success "Application is healthy"
            break
        else
            log_warning "Application health check failed"
        fi
        
        attempt=$((attempt + 1))
        sleep 10
    done
    
    if [ $attempt -gt $max_attempts ]; then
        log_error "Health check timeout. Some services may not be ready."
        return 1
    fi
    
    log_success "All services are healthy"
    return 0
}

# Run smoke tests
run_smoke_tests() {
    log_info "Running smoke tests..."
    
    local tests_passed=0
    local total_tests=0
    
    # Test 1: Basic health check
    total_tests=$((total_tests + 1))
    if curl -f -s $HEALTH_CHECK_URL > /dev/null; then
        log_success "Health check passed"
        tests_passed=$((tests_passed + 1))
    else
        log_error "Health check failed"
    fi
    
    # Test 2: Nginx health
    total_tests=$((total_tests + 1))
    if curl -f -s $NGINX_HEALTH_URL > /dev/null; then
        log_success "Nginx health check passed"
        tests_passed=$((tests_passed + 1))
    else
        log_error "Nginx health check failed"
    fi
    
    # Test 3: Load balancer test
    total_tests=$((total_tests + 1))
    local responses=""
    for i in {1..6}; do
        response=$(curl -s $HEALTH_CHECK_URL | grep -o '"instanceId"[^,]*' || echo "no-instance-id")
        responses="$responses $response"
    done
    
    if echo "$responses" | grep -q "app1\|app2\|app3"; then
        log_success "Load balancer test passed"
        tests_passed=$((tests_passed + 1))
    else
        log_warning "Load balancer test inconclusive"
    fi
    
    # Test 4: API endpoints
    total_tests=$((total_tests + 1))
    if curl -f -s "http://localhost/api/vendors?page=1&limit=5" > /dev/null; then
        log_success "Vendors API test passed"
        tests_passed=$((tests_passed + 1))
    else
        log_error "Vendors API test failed"
    fi
    
    log_info "Smoke tests completed: $tests_passed/$total_tests passed"
    
    if [ $tests_passed -eq $total_tests ]; then
        log_success "All smoke tests passed!"
        return 0
    else
        log_warning "Some smoke tests failed"
        return 1
    fi
}

# Monitor deployment
monitor_deployment() {
    log_info "Monitoring deployment..."
    
    # Show running containers
    log_info "Running containers:"
    docker-compose -f $DOCKER_COMPOSE_FILE ps
    
    # Show logs for key services
    log_info "Recent logs from application:"
    docker-compose -f $DOCKER_COMPOSE_FILE logs --tail=20 app1
    
    # Show resource usage
    log_info "Resource usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
}

# Performance test
run_performance_test() {
    log_info "Running performance test..."
    
    local start_time=$(date +%s)
    local total_requests=10
    local successful_requests=0
    local total_response_time=0
    
    for i in $(seq 1 $total_requests); do
        local request_start=$(date +%s%3N)
        if response=$(curl -s -w "%{http_code}" $HEALTH_CHECK_URL 2>/dev/null); then
            local http_code="${response: -3}"
            local response_body="${response%???}"
            
            if [ "$http_code" = "200" ]; then
                successful_requests=$((successful_requests + 1))
                local request_end=$(date +%s%3N)
                local response_time=$((request_end - request_start))
                total_response_time=$((total_response_time + response_time))
                
                log_info "Request $i: HTTP $http_code, ${response_time}ms"
            else
                log_warning "Request $i: HTTP $http_code"
            fi
        else
            log_error "Request $i: Failed"
        fi
        
        sleep 1
    done
    
    local end_time=$(date +%s)
    local total_time=$((end_time - start_time))
    local avg_response_time=0
    
    if [ $successful_requests -gt 0 ]; then
        avg_response_time=$((total_response_time / successful_requests))
    fi
    
    log_info "Performance test results:"
    log_info "  Total requests: $total_requests"
    log_info "  Successful: $successful_requests"
    log_info "  Success rate: $((successful_requests * 100 / total_requests))%"
    log_info "  Average response time: ${avg_response_time}ms"
    log_info "  Total test time: ${total_time}s"
}

# Show monitoring URLs
show_monitoring() {
    log_info "Monitoring URLs:"
    log_info "  Grafana Dashboard: $GRAFANA_URL (admin/admin123)"
    log_info "  Prometheus: $PROMETHEUS_URL"
    log_info "  cAdvisor: http://localhost:8080"
    log_info "  Nginx Status: http://localhost/nginx-status"
}

# Rollback function
rollback() {
    log_warning "Rolling back deployment..."
    
    # Stop current stack
    docker-compose -f $DOCKER_COMPOSE_FILE down
    
    # Start previous version (if available)
    if [ -f "docker-compose.production.backup.yml" ]; then
        log_info "Starting previous version..."
        docker-compose -f docker-compose.production.backup.yml up -d
    else
        log_error "No backup found for rollback"
        exit 1
    fi
}

# Main deployment function
main() {
    local action=${1:-"deploy"}
    
    case $action in
        "deploy")
            log_info "Starting production deployment..."
            check_prerequisites
            build_images
            deploy_stack
            wait_for_health
            run_smoke_tests
            run_performance_test
            monitor_deployment
            show_monitoring
            log_success "Production deployment completed successfully!"
            ;;
        "rollback")
            rollback
            ;;
        "health")
            wait_for_health
            ;;
        "test")
            run_smoke_tests
            run_performance_test
            ;;
        "monitor")
            monitor_deployment
            show_monitoring
            ;;
        "logs")
            docker-compose -f $DOCKER_COMPOSE_FILE logs -f
            ;;
        *)
            echo "Usage: $0 {deploy|rollback|health|test|monitor|logs}"
            echo "  deploy   - Full production deployment"
            echo "  rollback - Rollback to previous version"
            echo "  health   - Check service health"
            echo "  test     - Run smoke and performance tests"
            echo "  monitor  - Show monitoring information"
            echo "  logs     - Follow application logs"
            exit 1
            ;;
    esac
}

# Handle script interruption
trap 'log_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@" 
#!/bin/bash

# WeddingLK Docker Management Script
# Usage: ./docker-scripts.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop first."
        exit 1
    fi
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed."
        exit 1
    fi
}

# Development commands
dev_start() {
    print_header "Starting Development Environment"
    check_docker
    check_docker_compose
    docker-compose -f docker-compose.dev.yml up --build -d
    print_status "Development environment started!"
    print_status "Application: http://localhost:3000"
    print_status "MongoDB Express: http://localhost:8081"
}

dev_stop() {
    print_header "Stopping Development Environment"
    docker-compose -f docker-compose.dev.yml down
    print_status "Development environment stopped!"
}

dev_logs() {
    print_header "Development Logs"
    docker-compose -f docker-compose.dev.yml logs -f
}

dev_restart() {
    print_header "Restarting Development Environment"
    dev_stop
    sleep 2
    dev_start
}

# Production commands
prod_start() {
    print_header "Starting Production Environment"
    check_docker
    check_docker_compose
    docker-compose up --build -d
    print_status "Production environment started!"
    print_status "Application: http://localhost:3000"
}

prod_stop() {
    print_header "Stopping Production Environment"
    docker-compose down
    print_status "Production environment stopped!"
}

prod_logs() {
    print_header "Production Logs"
    docker-compose logs -f
}

prod_restart() {
    print_header "Restarting Production Environment"
    prod_stop
    sleep 2
    prod_start
}

# Database commands
db_backup() {
    print_header "Creating Database Backup"
    BACKUP_DIR="./backups"
    mkdir -p $BACKUP_DIR
    BACKUP_FILE="$BACKUP_DIR/weddinglk_$(date +%Y%m%d_%H%M%S).gz"
    
    docker exec weddinglk-mongodb-1 mongodump --db weddinglk --archive | gzip > $BACKUP_FILE
    print_status "Backup created: $BACKUP_FILE"
}

db_restore() {
    if [ -z "$1" ]; then
        print_error "Please provide backup file path"
        echo "Usage: $0 db-restore <backup_file>"
        exit 1
    fi
    
    print_header "Restoring Database from Backup"
    gunzip -c "$1" | docker exec -i weddinglk-mongodb-1 mongorestore --archive --db weddinglk
    print_status "Database restored from: $1"
}

# Utility commands
cleanup() {
    print_header "Cleaning Up Docker Resources"
    print_warning "This will remove all stopped containers, unused networks, and dangling images"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker system prune -f
        docker volume prune -f
        print_status "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

status() {
    print_header "Docker Status"
    echo "Running containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo
    echo "Docker disk usage:"
    docker system df
}

logs_app() {
    print_header "Application Logs"
    if docker ps | grep -q "weddinglk-app"; then
        docker-compose logs -f weddinglk-app
    elif docker ps | grep -q "weddinglk-app-dev"; then
        docker-compose -f docker-compose.dev.yml logs -f weddinglk-app-dev
    else
        print_error "No WeddingLK application container found"
    fi
}

logs_db() {
    print_header "Database Logs"
    docker-compose logs -f mongodb
}

shell() {
    print_header "Opening Shell in Application Container"
    if docker ps | grep -q "weddinglk-app"; then
        docker exec -it weddinglk-app /bin/sh
    elif docker ps | grep -q "weddinglk-app-dev"; then
        docker exec -it weddinglk-app-dev /bin/sh
    else
        print_error "No WeddingLK application container found"
    fi
}

# Help function
show_help() {
    print_header "WeddingLK Docker Management Script"
    echo
    echo "Usage: $0 [command]"
    echo
    echo "Development Commands:"
    echo "  dev-start     Start development environment"
    echo "  dev-stop      Stop development environment"
    echo "  dev-logs      View development logs"
    echo "  dev-restart   Restart development environment"
    echo
    echo "Production Commands:"
    echo "  prod-start    Start production environment"
    echo "  prod-stop     Stop production environment"
    echo "  prod-logs     View production logs"
    echo "  prod-restart  Restart production environment"
    echo
    echo "Database Commands:"
    echo "  db-backup     Create database backup"
    echo "  db-restore    Restore database from backup"
    echo
    echo "Utility Commands:"
    echo "  cleanup       Clean up Docker resources"
    echo "  status        Show Docker status"
    echo "  logs-app      View application logs"
    echo "  logs-db       View database logs"
    echo "  shell         Open shell in application container"
    echo "  help          Show this help message"
    echo
    echo "Examples:"
    echo "  $0 dev-start"
    echo "  $0 prod-start"
    echo "  $0 db-backup"
    echo "  $0 cleanup"
}

# Main script logic
case "${1:-help}" in
    # Development commands
    "dev-start")
        dev_start
        ;;
    "dev-stop")
        dev_stop
        ;;
    "dev-logs")
        dev_logs
        ;;
    "dev-restart")
        dev_restart
        ;;
    
    # Production commands
    "prod-start")
        prod_start
        ;;
    "prod-stop")
        prod_stop
        ;;
    "prod-logs")
        prod_logs
        ;;
    "prod-restart")
        prod_restart
        ;;
    
    # Database commands
    "db-backup")
        db_backup
        ;;
    "db-restart")
        db_restore "$2"
        ;;
    
    # Utility commands
    "cleanup")
        cleanup
        ;;
    "status")
        status
        ;;
    "logs-app")
        logs_app
        ;;
    "logs-db")
        logs_db
        ;;
    "shell")
        shell
        ;;
    
    # Help
    "help"|*)
        show_help
        ;;
esac 
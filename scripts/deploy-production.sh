#!/bin/bash

# Production Deployment Script for WeddingLK
# This script automates the deployment process to production

set -e  # Exit on any error

# Configuration
APP_NAME="weddinglk"
PRODUCTION_URL="yourdomain.com"
DEPLOY_USER="deploy"
DEPLOY_PATH="/var/www/weddinglk"
BACKUP_PATH="/var/backups/weddinglk"
GIT_REPO="https://github.com/yourusername/weddinglk.git"
GIT_BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root"
fi

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if required commands exist
    command -v git >/dev/null 2>&1 || error "git is required but not installed"
    command -v node >/dev/null 2>&1 || error "node is required but not installed"
    command -v npm >/dev/null 2>&1 || error "npm is required but not installed"
    command -v pm2 >/dev/null 2>&1 || error "pm2 is required but not installed"
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js 18 or higher is required (current: $(node -v))"
    fi
    
    success "Prerequisites check passed"
}

# Create backup
create_backup() {
    log "Creating backup of current deployment..."
    
    if [ -d "$DEPLOY_PATH" ]; then
        BACKUP_NAME="backup-$(date +'%Y%m%d-%H%M%S')"
        BACKUP_FULL_PATH="$BACKUP_PATH/$BACKUP_NAME"
        
        mkdir -p "$BACKUP_PATH"
        cp -r "$DEPLOY_PATH" "$BACKUP_FULL_PATH"
        
        # Keep only last 5 backups
        cd "$BACKUP_PATH"
        ls -t | tail -n +6 | xargs -r rm -rf
        
        success "Backup created: $BACKUP_NAME"
    else
        warning "No existing deployment found, skipping backup"
    fi
}

# Clone/update repository
update_repository() {
    log "Updating repository..."
    
    if [ -d "$DEPLOY_PATH" ]; then
        cd "$DEPLOY_PATH"
        git fetch origin
        git reset --hard origin/$GIT_BRANCH
        success "Repository updated"
    else
        log "Cloning repository..."
        git clone -b $GIT_BRANCH $GIT_REPO "$DEPLOY_PATH"
        success "Repository cloned"
    fi
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    cd "$DEPLOY_PATH"
    
    # Clean install
    rm -rf node_modules package-lock.json
    npm ci --production
    
    success "Dependencies installed"
}

# Build application
build_application() {
    log "Building application..."
    
    cd "$DEPLOY_PATH"
    
    # Set production environment
    export NODE_ENV=production
    
    # Build the application
    npm run build
    
    success "Application built successfully"
}

# Run tests
run_tests() {
    log "Running tests..."
    
    cd "$DEPLOY_PATH"
    
    # Run unit tests
    npm run test:unit || warning "Unit tests failed, but continuing deployment"
    
    # Run integration tests
    npm run test:integration || warning "Integration tests failed, but continuing deployment"
    
    success "Tests completed"
}

# Update environment configuration
update_environment() {
    log "Updating environment configuration..."
    
    cd "$DEPLOY_PATH"
    
    # Copy production environment file
    if [ -f "deploy/production.env.example" ]; then
        cp deploy/production.env.example .env.production
        warning "Please update .env.production with your actual values"
    fi
    
    # Ensure environment file exists
    if [ ! -f ".env.production" ]; then
        error ".env.production file not found. Please create it with your production configuration."
    fi
    
    success "Environment configuration updated"
}

# Setup PM2 process
setup_pm2() {
    log "Setting up PM2 process..."
    
    cd "$DEPLOY_PATH"
    
    # Create PM2 ecosystem file if it doesn't exist
    if [ ! -f "ecosystem.config.js" ]; then
        cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$DEPLOY_PATH',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF
    fi
    
    # Create logs directory
    mkdir -p logs
    
    success "PM2 configuration created"
}

# Deploy application
deploy_application() {
    log "Deploying application..."
    
    cd "$DEPLOY_PATH"
    
    # Stop existing process if running
    pm2 stop $APP_NAME 2>/dev/null || true
    pm2 delete $APP_NAME 2>/dev/null || true
    
    # Start new process
    pm2 start ecosystem.config.js --env production
    
    # Save PM2 configuration
    pm2 save
    
    # Setup PM2 startup script
    pm2 startup
    
    success "Application deployed successfully"
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Wait for application to start
    sleep 10
    
    # Check if application is responding
    if curl -f -s "http://localhost:3000/api/health" > /dev/null; then
        success "Health check passed - application is responding"
    else
        error "Health check failed - application is not responding"
    fi
}

# Setup monitoring
setup_monitoring() {
    log "Setting up monitoring..."
    
    # Install PM2 monitoring
    pm2 install pm2-logrotate
    pm2 install pm2-server-monit
    
    # Setup log rotation
    pm2 set pm2-logrotate:max_size 10M
    pm2 set pm2-logrotate:retain 7
    pm2 set pm2-logrotate:compress true
    
    success "Monitoring setup completed"
}

# Main deployment function
main() {
    log "Starting production deployment for $APP_NAME..."
    
    # Check prerequisites
    check_prerequisites
    
    # Create backup
    create_backup
    
    # Update repository
    update_repository
    
    # Install dependencies
    install_dependencies
    
    # Build application
    build_application
    
    # Run tests
    run_tests
    
    # Update environment
    update_environment
    
    # Setup PM2
    setup_pm2
    
    # Deploy application
    deploy_application
    
    # Health check
    health_check
    
    # Setup monitoring
    setup_monitoring
    
    success "Deployment completed successfully!"
    log "Your application is now running at http://localhost:3000"
    log "Use 'pm2 status' to check application status"
    log "Use 'pm2 logs $APP_NAME' to view logs"
}

# Run main function
main "$@" 
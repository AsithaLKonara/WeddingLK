module.exports = {
  apps: [{
    name: 'weddinglk',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3000',
    instances: 'max', // Use all available CPU cores
    exec_mode: 'cluster',
    max_memory_restart: '512M',
    node_args: '--max-old-space-size=512',
    
    // Environment variables
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    
    // Logging
    log_file: '/dev/stdout',
    out_file: '/dev/stdout',
    error_file: '/dev/stderr',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Monitoring
    watch: false,
    ignore_watch: ['node_modules', 'logs', '.git'],
    
    // Performance
    max_restarts: 10,
    min_uptime: '10s',
    
    // Health check
    health_check_grace_period: 3000,
    
    // Metrics
    pmx: true,
    
    // Instance identification
    instance_var: 'INSTANCE_ID'
  }]
}; 
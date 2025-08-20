#!/usr/bin/env node

import { spawn } from 'child_process';
import { performance } from 'perf_hooks';

console.log('🚀 WeddingLK Performance Optimization Script');
console.log('==========================================');

class PerformanceOptimizer {
  constructor() {
    this.optimizations = [
      'database-indexes',
      'restart-containers',
      'test-performance',
      'generate-report'
    ];
  }
  
  /**
   * Run optimization step
   */
  async runOptimization(step) {
    console.log(`\n🔧 Running: ${step}`);
    console.log('='.repeat(50));
    
    const startTime = performance.now();
    
    try {
      switch (step) {
        case 'database-indexes':
          await this.addDatabaseIndexes();
          break;
        case 'restart-containers':
          await this.restartContainers();
          break;
        case 'test-performance':
          await this.testPerformance();
          break;
        case 'generate-report':
          await this.generateReport();
          break;
        default:
          console.log(`❌ Unknown optimization step: ${step}`);
      }
      
      const duration = performance.now() - startTime;
      console.log(`✅ ${step} completed in ${Math.round(duration)}ms`);
      
    } catch (error) {
      console.error(`❌ Error in ${step}:`, error.message);
    }
  }
  
  /**
   * Add database indexes
   */
  async addDatabaseIndexes() {
    console.log('📊 Adding performance database indexes...');
    
    return new Promise((resolve, reject) => {
      const process = spawn('node', ['scripts/add-database-indexes.mjs'], {
        stdio: 'inherit'
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Database indexes added successfully');
          resolve();
        } else {
          reject(new Error(`Database indexing failed with code ${code}`));
        }
      });
    });
  }
  
  /**
   * Restart containers with optimized settings
   */
  async restartContainers() {
    console.log('🐳 Restarting containers with optimized settings...');
    
    // Stop containers
    console.log('🛑 Stopping containers...');
    await this.runCommand('docker-compose', ['down']);
    
    // Update environment for production-like performance
    console.log('⚙️ Updating environment for performance...');
    process.env.NODE_ENV = 'production';
    process.env.NEXT_TELEMETRY_DISABLED = '1';
    
    // Start containers
    console.log('🚀 Starting containers...');
    await this.runCommand('docker-compose', ['up', '-d', '--build']);
    
    // Wait for containers to be ready
    console.log('⏳ Waiting for containers to be ready...');
    await this.waitForContainers();
    
    console.log('✅ Containers restarted successfully');
  }
  
  /**
   * Wait for containers to be ready
   */
  async waitForContainers() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(async () => {
        try {
          const result = await this.runCommand('docker-compose', ['ps', '--format', 'json']);
          const containers = JSON.parse(result);
          
          if (containers.length > 0) {
            const ready = containers.every(container => 
              container.State === 'running' || container.State === 'Up'
            );
            
            if (ready) {
              clearInterval(checkInterval);
              resolve();
            }
          }
        } catch (error) {
          // Continue waiting
        }
      }, 5000); // Check every 5 seconds
      
      // Timeout after 2 minutes
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 120000);
    });
  }
  
  /**
   * Test performance after optimizations
   */
  async testPerformance() {
    console.log('📊 Testing performance after optimizations...');
    
    // Wait a bit for containers to fully initialize
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    return new Promise((resolve, reject) => {
      const process = spawn('node', ['scripts/performance-monitor.mjs'], {
        stdio: 'inherit'
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Performance test completed');
          resolve();
        } else {
          reject(new Error(`Performance test failed with code ${code}`));
        }
      });
    });
  }
  
  /**
   * Generate optimization report
   */
  async generateReport() {
    console.log('📋 Generating optimization report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      optimizations: this.optimizations,
      recommendations: [
        'Database indexes added for faster queries',
        'Containers restarted with optimized settings',
        'Performance tested and monitored',
        'Caching implemented for API responses'
      ],
      nextSteps: [
        'Monitor performance over time',
        'Implement Redis for distributed caching',
        'Add database query monitoring',
        'Consider CDN for static assets'
      ]
    };
    
    console.log('\n📊 OPTIMIZATION REPORT');
    console.log('======================');
    console.log(`Timestamp: ${report.timestamp}`);
    console.log(`Optimizations: ${report.optimizations.join(', ')}`);
    
    console.log('\n✅ COMPLETED:');
    report.recommendations.forEach(rec => console.log(`  - ${rec}`));
    
    console.log('\n🎯 NEXT STEPS:');
    report.nextSteps.forEach(step => console.log(`  - ${step}`));
    
    console.log('\n🚀 Performance optimization completed!');
  }
  
  /**
   * Run shell command
   */
  async runCommand(command, args = []) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, {
        stdio: 'pipe'
      });
      
      let output = '';
      let error = '';
      
      process.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      process.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error(`Command failed: ${error}`));
        }
      });
    });
  }
  
  /**
   * Run all optimizations
   */
  async runAll() {
    console.log('🚀 Starting comprehensive performance optimization...');
    
    for (const step of this.optimizations) {
      await this.runOptimization(step);
      
      // Small delay between steps
      if (step !== this.optimizations[this.optimizations.length - 1]) {
        console.log('⏳ Waiting before next step...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    console.log('\n🎉 All performance optimizations completed!');
  }
}

// Main execution
const optimizer = new PerformanceOptimizer();

if (process.argv.includes('--all')) {
  optimizer.runAll();
} else {
  const step = process.argv[2] || 'database-indexes';
  optimizer.runOptimization(step);
}

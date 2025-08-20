#!/usr/bin/env node

import { spawn } from 'child_process';
import { performance } from 'perf_hooks';

console.log('🚀 WeddingLK Performance Monitor Started');
console.log('==========================================');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      totalTime: 0,
      slowRequests: [],
      errors: 0,
      startTime: Date.now()
    };
    
    this.endpoints = [
      '/api/health',
      '/api/vendors',
      '/api/venues',
      '/api/ai-search?q=wedding%20photographer',
      '/api/home/stats',
      '/api/home/featured-vendors'
    ];
  }
  
  /**
   * Test endpoint performance
   */
  async testEndpoint(endpoint) {
    const startTime = performance.now();
    const url = `http://localhost:3000${endpoint}`;
    
    try {
      const response = await fetch(url);
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.metrics.requests++;
      this.metrics.totalTime += duration;
      
      if (duration > 5000) { // 5 seconds threshold
        this.metrics.slowRequests.push({
          endpoint,
          duration: Math.round(duration),
          timestamp: new Date().toISOString()
        });
      }
      
      const status = response.ok ? '✅' : '❌';
      console.log(`${status} ${endpoint}: ${Math.round(duration)}ms (${response.status})`);
      
      return { success: true, duration, status: response.status };
      
    } catch (error) {
      this.metrics.errors++;
      console.log(`❌ ${endpoint}: ERROR - ${error.message}`);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Run performance test suite
   */
  async runPerformanceTest() {
    console.log('\n🔥 Running Performance Test Suite...');
    console.log('=====================================');
    
    const startTime = performance.now();
    
    // Test all endpoints
    for (const endpoint of this.endpoints) {
      await this.testEndpoint(endpoint);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const totalTime = performance.now() - startTime;
    
    // Display results
    this.displayResults(totalTime);
    
    // Generate recommendations
    this.generateRecommendations();
  }
  
  /**
   * Display performance results
   */
  displayResults(totalTime) {
    console.log('\n📊 PERFORMANCE TEST RESULTS');
    console.log('============================');
    console.log(`Total Requests: ${this.metrics.requests}`);
    console.log(`Total Test Time: ${Math.round(totalTime)}ms`);
    console.log(`Average Response Time: ${Math.round(this.metrics.totalTime / this.metrics.requests)}ms`);
    console.log(`Errors: ${this.metrics.errors}`);
    
    if (this.metrics.slowRequests.length > 0) {
      console.log('\n🐌 SLOW REQUESTS (>5s):');
      this.metrics.slowRequests.forEach(req => {
        console.log(`  - ${req.endpoint}: ${req.duration}ms at ${req.timestamp}`);
      });
    }
  }
  
  /**
   * Generate performance recommendations
   */
  generateRecommendations() {
    console.log('\n💡 PERFORMANCE RECOMMENDATIONS');
    console.log('================================');
    
    const avgTime = this.metrics.totalTime / this.metrics.requests;
    
    if (avgTime > 10000) {
      console.log('🚨 CRITICAL: Average response time > 10s');
      console.log('   - Implement aggressive caching');
      console.log('   - Add database indexes');
      console.log('   - Consider production build');
    } else if (avgTime > 5000) {
      console.log('⚠️  WARNING: Average response time > 5s');
      console.log('   - Add response caching');
      console.log('   - Optimize database queries');
      console.log('   - Use lean() queries');
    } else if (avgTime > 2000) {
      console.log('📈 IMPROVEMENT: Average response time > 2s');
      console.log('   - Add Redis caching');
      console.log('   - Implement pagination');
      console.log('   - Add database indexes');
    } else {
      console.log('✅ EXCELLENT: Response times under 2s');
      console.log('   - Consider adding monitoring');
      console.log('   - Implement load testing');
    }
    
    if (this.metrics.slowRequests.length > 0) {
      console.log('\n🔧 SPECIFIC OPTIMIZATIONS:');
      this.metrics.slowRequests.forEach(req => {
        if (req.endpoint.includes('ai-search')) {
          console.log(`   - AI Search: Implement caching and pre-computed embeddings`);
        } else if (req.endpoint.includes('stats')) {
          console.log(`   - Stats: Use aggregation pipelines and caching`);
        } else if (req.endpoint.includes('vendors') || req.endpoint.includes('venues')) {
          console.log(`   - Data: Add database indexes and use lean() queries`);
        }
      });
    }
  }
  
  /**
   * Monitor system resources
   */
  async monitorSystemResources() {
    console.log('\n💻 SYSTEM RESOURCE MONITORING');
    console.log('==============================');
    
    try {
      // Check Docker container stats
      const dockerStats = spawn('docker', ['stats', '--no-stream', '--format', 'table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}']);
      
      dockerStats.stdout.on('data', (data) => {
        console.log(data.toString());
      });
      
      dockerStats.stderr.on('data', (data) => {
        console.log('Docker stats error:', data.toString());
      });
      
    } catch (error) {
      console.log('❌ Could not get Docker stats:', error.message);
    }
  }
  
  /**
   * Continuous monitoring mode
   */
  async startContinuousMonitoring() {
    console.log('\n🔄 Starting Continuous Monitoring...');
    console.log('Press Ctrl+C to stop');
    
    setInterval(async () => {
      console.log(`\n⏰ ${new Date().toLocaleTimeString()} - Health Check`);
      await this.testEndpoint('/api/health');
    }, 30000); // Every 30 seconds
  }
}

// Main execution
const monitor = new PerformanceMonitor();

if (process.argv.includes('--continuous')) {
  monitor.startContinuousMonitoring();
} else if (process.argv.includes('--system')) {
  monitor.monitorSystemResources();
} else {
  monitor.runPerformanceTest();
} 
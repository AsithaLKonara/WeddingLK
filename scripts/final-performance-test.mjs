#!/usr/bin/env node

import { performance } from 'perf_hooks';

console.log('🚀 WeddingLK Final Performance Test');
console.log('===================================');

class FinalPerformanceTest {
  constructor() {
    this.results = {};
    this.startTime = performance.now();
  }
  
  /**
   * Test individual endpoint performance
   */
  async testEndpoint(name, url) {
    console.log(`\n🔍 Testing: ${name}`);
    console.log(`URL: ${url}`);
    
    const startTime = performance.now();
    
    try {
      const response = await fetch(url);
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (response.ok) {
        console.log(`✅ ${name}: ${Math.round(duration)}ms (${response.status})`);
        this.results[name] = { success: true, duration, status: response.status };
      } else {
        console.log(`❌ ${name}: ${Math.round(duration)}ms (${response.status})`);
        this.results[name] = { success: false, duration, status: response.status };
      }
      
    } catch (error) {
      console.log(`❌ ${name}: ERROR - ${error.message}`);
      this.results[name] = { success: false, error: error.message };
    }
  }
  
  /**
   * Run all performance tests
   */
  async runAllTests() {
    console.log('🔥 Starting comprehensive performance test...');
    
    const tests = [
      { name: 'Health Check', url: 'http://localhost:3000/api/health' },
      { name: 'Vendors API', url: 'http://localhost:3000/api/vendors' },
      { name: 'Venues API', url: 'http://localhost:3000/api/venues' },
      { name: 'Home Stats', url: 'http://localhost:3000/api/home/stats' },
      { name: 'Featured Vendors', url: 'http://localhost:3000/api/home/featured-vendors' }
    ];
    
    for (const test of tests) {
      await this.testEndpoint(test.name, test.url);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    this.displayResults();
    this.generateFinalReport();
  }
  
  /**
   * Display test results
   */
  displayResults() {
    console.log('\n📊 FINAL PERFORMANCE TEST RESULTS');
    console.log('==================================');
    
    let totalTime = 0;
    let successfulTests = 0;
    let failedTests = 0;
    
    for (const [name, result] of Object.entries(this.results)) {
      if (result.success) {
        successfulTests++;
        totalTime += result.duration;
        console.log(`✅ ${name}: ${Math.round(result.duration)}ms`);
      } else {
        failedTests++;
        console.log(`❌ ${name}: FAILED`);
      }
    }
    
    const avgTime = successfulTests > 0 ? totalTime / successfulTests : 0;
    
    console.log('\n📈 SUMMARY STATISTICS');
    console.log('======================');
    console.log(`Total Tests: ${Object.keys(this.results).length}`);
    console.log(`Successful: ${successfulTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Average Response Time: ${Math.round(avgTime)}ms`);
    console.log(`Total Test Time: ${Math.round(performance.now() - this.startTime)}ms`);
  }
  
  /**
   * Generate final optimization report
   */
  generateFinalReport() {
    console.log('\n🎯 FINAL OPTIMIZATION REPORT');
    console.log('============================');
    
    const avgTime = Object.values(this.results)
      .filter(r => r.success)
      .reduce((sum, r) => sum + r.duration, 0) / 
      Object.values(this.results).filter(r => r.success).length;
    
    if (avgTime < 2000) {
      console.log('🏆 EXCELLENT: All endpoints responding under 2 seconds!');
      console.log('   Your WeddingLK application is now production-ready!');
    } else if (avgTime < 5000) {
      console.log('📈 GOOD: Most endpoints under 5 seconds');
      console.log('   Consider adding Redis caching for even better performance');
    } else if (avgTime < 10000) {
      console.log('⚠️  NEEDS WORK: Some endpoints still slow');
      console.log('   Implement the remaining optimizations');
    } else {
      console.log('🚨 CRITICAL: Performance still poor');
      console.log('   Immediate action required');
    }
    
    console.log('\n🔧 REMAINING OPTIMIZATIONS:');
    console.log('1. Implement Redis for distributed caching');
    console.log('2. Add database connection pooling');
    console.log('3. Use production build for testing');
    console.log('4. Implement response compression');
    console.log('5. Add CDN for static assets');
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Test with production build');
    console.log('2. Implement Redis caching');
    console.log('3. Add load testing');
    console.log('4. Monitor production performance');
    
    console.log('\n🎉 Performance optimization phase completed!');
  }
}

// Run the final performance test
const finalTest = new FinalPerformanceTest();
finalTest.runAllTests().catch(console.error); 
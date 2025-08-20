#!/usr/bin/env node

/**
 * Production Performance Test for WeddingLK
 * This script tests the production deployment performance
 */

import { performance } from 'perf_hooks';
import http from 'http';
import https from 'https';

// Configuration
const CONFIG = {
  baseUrl: process.env.TEST_URL || 'http://localhost',
  endpoints: [
    '/api/health',
    '/api/home/stats',
    '/api/vendors?page=1&limit=24',
    '/api/venues?page=1&limit=24',
    '/api/ai-search?q=wedding%20photographer',
    '/api/home/featured-vendors',
    '/nginx-health'
  ],
  testDuration: 60000, // 1 minute
  concurrentUsers: 10,
  requestInterval: 1000, // 1 second between requests
  timeout: 30000 // 30 seconds timeout
};

// Performance metrics
const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  responseTimes: [],
  errors: [],
  startTime: 0,
  endTime: 0
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Logging functions
function log(message, color = 'reset') {
  const timestamp = new Date().toISOString();
  console.log(`${colors[color]}[${timestamp}]${colors.reset} ${message}`);
}

function logInfo(message) {
  log(message, 'blue');
}

function logSuccess(message) {
  log(message, 'green');
}

function logWarning(message) {
  log(message, 'yellow');
}

function logError(message) {
  log(message, 'red');
}

function logHeader(message) {
  log(message, 'cyan');
}

// HTTP request function
async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const urlObj = new URL(url);
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout: CONFIG.timeout,
      headers: {
        'User-Agent': 'WeddingLK-Performance-Test/1.0',
        'Accept': 'application/json,text/html,*/*',
        'Cache-Control': 'no-cache'
      },
      ...options
    };
    
    const client = urlObj.protocol === 'https:' ? https : http;
    const req = client.request(requestOptions, (res) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          responseTime,
          headers: res.headers,
          data: data.substring(0, 1000) // Limit data size for logging
        });
      });
    });
    
    req.on('error', (error) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      reject({
        error: error.message,
        responseTime
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject({
        error: 'Request timeout',
        responseTime: CONFIG.timeout
      });
    });
    
    req.end();
  });
}

// Test single endpoint
async function testEndpoint(endpoint) {
  const url = `${CONFIG.baseUrl}${endpoint}`;
  
  try {
    const result = await makeRequest(url);
    
    // Update metrics
    metrics.totalRequests++;
    metrics.successfulRequests++;
    metrics.responseTimes.push(result.responseTime);
    
    // Log success
    if (result.statusCode === 200) {
      logSuccess(`✅ ${endpoint} - ${result.statusCode} (${result.responseTime.toFixed(2)}ms)`);
    } else {
      logWarning(`⚠️ ${endpoint} - ${result.statusCode} (${result.responseTime.toFixed(2)}ms)`);
    }
    
    return result;
  } catch (error) {
    // Update metrics
    metrics.totalRequests++;
    metrics.failedRequests++;
    metrics.errors.push({
      endpoint,
      error: error.error,
      responseTime: error.responseTime
    });
    
    logError(`❌ ${endpoint} - ${error.error} (${error.responseTime.toFixed(2)}ms)`);
    return error;
  }
}

// Calculate statistics
function calculateStats(numbers) {
  if (numbers.length === 0) return null;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = numbers.reduce((a, b) => a + b, 0);
  const mean = sum / numbers.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];
  
  return {
    count: numbers.length,
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    mean: mean.toFixed(2),
    median: median.toFixed(2),
    p95: p95.toFixed(2),
    p99: p99.toFixed(2)
  };
}

// Generate performance report
function generateReport() {
  const totalTime = (metrics.endTime - metrics.startTime) / 1000;
  const successRate = (metrics.successfulRequests / metrics.totalRequests) * 100;
  const responseTimeStats = calculateStats(metrics.responseTimes);
  
  logHeader('\n📊 PERFORMANCE TEST REPORT');
  logHeader('=' .repeat(50));
  
  // Summary
  logInfo(`Test Duration: ${totalTime.toFixed(2)}s`);
  logInfo(`Total Requests: ${metrics.totalRequests}`);
  logInfo(`Successful: ${metrics.successfulRequests}`);
  logInfo(`Failed: ${metrics.failedRequests}`);
  logInfo(`Success Rate: ${successRate.toFixed(2)}%`);
  
  // Response time statistics
  if (responseTimeStats) {
    logHeader('\n⏱️ RESPONSE TIME STATISTICS');
    logInfo(`Count: ${responseTimeStats.count}`);
    logInfo(`Min: ${responseTimeStats.min}ms`);
    logInfo(`Max: ${responseTimeStats.max}ms`);
    logInfo(`Mean: ${responseTimeStats.mean}ms`);
    logInfo(`Median: ${responseTimeStats.median}ms`);
    logInfo(`P95: ${responseTimeStats.p95}ms`);
    logInfo(`P99: ${responseTimeStats.p99}ms`);
  }
  
  // Performance assessment
  logHeader('\n🎯 PERFORMANCE ASSESSMENT');
  if (responseTimeStats) {
    if (responseTimeStats.p95 < 1000) {
      logSuccess('✅ Excellent: P95 response time < 1000ms');
    } else if (responseTimeStats.p95 < 2000) {
      logWarning('⚠️ Good: P95 response time < 2000ms');
    } else if (responseTimeStats.p95 < 5000) {
      logWarning('⚠️ Fair: P95 response time < 5000ms');
    } else {
      logError('❌ Poor: P95 response time > 5000ms - needs optimization');
    }
    
    if (successRate > 99) {
      logSuccess('✅ Excellent: Success rate > 99%');
    } else if (successRate > 95) {
      logWarning('⚠️ Good: Success rate > 95%');
    } else {
      logError('❌ Poor: Success rate < 95% - needs investigation');
    }
  }
  
  // Error analysis
  if (metrics.errors.length > 0) {
    logHeader('\n🚨 ERROR ANALYSIS');
    const errorCounts = {};
    metrics.errors.forEach(error => {
      errorCounts[error.error] = (errorCounts[error.error] || 0) + 1;
    });
    
    Object.entries(errorCounts).forEach(([error, count]) => {
      logError(`${error}: ${count} occurrences`);
    });
  }
  
  // Recommendations
  logHeader('\n💡 RECOMMENDATIONS');
  if (responseTimeStats && responseTimeStats.p95 > 2000) {
    logInfo('• Implement response caching for slow endpoints');
    logInfo('• Review database query performance');
    logInfo('• Add database indexes for frequently queried fields');
    logInfo('• Consider implementing Redis caching');
  }
  
  if (successRate < 99) {
    logInfo('• Investigate failed requests');
    logInfo('• Check application logs for errors');
    logInfo('• Verify database connectivity');
    logInfo('• Review rate limiting configuration');
  }
  
  if (metrics.responseTimes.length > 0) {
    const avgResponseTime = metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length;
    if (avgResponseTime > 1000) {
      logInfo('• Optimize API response times');
      logInfo('• Implement request batching');
      logInfo('• Review external service dependencies');
    }
  }
}

// Run performance test
async function runPerformanceTest() {
  logHeader('🚀 STARTING PRODUCTION PERFORMANCE TEST');
  logInfo(`Base URL: ${CONFIG.baseUrl}`);
  logInfo(`Test Duration: ${CONFIG.testDuration / 1000}s`);
  logInfo(`Concurrent Users: ${CONFIG.concurrentUsers}`);
  logInfo(`Endpoints: ${CONFIG.endpoints.length}`);
  
  metrics.startTime = performance.now();
  
  // Test all endpoints
  for (const endpoint of CONFIG.endpoints) {
    await testEndpoint(endpoint);
    await new Promise(resolve => setTimeout(resolve, CONFIG.requestInterval));
  }
  
  // Simulate concurrent users
  logInfo('\n👥 Simulating concurrent users...');
  const concurrentPromises = [];
  
  for (let i = 0; i < CONFIG.concurrentUsers; i++) {
    const userPromise = (async () => {
      for (let j = 0; j < Math.ceil(CONFIG.endpoints.length / CONFIG.concurrentUsers); j++) {
        const endpoint = CONFIG.endpoints[(i + j) % CONFIG.endpoints.length];
        await testEndpoint(endpoint);
        await new Promise(resolve => setTimeout(resolve, CONFIG.requestInterval));
      }
    })();
    
    concurrentPromises.push(userPromise);
  }
  
  await Promise.all(concurrentPromises);
  
  metrics.endTime = performance.now();
  
  // Generate report
  generateReport();
  
  logSuccess('\n✅ Performance test completed!');
}

// Main execution
async function main() {
  try {
    await runPerformanceTest();
  } catch (error) {
    logError(`Test failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle process interruption
process.on('SIGINT', () => {
  logWarning('\n⚠️ Test interrupted by user');
  metrics.endTime = performance.now();
  generateReport();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logWarning('\n⚠️ Test terminated');
  metrics.endTime = performance.now();
  generateReport();
  process.exit(0);
});

// Run main function
main(); 
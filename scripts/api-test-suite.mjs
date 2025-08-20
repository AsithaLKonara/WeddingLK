#!/usr/bin/env node

/**
 * Comprehensive API Testing Suite for WeddingLK
 * Tests all API endpoints with real data and monitors performance
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_CONFIG = {
  timeout: 30000,
  retries: 3,
  concurrent: 5
};

// Test results storage
const testResults = {
  startTime: new Date(),
  tests: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    performance: {
      avgResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0
    }
  }
};

// Utility functions
const logTest = (testName, status, details = '', responseTime = 0) => {
  const testResult = {
    timestamp: new Date(),
    test: testName,
    status,
    details,
    responseTime,
    url: details.includes('http') ? details : undefined
  };
  
  testResults.tests.push(testResult);
  
  if (status === 'PASS') {
    console.log(`✅ ${testName}: ${details} (${responseTime}ms)`);
    testResults.summary.passed++;
  } else if (status === 'FAIL') {
    console.log(`❌ ${testName}: ${details} (${responseTime}ms)`);
    testResults.summary.failed++;
  } else if (status === 'SKIP') {
    console.log(`⏭️  ${testName}: ${details}`);
    testResults.summary.skipped++;
  }
  
  testResults.summary.total++;
  
  // Update performance metrics
  if (responseTime > 0) {
    testResults.summary.performance.minResponseTime = Math.min(testResults.summary.performance.minResponseTime, responseTime);
    testResults.summary.performance.maxResponseTime = Math.max(testResults.summary.performance.maxResponseTime, responseTime);
  }
};

const makeRequest = async (url, options = {}) => {
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, {
      timeout: TEST_CONFIG.timeout,
      ...options
    });
    
    const responseTime = Date.now() - startTime;
    const data = await response.json().catch(() => null);
    
    return {
      status: response.status,
      ok: response.ok,
      data,
      responseTime,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      status: 0,
      ok: false,
      error: error.message,
      responseTime
    };
  }
};

const testEndpoint = async (testName, url, expectedStatus = 200, options = {}) => {
  const result = await makeRequest(url, options);
  
  if (result.ok && result.status === expectedStatus) {
    logTest(testName, 'PASS', `Status: ${result.status}`, result.responseTime);
    return { success: true, data: result.data, responseTime: result.responseTime };
  } else {
    logTest(testName, 'FAIL', `Expected: ${expectedStatus}, Got: ${result.status} - ${result.error || JSON.stringify(result.data)}`, result.responseTime);
    return { success: false, error: result.error || result.data, responseTime: result.responseTime };
  }
};

// API Test Categories
const healthTests = async () => {
  console.log('\n🏥 HEALTH & SYSTEM TESTS');
  console.log('==========================');
  
  await testEndpoint('Health Check', `${BASE_URL}/api/health`, 200);
  await testEndpoint('Performance Check', `${BASE_URL}/api/performance`, 200);
};

const authTests = async () => {
  console.log('\n🔐 AUTHENTICATION TESTS');
  console.log('========================');
  
  // Test registration endpoint
  const registerData = {
    email: 'test@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    role: 'client'
  };
  
  await testEndpoint('User Registration', `${BASE_URL}/api/auth/register`, 201, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registerData)
  });
  
  // Test login endpoint
  const loginData = {
    email: 'test@example.com',
    password: 'TestPassword123!'
  };
  
  await testEndpoint('User Login', `${BASE_URL}/api/auth/login`, 200, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData)
  });
  
  // Test OAuth endpoints
  await testEndpoint('Google OAuth', `${BASE_URL}/api/auth/oauth/google`, 200);
  await testEndpoint('Facebook OAuth', `${BASE_URL}/api/auth/oauth/facebook`, 200);
  await testEndpoint('Instagram OAuth', `${BASE_URL}/api/auth/oauth/instagram`, 200);
  await testEndpoint('LinkedIn OAuth', `${BASE_URL}/api/auth/oauth/linkedin`, 200);
};

const userTests = async () => {
  console.log('\n👥 USER MANAGEMENT TESTS');
  console.log('=========================');
  
  await testEndpoint('Get Users', `${BASE_URL}/api/dashboard/admin/users`, 200);
  await testEndpoint('User Stats', `${BASE_URL}/api/dashboard/user-stats`, 200);
  await testEndpoint('User Dashboard', `${BASE_URL}/api/dashboard/user/stats`, 200);
};

const vendorTests = async () => {
  console.log('\n🏢 VENDOR TESTS');
  console.log('================');
  
  await testEndpoint('Get All Vendors', `${BASE_URL}/api/vendors`, 200);
  await testEndpoint('Get Vendor Categories', `${BASE_URL}/api/vendors/categories`, 200);
  await testEndpoint('Search Vendors', `${BASE_URL}/api/vendors/search?q=photography`, 200);
  await testEndpoint('Vendor Dashboard', `${BASE_URL}/api/dashboard/vendor/stats`, 200);
  await testEndpoint('Vendor Analytics', `${BASE_URL}/api/dashboard/vendor/analytics`, 200);
  
  // Test individual vendor
  const vendorsResponse = await makeRequest(`${BASE_URL}/api/vendors`);
  if (vendorsResponse.ok && vendorsResponse.data && vendorsResponse.data.length > 0) {
    const vendorId = vendorsResponse.data[0]._id;
    await testEndpoint('Get Vendor by ID', `${BASE_URL}/api/vendors/${vendorId}`, 200);
  }
};

const venueTests = async () => {
  console.log('\n🏛️ VENUE TESTS');
  console.log('================');
  
  await testEndpoint('Get All Venues', `${BASE_URL}/api/venues`, 200);
  await testEndpoint('Search Venues', `${BASE_URL}/api/venues/search?q=hotel`, 200);
  await testEndpoint('Venue Availability', `${BASE_URL}/api/venues/availability`, 200);
  await testEndpoint('Venue Pricing', `${BASE_URL}/api/venues/pricing`, 200);
  
  // Test individual venue
  const venuesResponse = await makeRequest(`${BASE_URL}/api/venues`);
  if (venuesResponse.ok && venuesResponse.data && venuesResponse.data.length > 0) {
    const venueId = venuesResponse.data[0]._id;
    await testEndpoint('Get Venue by ID', `${BASE_URL}/api/venues/${venueId}`, 200);
  }
};

const bookingTests = async () => {
  console.log('\n📅 BOOKING TESTS');
  console.log('==================');
  
  await testEndpoint('Get Bookings', `${BASE_URL}/api/bookings`, 200);
  await testEndpoint('User Bookings', `${BASE_URL}/api/dashboard/user/bookings`, 200);
  await testEndpoint('Vendor Bookings', `${BASE_URL}/api/dashboard/vendor/bookings`, 200);
  
  // Test creating a booking
  const bookingData = {
    vendorId: 'test-vendor-id',
    venueId: 'test-venue-id',
    eventType: 'Wedding',
    eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    guestCount: 150,
    totalAmount: 500000
  };
  
  await testEndpoint('Create Booking', `${BASE_URL}/api/bookings`, 201, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });
};

const reviewTests = async () => {
  console.log('\n⭐ REVIEW TESTS');
  console.log('================');
  
  await testEndpoint('Get Reviews', `${BASE_URL}/api/reviews`, 200);
  
  // Test creating a review
  const reviewData = {
    vendorId: 'test-vendor-id',
    rating: 5,
    title: 'Excellent Service',
    comment: 'Amazing experience with this vendor!'
  };
  
  await testEndpoint('Create Review', `${BASE_URL}/api/reviews`, 201, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
};

const messageTests = async () => {
  console.log('\n💬 MESSAGING TESTS');
  console.log('====================');
  
  await testEndpoint('Get Messages', `${BASE_URL}/api/messages`, 200);
  await testEndpoint('User Messages', `${BASE_URL}/api/dashboard/user/messages`, 200);
  await testEndpoint('Vendor Messages', `${BASE_URL}/api/dashboard/vendor/messages`, 200);
  
  // Test creating a message
  const messageData = {
    conversationId: 'test-conversation-id',
    content: 'Hello, I have a question about your services.'
  };
  
  await testEndpoint('Create Message', `${BASE_URL}/api/messages`, 201, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData)
  });
};

const paymentTests = async () => {
  console.log('\n💳 PAYMENT TESTS');
  console.log('==================');
  
  await testEndpoint('Get Payments', `${BASE_URL}/api/payments`, 200);
  await testEndpoint('User Payments', `${BASE_URL}/api/dashboard/user/payments`, 200);
  await testEndpoint('Payment Webhook', `${BASE_URL}/api/payments/webhook`, 200);
};

const adminTests = async () => {
  console.log('\n👑 ADMIN TESTS');
  console.log('================');
  
  await testEndpoint('Admin Dashboard', `${BASE_URL}/api/dashboard/admin/analytics`, 200);
  await testEndpoint('Platform Stats', `${BASE_URL}/api/dashboard/admin/platform-stats`, 200);
  await testEndpoint('Admin Settings', `${BASE_URL}/api/dashboard/admin/settings`, 200);
  await testEndpoint('Admin Vendors', `${BASE_URL}/api/dashboard/admin/vendors`, 200);
};

const searchTests = async () => {
  console.log('\n🔍 SEARCH TESTS');
  console.log('=================');
  
  await testEndpoint('AI Search', `${BASE_URL}/api/ai-search?q=wedding photographer`, 200);
  await testEndpoint('Advanced AI', `${BASE_URL}/api/advanced-ai`, 200);
};

const homePageTests = async () => {
  console.log('\n🏠 HOME PAGE TESTS');
  console.log('===================');
  
  await testEndpoint('Featured Vendors', `${BASE_URL}/api/home/featured-vendors`, 200);
  await testEndpoint('Featured Venues', `${BASE_URL}/api/home/featured-venues`, 200);
  await testEndpoint('Home Stats', `${BASE_URL}/api/home/stats`, 200);
  await testEndpoint('Testimonials', `${BASE_URL}/api/home/testimonials`, 200);
};

const verificationTests = async () => {
  console.log('\n✅ VERIFICATION TESTS');
  console.log('======================');
  
  await testEndpoint('Document Verification', `${BASE_URL}/api/verification/documents`, 200);
  await testEndpoint('Verification Status', `${BASE_URL}/api/verification/status`, 200);
};

const performanceTests = async () => {
  console.log('\n⚡ PERFORMANCE TESTS');
  console.log('=====================');
  
  // Test concurrent requests
  const concurrentTests = Array.from({ length: TEST_CONFIG.concurrent }, (_, i) => 
    testEndpoint(`Concurrent Test ${i + 1}`, `${BASE_URL}/api/health`, 200)
  );
  
  const startTime = Date.now();
  await Promise.all(concurrentTests);
  const totalTime = Date.now() - startTime;
  
  logTest('Concurrent Performance', 'PASS', `${TEST_CONFIG.concurrent} concurrent requests in ${totalTime}ms`);
};

// Main test runner
const runAllTests = async () => {
  console.log('🚀 STARTING COMPREHENSIVE API TEST SUITE');
  console.log('========================================');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Start Time: ${testResults.startTime.toISOString()}`);
  
  try {
    // Run all test categories
    await healthTests();
    await authTests();
    await userTests();
    await vendorTests();
    await venueTests();
    await bookingTests();
    await reviewTests();
    await messageTests();
    await paymentTests();
    await adminTests();
    await searchTests();
    await homePageTests();
    await verificationTests();
    await performanceTests();
    
    // Calculate final summary
    const totalResponseTime = testResults.tests
      .filter(t => t.responseTime > 0)
      .reduce((sum, t) => sum + t.responseTime, 0);
    
    const testsWithResponseTime = testResults.tests.filter(t => t.responseTime > 0).length;
    
    if (testsWithResponseTime > 0) {
      testResults.summary.performance.avgResponseTime = totalResponseTime / testsWithResponseTime;
    }
    
    // Display final results
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('=========================');
    console.log(`Total Tests: ${testResults.summary.total}`);
    console.log(`✅ Passed: ${testResults.summary.passed}`);
    console.log(`❌ Failed: ${testResults.summary.failed}`);
    console.log(`⏭️  Skipped: ${testResults.summary.skipped}`);
    console.log(`Success Rate: ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}%`);
    
    console.log('\n⚡ PERFORMANCE METRICS');
    console.log('========================');
    console.log(`Average Response Time: ${testResults.summary.performance.avgResponseTime.toFixed(2)}ms`);
    console.log(`Min Response Time: ${testResults.summary.performance.minResponseTime}ms`);
    console.log(`Max Response Time: ${testResults.summary.performance.maxResponseTime}ms`);
    
    // Save detailed results
    const endTime = new Date();
    const finalResults = {
      ...testResults,
      endTime,
      duration: endTime - testResults.startTime,
      config: TEST_CONFIG
    };
    
    fs.writeFileSync('api-test-results.json', JSON.stringify(finalResults, null, 2));
    console.log('\n💾 Test results saved to api-test-results.json');
    
    // Generate HTML report
    generateHTMLReport(finalResults);
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
    logTest('Test Suite', 'FAIL', error.message);
  }
};

const generateHTMLReport = (results) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>WeddingLK API Test Results</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f0f0; padding: 20px; border-radius: 5px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .metric h3 { margin: 0; color: #333; }
        .metric .value { font-size: 2em; font-weight: bold; margin: 10px 0; }
        .pass { color: #28a745; }
        .fail { color: #dc3545; }
        .skip { color: #ffc107; }
        .tests { margin: 20px 0; }
        .test { padding: 10px; margin: 5px 0; border-radius: 3px; border-left: 4px solid; }
        .test.pass { background: #d4edda; border-color: #28a745; }
        .test.fail { background: #f8d7da; border-color: #dc3545; }
        .test.skip { background: #fff3cd; border-color: #ffc107; }
        .performance { background: #e9ecef; padding: 20px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 WeddingLK API Test Results</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <p>Duration: ${(results.duration / 1000).toFixed(2)}s</p>
    </div>
    
    <div class="summary">
        <div class="metric">
            <h3>Total Tests</h3>
            <div class="value">${results.summary.total}</div>
        </div>
        <div class="metric">
            <h3>Passed</h3>
            <div class="value pass">${results.summary.passed}</div>
        </div>
        <div class="metric">
            <h3>Failed</h3>
            <div class="value fail">${results.summary.failed}</div>
        </div>
        <div class="metric">
            <h3>Success Rate</h3>
            <div class="value">${((results.summary.passed / results.summary.total) * 100).toFixed(1)}%</div>
        </div>
    </div>
    
    <div class="performance">
        <h2>⚡ Performance Metrics</h2>
        <p><strong>Average Response Time:</strong> ${results.summary.performance.avgResponseTime.toFixed(2)}ms</p>
        <p><strong>Min Response Time:</strong> ${results.summary.performance.minResponseTime}ms</p>
        <p><strong>Max Response Time:</strong> ${results.summary.performance.maxResponseTime}ms</p>
    </div>
    
    <div class="tests">
        <h2>📋 Test Details</h2>
        ${results.tests.map(test => `
            <div class="test ${test.status.toLowerCase()}">
                <strong>${test.test}</strong> - ${test.status}
                <br><small>${test.details} ${test.responseTime ? `(${test.responseTime}ms)` : ''}</small>
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  
  fs.writeFileSync('api-test-report.html', html);
  console.log('📊 HTML report generated: api-test-report.html');
};

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export default runAllTests; 
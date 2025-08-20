#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);

console.log(chalk.blue.bold('🔍 WeddingLK Page Performance & Error Testing'));
console.log(chalk.blue.bold('============================================\n'));

// Define all pages to test
const pages = [
  { name: 'Home Page', path: '/', expectedStatus: 200 },
  { name: 'About Page', path: '/about', expectedStatus: 200 },
  { name: 'Contact Page', path: '/contact', expectedStatus: 200 },
  { name: 'Features Page', path: '/features', expectedStatus: 200 },
  { name: 'AI Enhancements', path: '/features/ai-enhancements', expectedStatus: 200 },
  { name: 'Mobile App', path: '/features/mobile-app', expectedStatus: 200 },
  { name: 'Gallery Page', path: '/gallery', expectedStatus: 200 },
  { name: 'Feed Page', path: '/feed', expectedStatus: 200 },
  { name: 'Planning Page', path: '/planning', expectedStatus: 200 },
  { name: 'Premium Page', path: '/premium', expectedStatus: 200 },
  { name: 'Packages Compare', path: '/packages/compare', expectedStatus: 200 },
  { name: 'Packages Custom', path: '/packages/custom', expectedStatus: 200 },
  { name: 'Roadmap Page', path: '/roadmap', expectedStatus: 200 },
  { name: 'Status Page', path: '/status', expectedStatus: 200 },
  { name: 'Subscription Page', path: '/subscription', expectedStatus: 200 },
  { name: 'Test Page', path: '/test', expectedStatus: 200 },
  { name: 'Comprehensive Test', path: '/test/comprehensive', expectedStatus: 200 },
  { name: 'Vendors List', path: '/vendors', expectedStatus: 200 },
  { name: 'Venues List', path: '/venues', expectedStatus: 200 },
  { name: 'Login Page', path: '/login', expectedStatus: 200 },
  { name: 'Register Page', path: '/register', expectedStatus: 200 },
  { name: 'Enhanced Register', path: '/register/enhanced', expectedStatus: 200 },
  { name: 'Verify Email', path: '/verify-email', expectedStatus: 200 },
  { name: 'Offline Page', path: '/offline', expectedStatus: 200 },
  { name: 'Favorites Page', path: '/favorites', expectedStatus: 200 },
  { name: 'Profile Page', path: '/profile', expectedStatus: 200 },
  { name: 'Dashboard', path: '/dashboard', expectedStatus: 200 },
  { name: 'Admin Dashboard', path: '/dashboard/admin', expectedStatus: 200 },
  { name: 'User Dashboard', path: '/dashboard/user', expectedStatus: 200 },
  { name: 'Vendor Dashboard', path: '/dashboard/vendor', expectedStatus: 200 },
  { name: 'Planner Dashboard', path: '/dashboard/planner', expectedStatus: 200 },
  { name: 'Bookings Page', path: '/dashboard/bookings', expectedStatus: 200 },
  { name: 'Messages Page', path: '/dashboard/messages', expectedStatus: 200 },
  { name: 'Payments Page', path: '/dashboard/payments', expectedStatus: 200 },
  { name: 'Settings Page', path: '/dashboard/settings', expectedStatus: 200 },
  { name: 'Subscription Management', path: '/dashboard/subscription', expectedStatus: 200 },
  { name: 'Vendor Onboarding', path: '/dashboard/vendor/onboarding', expectedStatus: 200 },
  { name: 'API Health Check', path: '/api/health', expectedStatus: 200 },
  { name: 'API Analytics', path: '/api/analytics', expectedStatus: 200 },
  { name: 'API Vendors', path: '/api/vendors', expectedStatus: 200 },
  { name: 'API Venues', path: '/api/venues', expectedStatus: 200 },
  { name: 'API Bookings', path: '/api/bookings', expectedStatus: 200 },
  { name: 'API Users', path: '/api/users', expectedStatus: 200 },
  { name: 'API Reviews', path: '/api/reviews', expectedStatus: 200 },
  { name: 'API Messages', path: '/api/messages', expectedStatus: 200 },
  { name: 'API Payments', path: '/api/payments', expectedStatus: 200 },
  { name: 'API Auth', path: '/api/auth', expectedStatus: 200 },
  { name: 'API Upload', path: '/api/upload', expectedStatus: 200 },
  { name: 'API Search', path: '/api/vendors/search', expectedStatus: 200 },
  { name: 'API AI Search', path: '/api/ai-search', expectedStatus: 200 },
  { name: 'API Advanced AI', path: '/api/advanced-ai', expectedStatus: 200 },
  { name: 'API Performance', path: '/api/performance', expectedStatus: 200 },
  { name: 'API Security', path: '/api/security', expectedStatus: 200 },
  { name: 'API Errors', path: '/api/errors', expectedStatus: 200 },
  { name: 'API Home Stats', path: '/api/home/stats', expectedStatus: 200 },
  { name: 'API Home Featured', path: '/api/home/featured-vendors', expectedStatus: 200 },
  { name: 'API Home Testimonials', path: '/api/home/testimonials', expectedStatus: 200 },
  { name: 'API Dashboard Stats', path: '/api/dashboard/user/stats', expectedStatus: 200 },
  { name: 'API Dashboard Bookings', path: '/api/dashboard/user/bookings', expectedStatus: 200 },
  { name: 'API Dashboard Favorites', path: '/api/dashboard/user/favorites', expectedStatus: 200 },
  { name: 'API Dashboard Messages', path: '/api/dashboard/user/messages', expectedStatus: 200 },
  { name: 'API Dashboard Payments', path: '/api/dashboard/user/payments', expectedStatus: 200 },
  { name: 'API Vendor Analytics', path: '/api/dashboard/vendor/analytics', expectedStatus: 200 },
  { name: 'API Vendor Bookings', path: '/api/dashboard/vendor/bookings', expectedStatus: 200 },
  { name: 'API Vendor Messages', path: '/api/dashboard/vendor/messages', expectedStatus: 200 },
  { name: 'API Vendor Services', path: '/api/dashboard/vendor/services', expectedStatus: 200 },
  { name: 'API Vendor Stats', path: '/api/dashboard/vendor/stats', expectedStatus: 200 },
  { name: 'API Admin Users', path: '/api/dashboard/admin/users', expectedStatus: 200 },
  { name: 'API Admin Vendors', path: '/api/dashboard/admin/vendors', expectedStatus: 200 },
  { name: 'API Admin Analytics', path: '/api/dashboard/admin/analytics', expectedStatus: 200 },
  { name: 'API Admin Platform Stats', path: '/api/dashboard/admin/platform-stats', expectedStatus: 200 },
  { name: 'API Admin Settings', path: '/api/dashboard/admin/settings', expectedStatus: 200 },
  { name: 'API Planner Stats', path: '/api/dashboard/planner/stats', expectedStatus: 200 },
  { name: 'API Verification Documents', path: '/api/verification/documents', expectedStatus: 200 },
  { name: 'API Verification Status', path: '/api/verification/status', expectedStatus: 200 },
  { name: 'API Tasks', path: '/api/tasks', expectedStatus: 200 },
  { name: 'API Conversations', path: '/api/conversations', expectedStatus: 200 },
  { name: 'API Notifications', path: '/api/notifications', expectedStatus: 200 },
  { name: 'API Email', path: '/api/email', expectedStatus: 200 },
  { name: 'API SMS', path: '/api/sms', expectedStatus: 200 },
  { name: 'API Social Media', path: '/api/social-media', expectedStatus: 200 },
  { name: 'API Third Party', path: '/api/third-party', expectedStatus: 200 },
  { name: 'API Test Models', path: '/api/test-models', expectedStatus: 200 },
  { name: 'API Venue Boosts', path: '/api/venue-boosts', expectedStatus: 200 },
  { name: 'API Venue Availability', path: '/api/venues/availability', expectedStatus: 200 },
  { name: 'API Venue Pricing', path: '/api/venues/pricing', expectedStatus: 200 },
  { name: 'API Client Management', path: '/api/clients', expectedStatus: 200 },
  { name: 'API Favorites Management', path: '/api/favorites', expectedStatus: 200 },
  { name: 'API Socket.IO', path: '/api/socketio', expectedStatus: 200 },
  { name: 'API Health Check', path: '/api/health', expectedStatus: 200 },
  { name: 'API Mobile', path: '/api/mobile', expectedStatus: 200 }
];

const results = {
  total: pages.length,
  successful: 0,
  failed: 0,
  slow: 0,
  errors: [],
  performance: []
};

const testPage = async (page) => {
  const startTime = Date.now();
  
  try {
    const { stdout, stderr } = await execAsync(`curl -s -w "%{http_code}|%{time_total}|%{size_download}|%{speed_download}" -o /dev/null http://localhost:3000${page.path}`);
    
    const [statusCode, timeTotal, sizeDownload, speedDownload] = stdout.split('|');
    const responseTime = parseFloat(timeTotal) * 1000; // Convert to milliseconds
    const isSlow = responseTime > 3000; // Consider slow if > 3 seconds
    
    if (statusCode == page.expectedStatus) {
      results.successful++;
      if (isSlow) results.slow++;
      
      results.performance.push({
        page: page.name,
        path: page.path,
        status: statusCode,
        responseTime: Math.round(responseTime),
        size: sizeDownload,
        speed: Math.round(speedDownload / 1024), // KB/s
        isSlow
      });
      
      const statusIcon = isSlow ? chalk.yellow('⚠️') : chalk.green('✅');
      console.log(`${statusIcon} ${page.name}: ${Math.round(responseTime)}ms (${Math.round(speedDownload / 1024)} KB/s)`);
    } else {
      results.failed++;
      results.errors.push({
        page: page.name,
        path: page.path,
        expected: page.expectedStatus,
        actual: statusCode,
        responseTime: Math.round(responseTime)
      });
      
      console.log(chalk.red(`❌ ${page.name}: Status ${statusCode} (expected ${page.expectedStatus}) - ${Math.round(responseTime)}ms`));
    }
    
  } catch (error) {
    results.failed++;
    results.errors.push({
      page: page.name,
      path: page.path,
      error: error.message,
      responseTime: 0
    });
    
    console.log(chalk.red(`💥 ${page.name}: Error - ${error.message}`));
  }
};

const runTests = async () => {
  console.log(chalk.cyan(`🚀 Starting systematic testing of ${pages.length} pages...\n`));
  
  // Test pages in batches to avoid overwhelming the server
  const batchSize = 5;
  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize);
    await Promise.all(batch.map(testPage));
    
    // Small delay between batches
    if (i + batchSize < pages.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Generate comprehensive report
  generateReport();
};

const generateReport = () => {
  console.log(chalk.blue.bold('\n📊 COMPREHENSIVE PERFORMANCE REPORT'));
  console.log(chalk.blue.bold('=====================================\n'));
  
  // Summary
  console.log(chalk.green(`✅ Successful: ${results.successful}/${results.total}`));
  console.log(chalk.red(`❌ Failed: ${results.failed}/${results.total}`));
  console.log(chalk.yellow(`⚠️ Slow (>3s): ${results.slow}/${results.total}`));
  
  // Performance Analysis
  if (results.performance.length > 0) {
    const avgResponseTime = Math.round(
      results.performance.reduce((sum, p) => sum + p.responseTime, 0) / results.performance.length
    );
    const slowestPage = results.performance.reduce((slowest, current) => 
      current.responseTime > slowest.responseTime ? current : slowest
    );
    const fastestPage = results.performance.reduce((fastest, current) => 
      current.responseTime < fastest.responseTime ? current : fastest
    );
    
    console.log(chalk.cyan(`\n📈 Performance Metrics:`));
    console.log(`   Average Response Time: ${avgResponseTime}ms`);
    console.log(`   Fastest Page: ${fastestPage.page} (${fastestPage.responseTime}ms)`);
    console.log(`   Slowest Page: ${slowestPage.page} (${slowestPage.responseTime}ms)`);
  }
  
  // Error Details
  if (results.errors.length > 0) {
    console.log(chalk.red(`\n🚨 Errors Found (${results.errors.length}):`));
    results.errors.forEach(error => {
      if (error.error) {
        console.log(`   💥 ${error.page}: ${error.error}`);
      } else {
        console.log(`   ❌ ${error.page}: Status ${error.actual} (expected ${error.expected})`);
      }
    });
  }
  
  // Slow Pages
  const slowPages = results.performance.filter(p => p.isSlow);
  if (slowPages.length > 0) {
    console.log(chalk.yellow(`\n🐌 Slow Pages (>3s):`));
    slowPages.forEach(page => {
      console.log(`   ⚠️ ${page.page}: ${page.responseTime}ms`);
    });
  }
  
  // Recommendations
  console.log(chalk.blue(`\n💡 Recommendations:`));
  if (results.failed > 0) {
    console.log(`   • Investigate and fix ${results.failed} failed pages`);
  }
  if (results.slow > 0) {
    console.log(`   • Optimize ${results.slow} slow-loading pages`);
  }
  if (results.successful === results.total) {
    console.log(`   • All pages are accessible - focus on performance optimization`);
  }
  
  console.log(chalk.green(`\n🎉 Testing completed! Check the results above for issues and performance bottlenecks.`));
};

// Start testing
runTests().catch(console.error); 
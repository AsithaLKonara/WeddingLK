#!/usr/bin/env node

const { execSync } = require('child_process');

// List of all major pages to test
const pages = [
  { name: 'Homepage', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Features', path: '/features' },
  { name: 'AI Enhancements', path: '/features/ai-enhancements' },
  { name: 'Mobile App', path: '/features/mobile-app' },
  { name: 'Feed', path: '/feed' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Planning', path: '/planning' },
  { name: 'Premium', path: '/premium' },
  { name: 'Profile', path: '/profile' },
  { name: 'Roadmap', path: '/roadmap' },
  { name: 'Status', path: '/status' },
  { name: 'Subscription', path: '/subscription' },
  { name: 'Vendors', path: '/vendors' },
  { name: 'Venues', path: '/venues' },
  { name: 'Packages Compare', path: '/packages/compare' },
  { name: 'Packages Custom', path: '/packages/custom' },
  { name: 'Login', path: '/login' },
  { name: 'Register', path: '/register' },
  { name: 'Enhanced Register', path: '/register/enhanced' },
  { name: 'Verify Email', path: '/verify-email' },
  { name: 'Favorites', path: '/favorites' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Admin Dashboard', path: '/dashboard/admin' },
  { name: 'Admin Users', path: '/dashboard/admin/users' },
  { name: 'User Dashboard', path: '/dashboard/user' },
  { name: 'Vendor Dashboard', path: '/dashboard/vendor' },
  { name: 'Vendor Onboarding', path: '/dashboard/vendor/onboarding' },
  { name: 'Bookings', path: '/dashboard/bookings' },
  { name: 'Messages', path: '/dashboard/messages' },
  { name: 'Payments', path: '/dashboard/payments' },
  { name: 'Settings', path: '/dashboard/settings' },
  { name: 'Planner Dashboard', path: '/dashboard/planner' },
  { name: 'Test Page', path: '/test' },
  { name: 'Comprehensive Test', path: '/test/comprehensive' }
];

console.log('🚀 WeddingLK Page Loading Speed Test');
console.log('=====================================\n');

const results = [];
const baseUrl = 'http://localhost:3000';

// Test function for a single page
function testPage(page) {
  try {
    const startTime = Date.now();
    
    // Use curl to test the page with timing
    const curlCommand = `curl -s -w "HTTP_CODE:%{http_code},TIME_TOTAL:%{time_total},TIME_CONNECT:%{time_connect},TIME_STARTTRANSFER:%{time_starttransfer},SIZE:%{size_download}" -o /dev/null "${baseUrl}${page.path}"`;
    
    const output = execSync(curlCommand, { encoding: 'utf8' });
    const endTime = Date.now();
    
    // Parse curl output
    const httpCode = output.match(/HTTP_CODE:(\d+)/)?.[1];
    const timeTotal = parseFloat(output.match(/TIME_TOTAL:([\d.]+)/)?.[1] || 0);
    const timeConnect = parseFloat(output.match(/TIME_CONNECT:([\d.]+)/)?.[1] || 0);
    const timeStartTransfer = parseFloat(output.match(/TIME_STARTTRANSFER:([\d.]+)/)?.[1] || 0);
    const size = parseInt(output.match(/SIZE:(\d+)/)?.[1] || 0);
    
    const clientTime = endTime - startTime;
    
    const result = {
      name: page.name,
      path: page.path,
      httpCode: parseInt(httpCode),
      serverTime: timeTotal,
      clientTime: clientTime,
      connectTime: timeConnect,
      startTransferTime: timeStartTransfer,
      size: size,
      status: httpCode === '200' ? '✅' : '❌'
    };
    
    results.push(result);
    
    // Display result immediately
    console.log(`${result.status} ${page.name.padEnd(25)} | ${timeTotal.toFixed(3)}s | ${size} bytes | ${httpCode}`);
    
    return result;
  } catch (error) {
    console.log(`❌ ${page.name.padEnd(25)} | ERROR: ${error.message}`);
    return null;
  }
}

// Test all pages
console.log('Testing all pages...\n');
console.log('Page'.padEnd(26) + '| Time    | Size     | Status');
console.log('-'.repeat(50));

pages.forEach(page => {
  testPage(page);
  // Small delay between requests to avoid overwhelming the server
  execSync('sleep 0.5');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 LOADING SPEED SUMMARY');
console.log('='.repeat(50));

const successfulResults = results.filter(r => r && r.httpCode === 200);
const failedResults = results.filter(r => !r || r.httpCode !== 200);

if (successfulResults.length > 0) {
  const avgServerTime = successfulResults.reduce((sum, r) => sum + r.serverTime, 0) / successfulResults.length;
  const avgClientTime = successfulResults.reduce((sum, r) => sum + r.clientTime, 0) / successfulResults.length;
  const avgSize = successfulResults.reduce((sum, r) => sum + r.size, 0) / successfulResults.length;
  
  const fastestPage = successfulResults.reduce((fastest, current) => 
    current.serverTime < fastest.serverTime ? current : fastest
  );
  
  const slowestPage = successfulResults.reduce((slowest, current) => 
    current.serverTime > slowest.serverTime ? current : slowest
  );
  
  console.log(`✅ Successful Pages: ${successfulResults.length}/${pages.length}`);
  console.log(`❌ Failed Pages: ${failedResults.length}/${pages.length}`);
  console.log(`📈 Average Server Time: ${avgServerTime.toFixed(3)}s`);
  console.log(`📈 Average Client Time: ${avgClientTime.toFixed(3)}s`);
  console.log(`📦 Average Page Size: ${Math.round(avgSize)} bytes`);
  console.log(`⚡ Fastest Page: ${fastestPage.name} (${fastestPage.serverTime.toFixed(3)}s)`);
  console.log(`🐌 Slowest Page: ${slowestPage.name} (${slowestPage.serverTime.toFixed(3)}s)`);
}

if (failedResults.length > 0) {
  console.log('\n❌ FAILED PAGES:');
  failedResults.forEach(page => {
    if (page) {
      console.log(`   ${page.name}: HTTP ${page.httpCode}`);
    }
  });
}

// Performance recommendations
console.log('\n💡 PERFORMANCE RECOMMENDATIONS:');
console.log('='.repeat(50));

if (successfulResults.length > 0) {
  const avgTime = successfulResults.reduce((sum, r) => sum + r.serverTime, 0) / successfulResults.length;
  
  if (avgTime < 1.0) {
    console.log('🎉 Excellent performance! All pages load under 1 second.');
  } else if (avgTime < 2.0) {
    console.log('👍 Good performance! Consider optimizing pages over 2 seconds.');
  } else if (avgTime < 5.0) {
    console.log('⚠️  Moderate performance. Some pages need optimization.');
  } else {
    console.log('🚨 Poor performance. Immediate optimization required.');
  }
  
  // Identify slow pages
  const slowPages = successfulResults.filter(r => r.serverTime > 2.0);
  if (slowPages.length > 0) {
    console.log('\n🐌 Pages needing optimization (>2s):');
    slowPages.forEach(page => {
      console.log(`   ${page.name}: ${page.serverTime.toFixed(3)}s`);
    });
  }
}

console.log('\n�� Test completed!'); 
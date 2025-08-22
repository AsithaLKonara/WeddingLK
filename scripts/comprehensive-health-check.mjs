#!/usr/bin/env node

import { execSync } from 'child_process';
import { spawn } from 'child_process';

console.log('🏥 COMPREHENSIVE HEALTH CHECK STARTING...\n');

// Colors for output
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

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`\n🔍 ${description}...`, 'blue');
    const result = execSync(command, { encoding: 'utf8', timeout: 10000 });
    log(`✅ ${description} - SUCCESS`, 'green');
    return { success: true, result };
  } catch (error) {
    log(`❌ ${description} - FAILED`, 'red');
    log(`Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

function testAPI(endpoint, description) {
  try {
    log(`\n🌐 Testing API: ${description}`, 'cyan');
    const result = execSync(`curl -s -w "HTTP_STATUS:%{http_code}" http://localhost${endpoint}`, { 
      encoding: 'utf8', 
      timeout: 10000 
    });
    
    const [response, statusLine] = result.split('HTTP_STATUS:');
    const status = statusLine?.trim();
    
    if (status && status.startsWith('2')) {
      log(`✅ ${description} - HTTP ${status}`, 'green');
      try {
        const data = JSON.parse(response);
        if (Array.isArray(data) && data.length > 0) {
          log(`   📊 Data: ${data.length} items returned`, 'green');
        } else if (typeof data === 'object' && Object.keys(data).length > 0) {
          log(`   📊 Data: Object with ${Object.keys(data).length} keys`, 'green');
        } else {
          log(`   ⚠️  Data: Empty or minimal response`, 'yellow');
        }
      } catch (e) {
        log(`   📄 Response: HTML/Text content`, 'blue');
      }
      return { success: true, status, data: response.substring(0, 100) + '...' };
    } else {
      log(`❌ ${description} - HTTP ${status}`, 'red');
      return { success: false, status, error: 'Non-2xx status' };
    }
  } catch (error) {
    log(`❌ ${description} - FAILED`, 'red');
    log(`   Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

function testFrontendPage(page, description) {
  try {
    log(`\n🌍 Testing Frontend: ${description}`, 'cyan');
    const result = execSync(`curl -s -w "HTTP_STATUS:%{http_code}" http://localhost${page}`, { 
      encoding: 'utf8', 
      timeout: 10000 
    });
    
    const [response, statusLine] = result.split('HTTP_STATUS:');
    const status = statusLine?.trim();
    
    if (status && status.startsWith('2')) {
      log(`✅ ${description} - HTTP ${status}`, 'green');
      
      // Check for specific content indicators
      if (response.includes('Wedding.lk') || response.includes('wedding')) {
        log(`   🎯 Content: Wedding.lk content detected`, 'green');
      }
      if (response.includes('Loading...')) {
        log(`   ⚠️  Content: Loading states detected`, 'yellow');
      }
      if (response.includes('error') || response.includes('Error')) {
        log(`   ⚠️  Content: Error messages detected`, 'yellow');
      }
      
      return { success: true, status, hasContent: response.length > 1000 };
    } else {
      log(`❌ ${description} - HTTP ${status}`, 'red');
      return { success: false, status, error: 'Non-2xx status' };
    }
  } catch (error) {
    log(`❌ ${description} - FAILED`, 'red');
    log(`   Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

// 1. Container Status Check
log('\n📦 CONTAINER STATUS CHECK', 'bright');
const containerStatus = runCommand('docker-compose ps', 'Container Status');

// 2. Database Connectivity Check
log('\n🗄️  DATABASE CONNECTIVITY CHECK', 'bright');
const dbConnectivity = runCommand('docker-compose exec mongodb mongosh --username admin --password password123 --authenticationDatabase admin --eval "db.runCommand({ping: 1})"', 'MongoDB Connection');

// 3. Database Data Check
log('\n📊 DATABASE DATA CHECK', 'bright');
const userCount = runCommand('docker-compose exec mongodb mongosh --username admin --password password123 --authenticationDatabase admin weddinglk --eval "db.users.countDocuments()"', 'User Count');
const venueCount = runCommand('docker-compose exec mongodb mongosh --username admin --password password123 --authenticationDatabase admin weddinglk --eval "db.venues.countDocuments()"', 'Venue Count');
const vendorCount = runCommand('docker-compose exec mongodb mongosh --username admin --password password123 --authenticationDatabase admin weddinglk --eval "db.vendors.countDocuments()"', 'Vendor Count');
const reviewCount = runCommand('docker-compose exec mongodb mongosh --username admin --password password123 --authenticationDatabase admin weddinglk --eval "db.reviews.countDocuments()"', 'Review Count');

// 4. API Endpoints Check
log('\n🔌 API ENDPOINTS CHECK', 'bright');
const apis = [
  { endpoint: '/api/home/featured-vendors', description: 'Featured Vendors API' },
  { endpoint: '/api/home/featured-venues', description: 'Featured Venues API' },
  { endpoint: '/api/home/testimonials', description: 'Testimonials API' },
  { endpoint: '/api/home/stats', description: 'Stats API' },
  { endpoint: '/api/health', description: 'Health Check API' },
  { endpoint: '/api/analytics', description: 'Analytics API' }
];

const apiResults = apis.map(api => testAPI(api.endpoint, api.description));

// 5. Frontend Pages Check
log('\n🌐 FRONTEND PAGES CHECK', 'bright');
const pages = [
  { page: '/', description: 'Homepage' },
  { page: '/login', description: 'Login Page' },
  { page: '/register', description: 'Register Page' },
  { page: '/vendors', description: 'Vendors Page' },
  { page: '/venues', description: 'Venues Page' },
  { page: '/test', description: 'Test Page' }
];

const pageResults = pages.map(page => testFrontendPage(page.page, page.description));

// 6. Network Connectivity Check
log('\n🌐 NETWORK CONNECTIVITY CHECK', 'bright');
const networkCheck = runCommand('docker-compose exec app curl -s http://localhost:3000 | head -1', 'Internal App Connectivity');

// 7. Performance Check
log('\n⚡ PERFORMANCE CHECK', 'bright');
const responseTime = runCommand('curl -s -w "Response Time: %{time_total}s\n" -o /dev/null http://localhost/', 'Homepage Response Time');

// 8. Summary Report
log('\n📋 COMPREHENSIVE HEALTH CHECK SUMMARY', 'bright');
log('=' * 60, 'bright');

// Container Summary
log('\n📦 CONTAINERS:', 'bright');
if (containerStatus.success) {
  log('✅ All containers are running', 'green');
} else {
  log('❌ Container issues detected', 'red');
}

// Database Summary
log('\n🗄️  DATABASE:', 'bright');
if (dbConnectivity.success) {
  log('✅ MongoDB connection successful', 'green');
} else {
  log('❌ MongoDB connection failed', 'red');
}

// Data Summary
log('\n📊 DATA STATUS:', 'bright');
const dataChecks = [userCount, venueCount, vendorCount, reviewCount];
const dataSuccess = dataChecks.filter(check => check.success).length;
log(`✅ ${dataSuccess}/4 data checks passed`, dataSuccess === 4 ? 'green' : 'yellow');

// API Summary
log('\n🔌 API STATUS:', 'bright');
const apiSuccess = apiResults.filter(api => api.success).length;
log(`✅ ${apiSuccess}/${apis.length} APIs working`, apiSuccess === apis.length ? 'green' : 'yellow');

// Frontend Summary
log('\n🌐 FRONTEND STATUS:', 'bright');
const pageSuccess = pageResults.filter(page => page.success).length;
log(`✅ ${pageSuccess}/${pages.length} pages loading`, pageSuccess === pages.length ? 'green' : 'yellow');

// Overall Health Score
const totalChecks = 1 + 1 + 4 + apis.length + pages.length + 1 + 1; // containers + db + data + apis + pages + network + performance
const passedChecks = (containerStatus.success ? 1 : 0) + 
                    (dbConnectivity.success ? 1 : 0) + 
                    dataChecks.filter(check => check.success).length +
                    apiSuccess + 
                    pageSuccess + 
                    (networkCheck.success ? 1 : 0) + 
                    (responseTime.success ? 1 : 0);

const healthScore = Math.round((passedChecks / totalChecks) * 100);

log('\n🏥 OVERALL HEALTH SCORE:', 'bright');
if (healthScore >= 90) {
  log(`🟢 EXCELLENT: ${healthScore}% (${passedChecks}/${totalChecks})`, 'green');
} else if (healthScore >= 70) {
  log(`🟡 GOOD: ${healthScore}% (${passedChecks}/${totalChecks})`, 'yellow');
} else if (healthScore >= 50) {
  log(`🟠 FAIR: ${healthScore}% (${passedChecks}/${totalChecks})`, 'yellow');
} else {
  log(`🔴 POOR: ${healthScore}% (${passedChecks}/${totalChecks})`, 'red');
}

// Recommendations
log('\n💡 RECOMMENDATIONS:', 'bright');
if (healthScore < 90) {
  if (!containerStatus.success) {
    log('🔧 Fix container issues first', 'yellow');
  }
  if (!dbConnectivity.success) {
    log('🔧 Check MongoDB connection and credentials', 'yellow');
  }
  if (apiSuccess < apis.length) {
    log('🔧 Investigate failing API endpoints', 'yellow');
  }
  if (pageSuccess < pages.length) {
    log('🔧 Check frontend component errors', 'yellow');
  }
} else {
  log('🎉 System is healthy! No immediate action needed.', 'green');
}

log('\n🏁 COMPREHENSIVE HEALTH CHECK COMPLETED!', 'bright'); 
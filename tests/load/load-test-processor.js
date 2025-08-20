// Load Test Processor for WeddingLK
// This file contains custom logic for Artillery load testing

// Custom functions for load testing
function generateSearchQuery() {
  const queries = [
    "wedding photographer",
    "beach venue",
    "catering service",
    "wedding planner",
    "florist",
    "music band",
    "wedding cake",
    "decorations",
    "transportation",
    "makeup artist",
    "bridal dress",
    "wedding rings",
    "honeymoon",
    "wedding invitations",
    "wedding officiant"
  ];
  return queries[Math.floor(Math.random() * queries.length)];
}

function generateRandomPage() {
  return Math.floor(Math.random() * 10) + 1;
}

function generateRandomLimit() {
  const limits = [12, 24, 48];
  return limits[Math.floor(Math.random() * limits.length)];
}

function generateRandomLocation() {
  const locations = [
    "Colombo",
    "Kandy",
    "Galle",
    "Jaffna",
    "Trincomalee",
    "Anuradhapura",
    "Polonnaruwa",
    "Sigiriya",
    "Ella",
    "Mirissa"
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

function generateRandomBudget() {
  const budgets = [
    "100000-200000",
    "200000-500000",
    "500000-1000000",
    "1000000+"
  ];
  return budgets[Math.floor(Math.random() * budgets.length)];
}

function generateRandomDate() {
  const start = new Date();
  const end = new Date();
  end.setFullYear(end.getFullYear() + 1);
  
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split('T')[0];
}

// Custom request headers
function setCustomHeaders(requestParams, context, events, done) {
  requestParams.headers = requestParams.headers || {};
  
  // Set realistic user agent
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0"
  ];
  
  requestParams.headers['User-Agent'] = userAgents[Math.floor(Math.random() * userAgents.length)];
  requestParams.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
  requestParams.headers['Accept-Language'] = 'en-US,en;q=0.5';
  requestParams.headers['Accept-Encoding'] = 'gzip, deflate';
  requestParams.headers['Connection'] = 'keep-alive';
  requestParams.headers['Upgrade-Insecure-Requests'] = '1';
  
  return done();
}

// Simulate realistic user behavior
function simulateUserBehavior(requestParams, context, events, done) {
  // Add random think time between requests
  const thinkTime = Math.floor(Math.random() * 3000) + 1000; // 1-4 seconds
  
  setTimeout(() => {
    // Add random query parameters for variety
    if (requestParams.url.includes('/api/vendors') || requestParams.url.includes('/api/venues')) {
      const url = new URL(requestParams.url, 'http://localhost');
      url.searchParams.set('page', generateRandomPage().toString());
      url.searchParams.set('limit', generateRandomLimit().toString());
      
      // Add random filters
      if (Math.random() > 0.5) {
        url.searchParams.set('location', generateRandomLocation());
      }
      if (Math.random() > 0.7) {
        url.searchParams.set('budget', generateRandomBudget());
      }
      
      requestParams.url = url.pathname + url.search;
    }
    
    // Add random search queries
    if (requestParams.url.includes('/api/ai-search')) {
      const url = new URL(requestParams.url, 'http://localhost');
      url.searchParams.set('q', generateSearchQuery());
      requestParams.url = url.pathname + url.search;
    }
    
    done();
  }, thinkTime);
}

// Custom response validation
function validateResponse(requestParams, response, context, events, done) {
  // Log response time for performance analysis
  if (response.timings && response.timings.phases) {
    const totalTime = response.timings.phases.firstByte + response.timings.phases.download;
    console.log(`Response time for ${requestParams.url}: ${totalTime}ms`);
    
    // Alert on slow responses
    if (totalTime > 5000) {
      console.warn(`⚠️ Slow response detected: ${requestParams.url} took ${totalTime}ms`);
    }
  }
  
  // Validate response structure for API endpoints
  if (requestParams.url.includes('/api/')) {
    try {
      const body = JSON.parse(response.body);
      
      // Check for required fields based on endpoint
      if (requestParams.url.includes('/api/vendors') || requestParams.url.includes('/api/venues')) {
        if (!body.vendors && !body.venues) {
          console.error(`❌ Invalid response structure for ${requestParams.url}`);
        }
      }
      
      if (requestParams.url.includes('/api/home/stats')) {
        if (!body.userCount && !body.vendorCount) {
          console.error(`❌ Invalid stats response structure for ${requestParams.url}`);
        }
      }
      
    } catch (error) {
      console.error(`❌ Failed to parse JSON response from ${requestParams.url}:`, error);
    }
  }
  
  return done();
}

// Custom metrics collection
function collectCustomMetrics(requestParams, response, context, events, done) {
  // Track endpoint performance
  const endpoint = requestParams.url.split('?')[0];
  if (!context.vars.endpointMetrics) {
    context.vars.endpointMetrics = {};
  }
  
  if (!context.vars.endpointMetrics[endpoint]) {
    context.vars.endpointMetrics[endpoint] = {
      count: 0,
      totalTime: 0,
      minTime: Infinity,
      maxTime: 0,
      errors: 0
    };
  }
  
  const metrics = context.vars.endpointMetrics[endpoint];
  metrics.count++;
  
  if (response.timings && response.timings.phases) {
    const responseTime = response.timings.phases.firstByte + response.timings.phases.download;
    metrics.totalTime += responseTime;
    metrics.minTime = Math.min(metrics.minTime, responseTime);
    metrics.maxTime = Math.max(metrics.maxTime, responseTime);
  }
  
  if (response.statusCode >= 400) {
    metrics.errors++;
  }
  
  // Log metrics every 100 requests
  if (metrics.count % 100 === 0) {
    const avgTime = metrics.totalTime / metrics.count;
    const errorRate = (metrics.errors / metrics.count) * 100;
    console.log(`📊 ${endpoint}: ${metrics.count} requests, avg: ${avgTime.toFixed(2)}ms, errors: ${errorRate.toFixed(2)}%`);
  }
  
  return done();
}

// Export functions for Artillery
module.exports = {
  setCustomHeaders,
  simulateUserBehavior,
  validateResponse,
  collectCustomMetrics,
  generateSearchQuery,
  generateRandomPage,
  generateRandomLocation,
  generateRandomBudget,
  generateRandomDate
}; 
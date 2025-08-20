import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const bookingSuccessRate = new Rate('booking_success');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.1'],    // Error rate must be below 10%
    'booking_success': ['rate>0.9'],  // Booking success rate must be above 90%
  },
};

// Test data
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const TEST_VENUE_ID = 'test-venue-1';
const TEST_VENDOR_ID = 'test-vendor-1';

// Helper function to generate random user data
function generateUserData() {
  const timestamp = Date.now();
  return {
    email: `test${timestamp}@example.com`,
    name: `Test User ${timestamp}`,
    password: 'password123',
    role: 'couple',
  };
}

// Helper function to generate random booking data
function generateBookingData() {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);
  
  return {
    venueId: TEST_VENUE_ID,
    vendorId: TEST_VENDOR_ID,
    date: futureDate.toISOString().split('T')[0],
    guestCount: Math.floor(Math.random() * 200) + 50,
    specialRequirements: 'Test booking requirements',
  };
}

// Main test function
export default function () {
  const userData = generateUserData();
  const bookingData = generateBookingData();

  // Test 1: Health Check
  const healthCheck = http.get(`${BASE_URL}/api/health`);
  check(healthCheck, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 200ms': (r) => r.timings.duration < 200,
  });

  // Test 2: User Registration
  const registerResponse = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify(userData), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(registerResponse, {
    'registration status is 201': (r) => r.status === 201,
    'registration response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  if (registerResponse.status !== 201) {
    errorRate.add(1);
  }

  // Test 3: User Login
  const loginResponse = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: userData.email,
    password: userData.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginResponse, {
    'login status is 200': (r) => r.status === 200,
    'login response time < 800ms': (r) => r.timings.duration < 800,
  });

  if (loginResponse.status !== 200) {
    errorRate.add(1);
  }

  // Extract token from login response
  let token = '';
  if (loginResponse.status === 200) {
    try {
      const loginData = JSON.parse(loginResponse.body);
      token = loginData.token || '';
    } catch (e) {
      console.error('Failed to parse login response:', e);
    }
  }

  // Test 4: Search Venues
  const searchVenuesResponse = http.get(`${BASE_URL}/api/venues?city=Colombo&capacity=${bookingData.guestCount}`);
  check(searchVenuesResponse, {
    'venue search status is 200': (r) => r.status === 200,
    'venue search response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Test 5: Get Venue Details
  const venueDetailsResponse = http.get(`${BASE_URL}/api/venues/${TEST_VENUE_ID}`);
  check(venueDetailsResponse, {
    'venue details status is 200': (r) => r.status === 200,
    'venue details response time < 400ms': (r) => r.timings.duration < 400,
  });

  // Test 6: Check Venue Availability
  const availabilityResponse = http.get(`${BASE_URL}/api/venues/${TEST_VENUE_ID}/availability?date=${bookingData.date}`);
  check(availabilityResponse, {
    'availability check status is 200': (r) => r.status === 200,
    'availability check response time < 300ms': (r) => r.timings.duration < 300,
  });

  // Test 7: Create Booking (if token available)
  if (token) {
    const bookingResponse = http.post(`${BASE_URL}/api/bookings`, JSON.stringify(bookingData), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    check(bookingResponse, {
      'booking creation status is 201': (r) => r.status === 201,
      'booking creation response time < 1500ms': (r) => r.timings.duration < 1500,
    });

    if (bookingResponse.status === 201) {
      bookingSuccessRate.add(1);
    } else {
      errorRate.add(1);
    }
  }

  // Test 8: Get User Bookings
  if (token) {
    const userBookingsResponse = http.get(`${BASE_URL}/api/bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    check(userBookingsResponse, {
      'user bookings status is 200': (r) => r.status === 200,
      'user bookings response time < 600ms': (r) => r.timings.duration < 600,
    });
  }

  // Test 9: Home Page Stats
  const homeStatsResponse = http.get(`${BASE_URL}/api/home/stats`);
  check(homeStatsResponse, {
    'home stats status is 200': (r) => r.status === 200,
    'home stats response time < 300ms': (r) => r.timings.duration < 300,
  });

  // Test 10: Featured Vendors
  const featuredVendorsResponse = http.get(`${BASE_URL}/api/home/featured-vendors`);
  check(featuredVendorsResponse, {
    'featured vendors status is 200': (r) => r.status === 200,
    'featured vendors response time < 400ms': (r) => r.timings.duration < 400,
  });

  // Random sleep between requests to simulate real user behavior
  sleep(Math.random() * 3 + 1);
}

// Setup function (runs once before the test)
export function setup() {
  console.log('Setting up performance test...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log('Performance test will simulate realistic user load on the booking system');
}

// Teardown function (runs once after the test)
export function teardown(data) {
  console.log('Performance test completed');
  console.log('Check the metrics above for performance insights');
} 
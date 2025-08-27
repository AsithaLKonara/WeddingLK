import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

// Custom metrics
const errorRate = new Rate('errors')
const bookingDuration = new Trend('booking_duration')
const searchDuration = new Trend('search_duration')
const paymentDuration = new Trend('payment_duration')

// Test configuration
export const options = {
  stages: [
    // Ramp up to 50 users over 2 minutes
    { duration: '2m', target: 50 },
    // Stay at 50 users for 5 minutes
    { duration: '5m', target: 50 },
    // Ramp up to 100 users over 3 minutes
    { duration: '3m', target: 100 },
    // Stay at 100 users for 5 minutes
    { duration: '5m', target: 100 },
    // Ramp down to 0 users over 2 minutes
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    http_req_failed: ['rate<0.1'],     // Error rate must be below 10%
    'errors': ['rate<0.1'],            // Custom error rate
    'booking_duration': ['p(95)<5000'], // 95% of bookings must complete below 5s
    'search_duration': ['p(95)<1000'],  // 95% of searches must complete below 1s
    'payment_duration': ['p(95)<3000'], // 95% of payments must complete below 3s
  },
}

// Test data
const testUsers = [
  { email: 'user1@test.com', password: 'password123' },
  { email: 'user2@test.com', password: 'password123' },
  { email: 'user3@test.com', password: 'password123' },
  { email: 'user4@test.com', password: 'password123' },
  { email: 'user5@test.com', password: 'password123' },
]

const testVenues = [
  { location: 'Colombo', guestCount: 150, budget: 2000000 },
  { location: 'Kandy', guestCount: 100, budget: 1500000 },
  { location: 'Galle', guestCount: 200, budget: 3000000 },
  { location: 'Jaffna', guestCount: 80, budget: 1200000 },
  { location: 'Trincomalee', guestCount: 120, budget: 1800000 },
]

// Main test function
export default function () {
  const user = testUsers[Math.floor(Math.random() * testUsers.length)]
  const venue = testVenues[Math.floor(Math.random() * testVenues.length)]
  
  // Simulate user session
  const session = simulateUserSession(user, venue)
  
  // Record metrics
  if (session.success) {
    errorRate.add(0)
  } else {
    errorRate.add(1)
  }
}

// Simulate complete user session
function simulateUserSession(user, venue) {
  try {
    // 1. Homepage load
    const homeResponse = http.get('http://localhost:3000/')
    check(homeResponse, {
      'homepage loads successfully': (r) => r.status === 200,
      'homepage loads fast': (r) => r.timings.duration < 1000,
    })

    // 2. Search for venues
    const searchStart = Date.now()
    const searchResponse = http.get(`http://localhost:3000/api/venues?location=${venue.location}&guestCount=${venue.guestCount}&budget=${venue.budget}`)
    const searchEnd = Date.now()
    
    check(searchResponse, {
      'venue search successful': (r) => r.status === 200,
      'search returns results': (r) => JSON.parse(r.body).data.venues.length > 0,
    })
    
    searchDuration.add(searchEnd - searchStart)

    // 3. View venue details
    const venueId = JSON.parse(searchResponse.body).data.venues[0]._id
    const venueResponse = http.get(`http://localhost:3000/api/venues/${venueId}`)
    
    check(venueResponse, {
      'venue details loaded': (r) => r.status === 200,
      'venue has pricing': (r) => JSON.parse(r.body).data.venue.pricePerGuest > 0,
    })

    // 4. Check availability
    const availabilityResponse = http.get(`http://localhost:3000/api/venues/${venueId}/availability?date=2025-08-25`)
    
    check(availabilityResponse, {
      'availability check successful': (r) => r.status === 200,
    })

    // 5. Create booking (simulate)
    const bookingStart = Date.now()
    const bookingData = {
      userId: 'test-user-id',
      venueId: venueId,
      eventDate: '2025-08-25',
      guestCount: venue.guestCount,
      totalAmount: venue.budget,
      services: ['Venue', 'Catering', 'Decoration']
    }
    
    const bookingResponse = http.post('http://localhost:3000/api/bookings', JSON.stringify(bookingData), {
      headers: { 'Content-Type': 'application/json' }
    })
    
    const bookingEnd = Date.now()
    
    check(bookingResponse, {
      'booking creation successful': (r) => r.status === 200 || r.status === 201,
    })
    
    bookingDuration.add(bookingEnd - bookingStart)

    // 6. Process payment (simulate)
    const paymentStart = Date.now()
    const paymentData = {
      bookingId: 'test-booking-id',
      amount: venue.budget,
      paymentMethod: 'credit_card',
      cardNumber: '4111111111111111',
      expiryDate: '12/25',
      cvv: '123'
    }
    
    const paymentResponse = http.post('http://localhost:3000/api/payments', JSON.stringify(paymentData), {
      headers: { 'Content-Type': 'application/json' }
    })
    
    const paymentEnd = Date.now()
    
    check(paymentResponse, {
      'payment processing successful': (r) => r.status === 200 || r.status === 201,
    })
    
    paymentDuration.add(paymentEnd - paymentStart)

    // 7. Social features
    const feedResponse = http.get('http://localhost:3000/api/feed')
    check(feedResponse, {
      'social feed loaded': (r) => r.status === 200,
    })

    // 8. AI recommendations
    const recommendationsResponse = http.get(`http://localhost:3000/api/recommendations?budget=${venue.budget}&location=${venue.location}`)
    check(recommendationsResponse, {
      'recommendations loaded': (r) => r.status === 200,
    })

    return { success: true }
  } catch (error) {
    console.error('Session error:', error)
    return { success: false, error: error.message }
  }
}

// Setup function (runs once before the test)
export function setup() {
  console.log('Starting WeddingLK load test...')
  console.log('Target: 100 concurrent users')
  console.log('Duration: 17 minutes')
  console.log('Thresholds: 95% requests < 2s, Error rate < 10%')
}

// Teardown function (runs once after the test)
export function teardown(data) {
  console.log('Load test completed!')
  console.log('Final metrics:')
  console.log('- Total requests:', data.metrics.http_reqs?.count || 'N/A')
  console.log('- Average response time:', data.metrics.http_req_duration?.avg || 'N/A')
  console.log('- Error rate:', data.metrics.http_req_failed?.rate || 'N/A')
}

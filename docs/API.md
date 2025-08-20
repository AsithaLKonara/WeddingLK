# 🔌 API Documentation - WeddingLK NextJS

Complete API reference for the WeddingLK platform.

## 🎯 Overview

### Base URL
- **Development**: `http://localhost:3000/api`
- **Staging**: `https://staging.weddinglk.com/api`
- **Production**: `https://api.weddinglk.com`

### Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔐 Authentication

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "couple"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "couple",
      "verified": false
    }
  },
  "message": "User registered successfully"
}
```

### POST /api/auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "couple"
    },
    "token": "jwt-token-here"
  },
  "message": "Login successful"
}
```

### GET /api/auth/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "couple",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## 🏢 Vendors

### GET /api/vendors
Get list of vendors with filtering and pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Vendor category
- `location`: Location filter
- `rating`: Minimum rating
- `verified`: Verified status (true/false)

**Response:**
```json
{
  "success": true,
  "data": {
    "vendors": [
      {
        "id": "vendor-id",
        "name": "Perfect Photography",
        "businessName": "Perfect Photography Studio",
        "category": "photography",
        "rating": 4.8,
        "reviewCount": 45,
        "location": {
          "city": "Colombo",
          "state": "Western Province"
        },
        "isVerified": true,
        "avatar": "https://example.com/vendor-avatar.jpg"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "pages": 15
    }
  }
}
```

### GET /api/vendors/:id
Get detailed vendor information.

**Response:**
```json
{
  "success": true,
  "data": {
    "vendor": {
      "id": "vendor-id",
      "name": "Perfect Photography",
      "businessName": "Perfect Photography Studio",
      "category": "photography",
      "description": "Professional wedding photography services",
      "rating": 4.8,
      "reviewCount": 45,
      "location": {
        "address": "123 Main Street",
        "city": "Colombo",
        "state": "Western Province",
        "country": "Sri Lanka",
        "coordinates": {
          "lat": 6.9271,
          "lng": 79.8612
        }
      },
      "contact": {
        "phone": "+94 11 123 4567",
        "email": "info@perfectphotography.com",
        "website": "https://perfectphotography.com"
      },
      "services": [
        {
          "name": "Wedding Photography",
          "description": "Full day wedding coverage",
          "price": 50000,
          "currency": "LKR"
        }
      ],
      "portfolio": [
        {
          "id": "image-id",
          "url": "https://example.com/image1.jpg",
          "caption": "Beautiful wedding ceremony"
        }
      ],
      "reviews": [
        {
          "id": "review-id",
          "rating": 5,
          "comment": "Excellent service!",
          "user": {
            "name": "Jane Doe",
            "avatar": "https://example.com/user-avatar.jpg"
          },
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### POST /api/vendors
Create a new vendor profile (requires authentication).

**Request Body:**
```json
{
  "name": "Perfect Photography",
  "businessName": "Perfect Photography Studio",
  "category": "photography",
  "description": "Professional wedding photography services",
  "location": {
    "address": "123 Main Street",
    "city": "Colombo",
    "state": "Western Province",
    "country": "Sri Lanka"
  },
  "contact": {
    "phone": "+94 11 123 4567",
    "email": "info@perfectphotography.com",
    "website": "https://perfectphotography.com"
  }
}
```

## 🏰 Venues

### GET /api/venues
Get list of venues with filtering and pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `location`: Location filter
- `capacity`: Minimum capacity
- `priceRange`: Price range filter
- `amenities`: Amenities filter

**Response:**
```json
{
  "success": true,
  "data": {
    "venues": [
      {
        "id": "venue-id",
        "name": "Grand Hotel Ballroom",
        "location": {
          "city": "Colombo",
          "state": "Western Province"
        },
        "capacity": 200,
        "pricePerPerson": 5000,
        "rating": 4.5,
        "amenities": ["parking", "catering", "decorations"],
        "images": [
          "https://example.com/venue1.jpg"
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 75,
      "pages": 8
    }
  }
}
```

### GET /api/venues/:id
Get detailed venue information.

**Response:**
```json
{
  "success": true,
  "data": {
    "venue": {
      "id": "venue-id",
      "name": "Grand Hotel Ballroom",
      "description": "Elegant ballroom for special occasions",
      "location": {
        "address": "456 Hotel Street",
        "city": "Colombo",
        "state": "Western Province",
        "country": "Sri Lanka",
        "coordinates": {
          "lat": 6.9271,
          "lng": 79.8612
        }
      },
      "capacity": {
        "min": 50,
        "max": 200,
        "recommended": 150
      },
      "pricing": {
        "basePrice": 100000,
        "pricePerPerson": 5000,
        "setupFee": 15000,
        "cleaningFee": 10000,
        "currency": "LKR"
      },
      "amenities": [
        {
          "name": "Parking",
          "included": true,
          "description": "Free parking for 100 vehicles"
        },
        {
          "name": "Catering",
          "included": false,
          "description": "External catering allowed"
        }
      ],
      "availability": [
        {
          "date": "2024-12-25",
          "available": true,
          "price": 150000
        }
      ],
      "images": [
        {
          "id": "image-id",
          "url": "https://example.com/venue1.jpg",
          "caption": "Main ballroom"
        }
      ],
      "rating": 4.5,
      "reviewCount": 32
    }
  }
}
```

### GET /api/venues/availability
Check venue availability for specific dates.

**Query Parameters:**
- `venueId`: Venue ID
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)
- `guestCount`: Number of guests

**Response:**
```json
{
  "success": true,
  "data": {
    "availability": [
      {
        "date": "2024-12-25",
        "available": true,
        "price": 150000,
        "notes": "Christmas special pricing"
      },
      {
        "date": "2024-12-26",
        "available": false,
        "reason": "Already booked"
      }
    ],
    "totalPrice": 150000,
    "perPersonPrice": 5000
  }
}
```

## 📅 Bookings

### POST /api/bookings
Create a new booking.

**Request Body:**
```json
{
  "venueId": "venue-id",
  "vendorIds": ["vendor-id-1", "vendor-id-2"],
  "date": "2024-12-25",
  "startTime": "18:00",
  "endTime": "23:00",
  "guestCount": 150,
  "specialRequirements": "Vegetarian catering required",
  "contactPerson": {
    "name": "John Doe",
    "phone": "+94 11 123 4567",
    "email": "john@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "booking-id",
      "status": "pending",
      "totalAmount": 250000,
      "depositAmount": 50000,
      "dueDate": "2024-11-25",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Booking created successfully"
}
```

### GET /api/bookings/:id
Get booking details.

**Response:**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "booking-id",
      "status": "confirmed",
      "venue": {
        "id": "venue-id",
        "name": "Grand Hotel Ballroom"
      },
      "vendors": [
        {
          "id": "vendor-id",
          "name": "Perfect Photography",
          "service": "Wedding Photography"
        }
      ],
      "date": "2024-12-25",
      "startTime": "18:00",
      "endTime": "23:00",
      "guestCount": 150,
      "totalAmount": 250000,
      "depositAmount": 50000,
      "paidAmount": 50000,
      "dueAmount": 200000,
      "dueDate": "2024-11-25",
      "specialRequirements": "Vegetarian catering required",
      "contactPerson": {
        "name": "John Doe",
        "phone": "+94 11 123 4567",
        "email": "john@example.com"
      },
      "timeline": [
        {
          "date": "2024-01-01",
          "action": "Booking created",
          "status": "completed"
        },
        {
          "date": "2024-01-15",
          "action": "Deposit paid",
          "status": "completed"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### PUT /api/bookings/:id/status
Update booking status.

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Payment received, booking confirmed"
}
```

## 💳 Payments

### POST /api/payments/create-intent
Create payment intent for Stripe.

**Request Body:**
```json
{
  "amount": 50000,
  "currency": "lkr",
  "bookingId": "booking-id",
  "description": "Deposit payment for wedding booking"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_client_secret_here",
    "paymentIntentId": "pi_payment_intent_id"
  }
}
```

### POST /api/payments/webhook
Stripe webhook endpoint for payment confirmations.

**Headers:**
```
Stripe-Signature: <stripe-signature>
```

## 🔍 Search

### GET /api/search
Search across vendors, venues, and services.

**Query Parameters:**
- `q`: Search query
- `type`: Search type (vendors, venues, all)
- `category`: Category filter
- `location`: Location filter
- `priceRange`: Price range filter
- `date`: Date filter

**Response:**
```json
{
  "success": true,
  "data": {
    "results": {
      "vendors": [
        {
          "id": "vendor-id",
          "name": "Perfect Photography",
          "category": "photography",
          "rating": 4.8,
          "relevanceScore": 0.95
        }
      ],
      "venues": [
        {
          "id": "venue-id",
          "name": "Grand Hotel Ballroom",
          "rating": 4.5,
          "relevanceScore": 0.87
        }
      ]
    },
    "totalResults": 25,
    "searchTime": 0.15
  }
}
```

## 📊 Analytics

### GET /api/analytics/dashboard
Get dashboard analytics (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalBookings": 150,
      "totalRevenue": 25000000,
      "activeVendors": 45,
      "activeVenues": 12
    },
    "recentBookings": [
      {
        "id": "booking-id",
        "date": "2024-12-25",
        "amount": 250000,
        "status": "confirmed"
      }
    ],
    "revenueChart": {
      "labels": ["Jan", "Feb", "Mar"],
      "data": [1000000, 1500000, 2000000]
    }
  }
}
```

## 🏥 Health Check

### GET /api/health
System health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 86400,
  "environment": "production",
  "services": {
    "database": true,
    "redis": true,
    "external": true
  }
}
```

## 📝 Error Codes

### Common Error Codes
- `AUTH_REQUIRED`: Authentication required
- `INVALID_TOKEN`: Invalid or expired token
- `PERMISSION_DENIED`: Insufficient permissions
- `VALIDATION_ERROR`: Request validation failed
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict
- `RATE_LIMITED`: Too many requests
- `INTERNAL_ERROR`: Internal server error

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Validation Error
- `429`: Too Many Requests
- `500`: Internal Server Error

## 📚 Rate Limiting

### Limits
- **Public endpoints**: 100 requests per minute
- **Authenticated endpoints**: 1000 requests per minute
- **File uploads**: 10 requests per minute

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🔒 Security

### Headers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

### CORS
- **Allowed Origins**: Configured per environment
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization
- **Credentials**: true

---

**For more information, see the main [README.md](../README.md) or contact the API team.** 
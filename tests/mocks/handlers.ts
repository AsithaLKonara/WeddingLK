import { rest } from 'msw';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const handlers = [
  // Health check
  rest.get(`${baseUrl}/api/health`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      })
    );
  }),

  // Auth endpoints
  rest.post(`${baseUrl}/api/auth/register`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
          role: 'couple',
        },
      })
    );
  }),

  rest.post(`${baseUrl}/api/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        message: 'Login successful',
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
          role: 'couple',
        },
        token: 'test-jwt-token',
      })
    );
  }),

  // Vendors endpoints
  rest.get(`${baseUrl}/api/vendors`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        vendors: [
          {
            id: 'vendor-1',
            name: 'Test Vendor',
            businessName: 'Test Business',
            category: 'photography',
            rating: 4.5,
            isVerified: true,
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      })
    );
  }),

  rest.get(`${baseUrl}/api/vendors/:id`, (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        id,
        name: 'Test Vendor',
        businessName: 'Test Business',
        category: 'photography',
        rating: 4.5,
        isVerified: true,
        services: ['wedding-photography', 'engagement-shoots'],
        portfolio: [],
        reviews: [],
      })
    );
  }),

  // Venues endpoints
  rest.get(`${baseUrl}/api/venues`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        venues: [
          {
            id: 'venue-1',
            name: 'Test Venue',
            location: {
              city: 'Colombo',
              state: 'Western Province',
              country: 'Sri Lanka',
            },
            capacity: 200,
            pricePerPerson: 5000,
            rating: 4.8,
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      })
    );
  }),

  // Bookings endpoints
  rest.post(`${baseUrl}/api/bookings`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        message: 'Booking created successfully',
        booking: {
          id: 'booking-1',
          userId: 'test-user-id',
          vendorId: 'vendor-1',
          venueId: 'venue-1',
          date: '2024-12-25',
          guestCount: 100,
          totalAmount: 500000,
          status: 'pending',
        },
      })
    );
  }),

  // Home stats
  rest.get(`${baseUrl}/api/home/stats`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        totalVendors: 150,
        totalVenues: 75,
        totalBookings: 1200,
        totalUsers: 5000,
      })
    );
  }),

  // Featured vendors
  rest.get(`${baseUrl}/api/home/featured-vendors`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        vendors: [
          {
            id: 'featured-1',
            name: 'Featured Vendor',
            businessName: 'Premium Services',
            category: 'catering',
            rating: 4.9,
            isVerified: true,
            featured: true,
          },
        ],
      })
    );
  }),
]; 
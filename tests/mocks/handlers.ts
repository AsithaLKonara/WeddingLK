import { http, HttpResponse } from 'msw';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const handlers = [
  // Health check
  http.get(`${baseUrl}/api/health`, () => {
    return HttpResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  }),

  // Auth endpoints
  http.post(`${baseUrl}/api/auth/register`, async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: '123',
        email: body?.email || 'test@example.com',
        name: body?.name || 'Test User',
        role: body?.role || 'user'
      }
    });
  }),

  http.post(`${baseUrl}/api/auth/login`, async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      success: true,
      message: 'Login successful',
      token: 'test-jwt-token',
      user: {
        id: '123',
        email: body?.email || 'test@example.com',
        name: body?.name || 'Test User',
        role: body?.role || 'user'
      }
    });
  }),

  // Vendors endpoints
  http.get(`${baseUrl}/api/vendors`, () => {
    return HttpResponse.json({
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
    });
  }),

  http.get(`${baseUrl}/api/vendors/:id`, ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id,
      name: 'Test Vendor',
      businessName: 'Test Business',
      category: 'photography',
      rating: 4.5,
      isVerified: true,
    });
  }),

  // Venues endpoints
  http.get(`${baseUrl}/api/venues`, () => {
    return HttpResponse.json({
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
    });
  }),

  // Bookings endpoints
  http.post(`${baseUrl}/api/bookings`, async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        id: 'booking-1',
        userId: 'test-user-id',
        vendorId: 'vendor-1',
        venueId: 'venue-1',
        date: body?.date || '2024-12-25',
        guestCount: body?.guestCount || 100,
        totalAmount: body?.totalAmount || 500000,
        status: 'pending',
      },
    });
  }),

  // Home stats
  http.get(`${baseUrl}/api/home/stats`, () => {
    return HttpResponse.json({
      totalVendors: 150,
      totalVenues: 75,
      totalBookings: 1200,
      totalUsers: 5000,
    });
  }),

  // Featured vendors
  http.get(`${baseUrl}/api/home/featured-vendors`, () => {
    return HttpResponse.json({
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
    });
  }),
]; 
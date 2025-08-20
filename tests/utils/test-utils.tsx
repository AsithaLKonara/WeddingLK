import React, { ReactElement } from 'react';
import { render, RenderOptions, screen, fireEvent } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

// Mock session for testing
const mockSession = {
  data: {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'couple',
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  status: 'authenticated' as const,
};

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider session={mockSession.data}>
      {children}
    </SessionProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing library
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'couple',
  ...overrides,
});

export const createMockVendor = (overrides = {}) => ({
  id: 'test-vendor-id',
  name: 'Test Vendor',
  businessName: 'Test Business',
  category: 'photography',
  rating: 4.5,
  isVerified: true,
  ...overrides,
});

export const createMockVenue = (overrides = {}) => ({
  id: 'test-venue-id',
  name: 'Test Venue',
  location: {
    city: 'Colombo',
    state: 'Western Province',
    country: 'Sri Lanka',
  },
  capacity: 200,
  pricePerPerson: 5000,
  rating: 4.8,
  ...overrides,
});

export const createMockBooking = (overrides = {}) => ({
  id: 'test-booking-id',
  userId: 'test-user-id',
  vendorId: 'test-vendor-id',
  venueId: 'test-venue-id',
  date: '2024-12-25',
  guestCount: 100,
  totalAmount: 500000,
  status: 'pending',
  ...overrides,
}); 
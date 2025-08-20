import { validateBookingRequest } from '@/lib/bookings/booking-validator';

describe('Booking Validator', () => {
  const mockVenue = {
    id: 'venue-1',
    name: 'Test Venue',
    capacity: 100,
    availableDates: ['2024-06-15', '2024-06-16', '2024-06-17'],
    minimumNotice: 7, // days
    maximumAdvanceBooking: 365, // days
  };

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    verified: true,
    hasCompletedProfile: true,
  };

  it('validates a valid booking request', () => {
    const validRequest = {
      venueId: 'venue-1',
      userId: 'user-1',
      date: '2024-06-15',
      guestCount: 50,
      startTime: '18:00',
      endTime: '23:00',
      specialRequirements: 'None',
    };

    const result = validateBookingRequest(validRequest, mockVenue, mockUser);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects booking with guest count exceeding capacity', () => {
    const invalidRequest = {
      venueId: 'venue-1',
      userId: 'user-1',
      date: '2024-06-15',
      guestCount: 150, // Exceeds capacity of 100
      startTime: '18:00',
      endTime: '23:00',
      specialRequirements: 'None',
    };

    const result = validateBookingRequest(invalidRequest, mockVenue, mockUser);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Guest count exceeds venue capacity');
  });

  it('rejects booking for unavailable date', () => {
    const invalidRequest = {
      venueId: 'venue-1',
      userId: 'user-1',
      date: '2024-06-20', // Not in available dates
      guestCount: 50,
      startTime: '18:00',
      endTime: '23:00',
      specialRequirements: 'None',
    };

    const result = validateBookingRequest(invalidRequest, mockVenue, mockUser);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Selected date is not available');
  });

  it('rejects booking with insufficient notice', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];

    const invalidRequest = {
      venueId: 'venue-1',
      userId: 'user-1',
      date: tomorrowString, // Less than 7 days notice
      guestCount: 50,
      startTime: '18:00',
      endTime: '23:00',
      specialRequirements: 'None',
    };

    const result = validateBookingRequest(invalidRequest, mockVenue, mockUser);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Insufficient notice period');
  });

  it('rejects booking too far in advance', () => {
    const farFutureDate = '2026-06-15'; // More than 365 days ahead

    const invalidRequest = {
      venueId: 'venue-1',
      userId: 'user-1',
      date: farFutureDate,
      guestCount: 50,
      startTime: '18:00',
      endTime: '23:00',
      specialRequirements: 'None',
    };

    const result = validateBookingRequest(invalidRequest, mockVenue, mockUser);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Booking too far in advance');
  });

  it('rejects booking for unverified user', () => {
    const unverifiedUser = { ...mockUser, verified: false };
    
    const validRequest = {
      venueId: 'venue-1',
      userId: 'user-1',
      date: '2024-06-15',
      guestCount: 50,
      startTime: '18:00',
      endTime: '23:00',
      specialRequirements: 'None',
    };

    const result = validateBookingRequest(validRequest, mockVenue, unverifiedUser);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('User account not verified');
  });

  it('rejects booking for user with incomplete profile', () => {
    const incompleteUser = { ...mockUser, hasCompletedProfile: false };
    
    const validRequest = {
      venueId: 'venue-1',
      userId: 'user-1',
      date: '2024-06-15',
      guestCount: 50,
      startTime: '18:00',
      endTime: '23:00',
      specialRequirements: 'None',
    };

    const result = validateBookingRequest(validRequest, mockVenue, incompleteUser);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('User profile incomplete');
  });

  it('validates time constraints', () => {
    const invalidRequest = {
      venueId: 'venue-1',
      userId: 'user-1',
      date: '2024-06-15',
      guestCount: 50,
      startTime: '23:00', // End time before start time
      endTime: '18:00',
      specialRequirements: 'None',
    };

    const result = validateBookingRequest(invalidRequest, mockVenue, mockUser);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid time range');
  });

  it('handles multiple validation errors', () => {
    const invalidRequest = {
      venueId: 'venue-1',
      userId: 'user-1',
      date: '2024-06-20', // Unavailable date
      guestCount: 150, // Exceeds capacity
      startTime: '18:00',
      endTime: '23:00',
      specialRequirements: 'None',
    };

    const result = validateBookingRequest(invalidRequest, mockVenue, mockUser);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);
    expect(result.errors).toContain('Guest count exceeds venue capacity');
    expect(result.errors).toContain('Selected date is not available');
  });
}); 
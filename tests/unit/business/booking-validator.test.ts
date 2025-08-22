import { validateBookingRequest } from '@/lib/bookings/booking-validator';

describe('Booking Validator', () => {
  const mockVenue = {
    id: 'venue-1',
    name: 'Test Venue',
    capacity: 100,
    availableDates: [], // Will be populated dynamically in tests
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
    // Use a future date that meets all validation requirements
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30); // 30 days from now
    const futureDateString = futureDate.toISOString().split('T')[0];
    
    const venueWithAvailableDate = {
      ...mockVenue,
      availableDates: [futureDateString]
    };
    
    const validRequest = {
      venueId: 'venue-1',
      userId: 'user-1',
      date: futureDateString,
      guestCount: 50,
      startTime: '18:00',
      endTime: '23:00',
      specialRequirements: 'None',
    };

    const result = validateBookingRequest(validRequest, venueWithAvailableDate, mockUser);
    
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
    const venueWithLimitedDates = {
      ...mockVenue,
      availableDates: ['2024-06-15', '2024-06-16', '2024-06-17']
    };
    
    const invalidRequest = {
      venueId: 'venue-1',
      userId: 'user-1',
      date: '2024-06-20', // Not in available dates
      guestCount: 50,
      startTime: '18:00',
      endTime: '23:00',
      specialRequirements: 'None',
    };

    const result = validateBookingRequest(invalidRequest, venueWithLimitedDates, mockUser);
    
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
    // Create a date that's exactly 366 days from now (more than 365 days)
    const farFutureDate = new Date();
    farFutureDate.setDate(farFutureDate.getDate() + 366);
    const farFutureDateString = farFutureDate.toISOString().split('T')[0];
    
    const venueWithFarFutureDate = {
      ...mockVenue,
      availableDates: [farFutureDateString] // Make the date available so it gets to advance booking check
    };

    const invalidRequest = {
      venueId: 'venue-1',
      userId: 'user-1',
      date: farFutureDateString,
      guestCount: 50,
      startTime: '18:00',
      endTime: '23:00',
      specialRequirements: 'None',
    };

    const result = validateBookingRequest(invalidRequest, venueWithFarFutureDate, mockUser);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Cannot book more than 1 year in advance');
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
    expect(result.errors).toContain('User account must be verified to make bookings');
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
    // Incomplete profile only generates a warning, not an error
    expect(result.warnings).toContain('Complete your profile for better booking experience');
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
    expect(result.errors).toContain('Start time must be before end time');
  });

  it('handles multiple validation errors', () => {
    // Create a date that's exactly 366 days from now (more than 365 days)
    const farFutureDate = new Date();
    farFutureDate.setDate(farFutureDate.getDate() + 366);
    const farFutureDateString = farFutureDate.toISOString().split('T')[0];
    
    const venueWithLimitedDates = {
      ...mockVenue,
      availableDates: ['2024-06-15', '2024-06-16', '2024-06-17'] // Don't include the far future date
    };
    
    const invalidRequest = {
      venueId: 'venue-1',
      userId: 'user-1',
      date: farFutureDateString, // Unavailable date
      guestCount: 150, // Exceeds capacity
      startTime: '18:00',
      endTime: '23:00',
      specialRequirements: 'None',
    };

    const result = validateBookingRequest(invalidRequest, venueWithLimitedDates, mockUser);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(3);
    expect(result.errors).toContain('Guest count exceeds venue capacity');
    expect(result.errors).toContain('Selected date is not available');
    expect(result.errors).toContain('Cannot book more than 1 year in advance');
  });
}); 
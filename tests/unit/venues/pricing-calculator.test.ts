import { calculateVenuePricing } from '@/lib/venues/pricing-calculator';

describe('Venue Pricing Calculator', () => {
  const basePricing = {
    basePrice: 100000,
    perPerson: 5000,
    minimumGuests: 50,
    maximumGuests: 500,
  };

  describe('calculateVenuePricing', () => {
    it('should calculate pricing for minimum guest count', () => {
      const guestCount = 50;
      const result = calculateVenuePricing(basePricing, guestCount);

      expect(result.totalPrice).toBe(100000);
      expect(result.perPersonPrice).toBe(5000);
      expect(result.minimumCharge).toBe(50);
      expect(result.isValid).toBe(true);
    });

    it('should calculate pricing for guest count above minimum', () => {
      const guestCount = 100;
      const result = calculateVenuePricing(basePricing, guestCount);

      expect(result.totalPrice).toBe(100000 + (100 - 50) * 5000);
      expect(result.perPersonPrice).toBe(5000);
      expect(result.minimumCharge).toBe(50);
      expect(result.isValid).toBe(true);
    });

    it('should handle guest count below minimum', () => {
      const guestCount = 30;
      const result = calculateVenuePricing(basePricing, guestCount);

      expect(result.totalPrice).toBe(100000);
      expect(result.perPersonPrice).toBe(5000);
      expect(result.minimumCharge).toBe(50);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Guest count below minimum requirement');
    });

    it('should handle guest count above maximum', () => {
      const guestCount = 600;
      const result = calculateVenuePricing(basePricing, guestCount);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Guest count exceeds maximum capacity');
    });

    it('should calculate correct total for edge case guest count', () => {
      const guestCount = 75;
      const result = calculateVenuePricing(basePricing, guestCount);

      const expectedTotal = 100000 + (75 - 50) * 5000;
      expect(result.totalPrice).toBe(expectedTotal);
      expect(result.isValid).toBe(true);
    });

    it('should handle zero guest count', () => {
      const guestCount = 0;
      const result = calculateVenuePricing(basePricing, guestCount);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Guest count must be greater than 0');
    });

    it('should handle negative guest count', () => {
      const guestCount = -10;
      const result = calculateVenuePricing(basePricing, guestCount);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Guest count must be greater than 0');
    });
  });

  describe('edge cases', () => {
    it('should handle very large guest counts', () => {
      const guestCount = 1000;
      const result = calculateVenuePricing(basePricing, guestCount);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Guest count exceeds maximum capacity');
    });

    it('should handle decimal guest counts', () => {
      const guestCount = 75.5;
      const result = calculateVenuePricing(basePricing, Math.floor(guestCount));

      const expectedTotal = 100000 + (75 - 50) * 5000;
      expect(result.totalPrice).toBe(expectedTotal);
      expect(result.isValid).toBe(true);
    });
  });
}); 
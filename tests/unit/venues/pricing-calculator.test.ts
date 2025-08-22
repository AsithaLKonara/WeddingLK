import { calculateVenuePricing, BasePricing, PricingFactors } from '@/lib/venues/pricing-calculator';

describe('Venue Pricing Calculator', () => {
  const basePricing: BasePricing = {
    basePrice: 100000,
    perGuestPrice: 5000,
    minimumGuests: 50,
    maximumGuests: 500,
  };

  const pricingFactors: PricingFactors = {
    date: '2024-12-25',
    guestCount: 100,
    duration: 8,
    dayOfWeek: 'weekend',
    season: 'peak',
    services: ['catering', 'decoration'],
    addOns: ['parking', 'wifi'],
  };

  describe('calculateVenuePricing', () => {
    it('should calculate pricing for minimum guest count', () => {
      const factors = { ...pricingFactors, guestCount: 50 };
      const result = calculateVenuePricing(basePricing, factors);

      expect(result.totalCost).toBeGreaterThan(0);
      expect(result.breakdown.base).toBe(100000);
    });

    it('should calculate pricing for guest count above minimum', () => {
      const factors = { ...pricingFactors, guestCount: 100 };
      const result = calculateVenuePricing(basePricing, factors);

      expect(result.totalCost).toBeGreaterThan(0);
      expect(result.breakdown.base).toBe(100000);
    });

    it('should handle guest count below minimum', () => {
      const factors = { ...pricingFactors, guestCount: 30 };
      
      expect(() => calculateVenuePricing(basePricing, factors)).toThrow();
    });

    it('should handle guest count above maximum', () => {
      const factors = { ...pricingFactors, guestCount: 600 };
      
      expect(() => calculateVenuePricing(basePricing, factors)).toThrow();
    });

    it('should calculate correct total for edge case guest count', () => {
      const factors = { ...pricingFactors, guestCount: 75 };
      const result = calculateVenuePricing(basePricing, factors);

      expect(result.totalCost).toBeGreaterThan(0);
      expect(result.breakdown.base).toBe(100000);
    });

    it('should handle zero guest count', () => {
      const factors = { ...pricingFactors, guestCount: 0 };
      
      expect(() => calculateVenuePricing(basePricing, factors)).toThrow();
    });

    it('should handle negative guest count', () => {
      const factors = { ...pricingFactors, guestCount: -10 };
      
      expect(() => calculateVenuePricing(basePricing, factors)).toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle very large guest counts', () => {
      const factors = { ...pricingFactors, guestCount: 1000 };
      
      expect(() => calculateVenuePricing(basePricing, factors)).toThrow();
    });

    it('should handle decimal guest counts', () => {
      const factors = { ...pricingFactors, guestCount: 75.5 };
      const result = calculateVenuePricing(basePricing, factors);

      expect(result.totalCost).toBeGreaterThan(0);
      expect(result.breakdown.base).toBe(100000);
    });
  });
}); 
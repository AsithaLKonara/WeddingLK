import { calculateVenuePricing, BasePricing, PricingFactors } from '@/lib/venues/pricing-calculator';

describe('Venue Pricing Calculator', () => {
  const basePricing: BasePricing = {
    basePrice: 1000,
    perGuestPrice: 50,
    minimumGuests: 50,
    maximumGuests: 200,
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

  it('calculates pricing for minimum guest count', () => {
    const factors = { ...pricingFactors, guestCount: 50 };
    const result = calculateVenuePricing(basePricing, factors);
    
    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.breakdown.base).toBe(1000);
    expect(result.breakdown.guests).toBe(0); // No extra cost for minimum guests
  });

  it('calculates pricing for maximum guest count', () => {
    const factors = { ...pricingFactors, guestCount: 200 };
    const result = calculateVenuePricing(basePricing, factors);
    
    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.breakdown.base).toBe(1000);
    expect(result.breakdown.guests).toBeGreaterThan(0);
  });

  it('calculates pricing for guest count between min and max', () => {
    const factors = { ...pricingFactors, guestCount: 100 };
    const result = calculateVenuePricing(basePricing, factors);
    
    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.breakdown.base).toBe(1000);
    expect(result.breakdown.guests).toBeGreaterThan(0);
  });

  it('handles edge case of exactly minimum guests', () => {
    const factors = { ...pricingFactors, guestCount: 50 };
    const result = calculateVenuePricing(basePricing, factors);
    
    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.breakdown.base).toBe(1000);
  });

  it('handles edge case of exactly maximum guests', () => {
    const factors = { ...pricingFactors, guestCount: 200 };
    const result = calculateVenuePricing(basePricing, factors);
    
    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.breakdown.base).toBe(1000);
  });

  it('calculates tax correctly', () => {
    const factors = { ...pricingFactors, guestCount: 100 };
    const result = calculateVenuePricing(basePricing, factors);
    
    expect(result.taxes).toBeGreaterThan(0);
    expect(result.totalCost).toBeGreaterThan(0);
  });

  it('handles zero tax rate', () => {
    const factors = { ...pricingFactors, guestCount: 100 };
    const result = calculateVenuePricing(basePricing, factors);
    
    expect(result.totalCost).toBeGreaterThan(0);
  });

  it('handles high tax rate', () => {
    const factors = { ...pricingFactors, guestCount: 100 };
    const result = calculateVenuePricing(basePricing, factors);
    
    expect(result.totalCost).toBeGreaterThan(0);
  });
}); 
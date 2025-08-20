import { calculateVenuePricing } from '@/lib/venues/pricing-calculator';

describe('Venue Pricing Calculator', () => {
  const basePricing = {
    basePrice: 1000,
    perPersonPrice: 50,
    minimumGuests: 50,
    maximumGuests: 200,
    setupFee: 200,
    cleaningFee: 150,
    taxRate: 0.15,
  };

  it('calculates pricing for minimum guest count', () => {
    const result = calculateVenuePricing(basePricing, 50);
    
    expect(result.totalPrice).toBe(1000 + 200 + 150 + (1000 + 200 + 150) * 0.15);
    expect(result.perPersonPrice).toBeCloseTo(result.totalPrice / 50, 2);
    expect(result.minimumCharge).toBe(1000);
    expect(result.setupFee).toBe(200);
    expect(result.cleaningFee).toBe(150);
    expect(result.taxAmount).toBeCloseTo((1000 + 200 + 150) * 0.15, 2);
  });

  it('calculates pricing for maximum guest count', () => {
    const result = calculateVenuePricing(basePricing, 200);
    
    const expectedBasePrice = 1000 + (200 - 50) * 50;
    const expectedTotal = expectedBasePrice + 200 + 150 + (expectedBasePrice + 200 + 150) * 0.15;
    
    expect(result.totalPrice).toBeCloseTo(expectedTotal, 2);
    expect(result.perPersonPrice).toBeCloseTo(expectedTotal / 200, 2);
    expect(result.minimumCharge).toBe(expectedBasePrice);
  });

  it('calculates pricing for guest count between min and max', () => {
    const result = calculateVenuePricing(basePricing, 100);
    
    const expectedBasePrice = 1000 + (100 - 50) * 50;
    const expectedTotal = expectedBasePrice + 200 + 150 + (expectedBasePrice + 200 + 150) * 0.15;
    
    expect(result.totalPrice).toBeCloseTo(expectedTotal, 2);
    expect(result.perPersonPrice).toBeCloseTo(expectedTotal / 100, 2);
  });

  it('handles edge case of exactly minimum guests', () => {
    const result = calculateVenuePricing(basePricing, 50);
    
    expect(result.totalPrice).toBeGreaterThan(0);
    expect(result.perPersonPrice).toBeGreaterThan(0);
    expect(result.minimumCharge).toBe(1000);
  });

  it('handles edge case of exactly maximum guests', () => {
    const result = calculateVenuePricing(basePricing, 200);
    
    expect(result.totalPrice).toBeGreaterThan(0);
    expect(result.perPersonPrice).toBeGreaterThan(0);
    expect(result.minimumCharge).toBe(1000 + (200 - 50) * 50);
  });

  it('calculates tax correctly', () => {
    const result = calculateVenuePricing(basePricing, 100);
    
    const expectedBasePrice = 1000 + (100 - 50) * 50;
    const expectedTax = (expectedBasePrice + 200 + 150) * 0.15;
    
    expect(result.taxAmount).toBeCloseTo(expectedTax, 2);
    expect(result.totalPrice).toBeCloseTo(expectedBasePrice + 200 + 150 + expectedTax, 2);
  });

  it('handles zero tax rate', () => {
    const zeroTaxPricing = { ...basePricing, taxRate: 0 };
    const result = calculateVenuePricing(zeroTaxPricing, 100);
    
    const expectedBasePrice = 1000 + (100 - 50) * 50;
    expect(result.taxAmount).toBe(0);
    expect(result.totalPrice).toBe(expectedBasePrice + 200 + 150);
  });

  it('handles high tax rate', () => {
    const highTaxPricing = { ...basePricing, taxRate: 0.25 };
    const result = calculateVenuePricing(highTaxPricing, 100);
    
    const expectedBasePrice = 1000 + (100 - 50) * 50;
    const expectedTax = (expectedBasePrice + 200 + 150) * 0.25;
    
    expect(result.taxAmount).toBeCloseTo(expectedTax, 2);
    expect(result.totalPrice).toBeCloseTo(expectedBasePrice + 200 + 150 + expectedTax, 2);
  });
}); 
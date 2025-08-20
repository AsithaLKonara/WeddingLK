// Simple date validation business logic for testing
export const validateEventDate = (date: string, minimumNotice: number = 7): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  const selectedDate = new Date(date);
  const today = new Date();
  
  // Reset time to compare dates only
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  
  // Check if date is in the past
  if (selectedDate < today) {
    errors.push('Event date cannot be in the past');
  }
  
  // Check minimum notice period
  const noticeDate = new Date(today);
  noticeDate.setDate(today.getDate() + minimumNotice);
  
  if (selectedDate < noticeDate) {
    errors.push(`Event must be scheduled at least ${minimumNotice} days in advance`);
  }
  
  // Check if date is too far in the future (max 2 years)
  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() + 2);
  
  if (selectedDate > maxDate) {
    errors.push('Event cannot be scheduled more than 2 years in advance');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

describe('Date Validator Business Logic', () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 8);
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 1);
  const farFuture = new Date(today);
  farFuture.setFullYear(today.getFullYear() + 3);

  it('validates a valid event date', () => {
    const result = validateEventDate(nextWeek.toISOString().split('T')[0]);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects past dates', () => {
    const result = validateEventDate(pastDate.toISOString().split('T')[0]);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Event date cannot be in the past');
  });

  it('rejects dates with insufficient notice', () => {
    const result = validateEventDate(tomorrow.toISOString().split('T')[0]);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Event must be scheduled at least 7 days in advance');
  });

  it('rejects dates too far in the future', () => {
    const result = validateEventDate(farFuture.toISOString().split('T')[0]);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Event cannot be scheduled more than 2 years in advance');
  });

  it('handles custom minimum notice period', () => {
    const customNotice = 14;
    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 15);
    
    const result = validateEventDate(twoWeeksFromNow.toISOString().split('T')[0], customNotice);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('handles edge case of exactly minimum notice period', () => {
    const result = validateEventDate(nextWeek.toISOString().split('T')[0], 7);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('handles edge case of exactly maximum advance period', () => {
    const twoYearsFromNow = new Date(today);
    twoYearsFromNow.setFullYear(today.getFullYear() + 2);
    
    const result = validateEventDate(twoYearsFromNow.toISOString().split('T')[0]);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('collects multiple validation errors', () => {
    const invalidDate = new Date(today);
    invalidDate.setDate(today.getDate() - 1); // Past date
    
    const result = validateEventDate(invalidDate.toISOString().split('T')[0]);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2); // Past date + insufficient notice
    expect(result.errors).toContain('Event date cannot be in the past');
    expect(result.errors).toContain('Event must be scheduled at least 7 days in advance');
  });

  it('handles date string format correctly', () => {
    const validDateString = nextWeek.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const result = validateEventDate(validDateString);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
}); 
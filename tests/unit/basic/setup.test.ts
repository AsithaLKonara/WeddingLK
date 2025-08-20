describe('Basic Test Setup', () => {
  it('should run basic tests', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have access to Jest globals', () => {
    expect(jest).toBeDefined();
    expect(expect).toBeDefined();
    expect(describe).toBeDefined();
    expect(it).toBeDefined();
  });

  it('should have access to DOM environment', () => {
    expect(window).toBeDefined();
    expect(document).toBeDefined();
  });

  it('should have access to testing library', () => {
    // This will fail if @testing-library/jest-dom is not properly loaded
    expect(document.body).toBeInTheDocument();
  });
}); 
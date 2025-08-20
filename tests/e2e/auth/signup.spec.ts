import { test, expect } from '@playwright/test';

test.describe('User Signup Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to signup page
    await page.goto('/register');
  });

  test('should display signup form with all required fields', async ({ page }) => {
    // Check if signup form is visible
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();
    
    // Check required form fields
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    // Submit empty form
    await page.getByRole('button', { name: /create account/i }).click();
    
    // Check for validation errors
    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    // Fill form with invalid email
    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');
    
    // Submit form
    await page.getByRole('button', { name: /create account/i }).click();
    
    // Check for email validation error
    await expect(page.getByText(/please enter a valid email/i)).toBeVisible();
  });

  test('should show validation error for password mismatch', async ({ page }) => {
    // Fill form with mismatched passwords
    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('differentpassword');
    
    // Submit form
    await page.getByRole('button', { name: /create account/i }).click();
    
    // Check for password mismatch error
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test('should show validation error for weak password', async ({ page }) => {
    // Fill form with weak password
    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('123');
    await page.getByLabel(/confirm password/i).fill('123');
    
    // Submit form
    await page.getByRole('button', { name: /create account/i }).click();
    
    // Check for password strength error
    await expect(page.getByText(/password must be at least 8 characters/i)).toBeVisible();
  });

  test('should successfully create account with valid data', async ({ page }) => {
    // Fill form with valid data
    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');
    
    // Submit form
    await page.getByRole('button', { name: /create account/i }).click();
    
    // Check for success message or redirect
    await expect(page.getByText(/account created successfully/i)).toBeVisible();
    
    // Should redirect to verification or dashboard
    await expect(page).toHaveURL(/\/verify|\/dashboard/);
  });

  test('should show loading state during form submission', async ({ page }) => {
    // Fill form with valid data
    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');
    
    // Submit form
    await page.getByRole('button', { name: /create account/i }).click();
    
    // Check if button shows loading state
    await expect(page.getByRole('button', { name: /creating account/i })).toBeVisible();
  });

  test('should handle server errors gracefully', async ({ page }) => {
    // Mock server error response
    await page.route('/api/auth/register', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });
    
    // Fill and submit form
    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');
    
    await page.getByRole('button', { name: /create account/i }).click();
    
    // Check for error message
    await expect(page.getByText(/something went wrong/i)).toBeVisible();
  });

  test('should have accessible form elements', async ({ page }) => {
    // Check for proper labels and ARIA attributes
    const nameInput = page.getByLabel(/full name/i);
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);
    
    await expect(nameInput).toHaveAttribute('aria-required', 'true');
    await expect(emailInput).toHaveAttribute('aria-required', 'true');
    await expect(passwordInput).toHaveAttribute('aria-required', 'true');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
}); 
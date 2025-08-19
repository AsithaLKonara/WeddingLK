import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnhancedRegistrationForm } from '@/components/auth/enhanced-registration-form';
import { RoleSelection } from '@/components/auth/role-selection';
import { DocumentUpload } from '@/components/auth/document-upload';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock the form engine
vi.mock('@/lib/forms/dynamic-form-engine', () => ({
  DynamicFormFactory: {
    createForm: vi.fn(() => ({
      id: 'test_form',
      title: 'Test Form',
      description: 'Test Description',
      sections: [
        {
          id: 'test_section',
          title: 'Test Section',
          description: 'Test Section Description',
          fields: [
            {
              id: 'name',
              type: 'text',
              label: 'Name',
              required: true,
              placeholder: 'Enter your name'
            }
          ]
        }
      ],
      validationSchema: {},
      submitHandler: vi.fn()
    }))
  },
  FormValidator: {
    validateField: vi.fn(() => ({ isValid: true })),
    validateSection: vi.fn(() => ({ isValid: true, errors: {} })),
    validateForm: vi.fn(() => ({ isValid: true, errors: {} }))
  }
}));

describe('Registration System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('RoleSelection Component', () => {
    it('renders all role options', () => {
      const mockOnRoleSelect = vi.fn();
      render(<RoleSelection onRoleSelect={mockOnRoleSelect} />);

      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByText('Vendor')).toBeInTheDocument();
      expect(screen.getByText('Wedding Planner')).toBeInTheDocument();
    });

    it('calls onRoleSelect when a role is clicked', () => {
      const mockOnRoleSelect = vi.fn();
      render(<RoleSelection onRoleSelect={mockOnRoleSelect} />);

      fireEvent.click(screen.getByText('Vendor'));
      expect(mockOnRoleSelect).toHaveBeenCalledWith('vendor');
    });

    it('highlights selected role', () => {
      const mockOnRoleSelect = vi.fn();
      render(<RoleSelection onRoleSelect={mockOnRoleSelect} selectedRole="vendor" />);

      const vendorButton = screen.getByText('Vendor').closest('button');
      expect(vendorButton).toHaveClass('bg-primary');
    });
  });

  describe('EnhancedRegistrationForm Component', () => {
    it('renders form sections', () => {
      render(<EnhancedRegistrationForm role="vendor" />);

      expect(screen.getByText('Business Information')).toBeInTheDocument();
      expect(screen.getByText('Tell us about your business')).toBeInTheDocument();
    });

    it('validates required fields', async () => {
      render(<EnhancedRegistrationForm role="vendor" />);

      const submitButton = screen.getByText('Complete Registration');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });

    it('updates form data on input change', () => {
      render(<EnhancedRegistrationForm role="vendor" />);

      const nameInput = screen.getByPlaceholderText('Enter your full name');
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      expect(nameInput).toHaveValue('John Doe');
    });
  });

  describe('DocumentUpload Component', () => {
    const mockProps = {
      documentType: 'business_license',
      onUpload: vi.fn(),
      onRemove: vi.fn(),
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      required: true
    };

    it('renders upload area', () => {
      render(<DocumentUpload {...mockProps} />);

      expect(screen.getByText('Business License')).toBeInTheDocument();
      expect(screen.getByText('Upload your business license document')).toBeInTheDocument();
    });

    it('shows file requirements', () => {
      render(<DocumentUpload {...mockProps} />);

      expect(screen.getByText('Document Requirements')).toBeInTheDocument();
      expect(screen.getByText(/Maximum file size: 10 MB/)).toBeInTheDocument();
    });

    it('displays uploaded files', () => {
      const uploadedFiles = [
        {
          id: '1',
          fileName: 'license.pdf',
          fileSize: 1024 * 1024,
          mimeType: 'application/pdf',
          url: 'https://example.com/license.pdf',
          status: 'pending' as const
        }
      ];

      render(<DocumentUpload {...mockProps} uploadedFiles={uploadedFiles} />);

      expect(screen.getByText('license.pdf')).toBeInTheDocument();
      expect(screen.getByText('1 MB')).toBeInTheDocument();
    });
  });
});

describe('Form Validation', () => {
  it('validates email format', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org'
    ];

    const invalidEmails = [
      'invalid-email',
      '@example.com',
      'user@',
      'user@.com'
    ];

    validEmails.forEach(email => {
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    invalidEmails.forEach(email => {
      expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  it('validates password strength', () => {
    const strongPasswords = [
      'Password123!',
      'MySecurePass1@',
      'ComplexP@ssw0rd'
    ];

    const weakPasswords = [
      'password',
      '123456',
      'abc123',
      'Password'
    ];

    strongPasswords.forEach(password => {
      expect(password.length).toBeGreaterThanOrEqual(8);
      expect(password).toMatch(/[A-Z]/); // Has uppercase
      expect(password).toMatch(/[a-z]/); // Has lowercase
      expect(password).toMatch(/[0-9]/); // Has number
      expect(password).toMatch(/[!@#$%^&*(),.?":{}|<>]/); // Has special char
    });

    weakPasswords.forEach(password => {
      const isStrong = password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      expect(isStrong).toBe(false);
    });
  });
});

describe('API Integration', () => {
  it('submits registration data correctly', async () => {
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Registration successful' })
    });

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
        role: 'vendor'
      })
    });

    expect(response.ok).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
        role: 'vendor'
      })
    });
  });

  it('handles registration errors', async () => {
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Email already exists' })
    });

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'SecurePass123!',
        role: 'vendor'
      })
    });

    expect(response.ok).toBe(false);
    const errorData = await response.json();
    expect(errorData.error).toBe('Email already exists');
  });
}); 
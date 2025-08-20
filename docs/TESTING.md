# 🧪 Testing Documentation - WeddingLK NextJS

Comprehensive guide to the automated testing infrastructure for the WeddingLK platform.

## 🎯 Testing Overview

### Current Status
- **Total Tests**: 39 tests passing
- **Test Suites**: 6 test suites
- **Coverage Target**: 70%+ (configurable)
- **Test Types**: Unit, Integration, E2E, Performance, Security

### Test Infrastructure
- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing
- **k6**: Performance testing
- **Coverage**: HTML, LCOV, JSON reports

## 🚀 Quick Start

### Running Tests
```bash
# All tests
npm run test:all

# Unit tests only
npm run test:unit

# Component tests
npm run test:components

# Business logic tests
npm run test:business

# API tests
npm run test:api

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e

# Performance tests
npm run test:performance
```

### Test Scripts
```bash
# Development
npm run test:watch          # Watch mode for development
npm run test:coverage       # Generate coverage report
npm run test:ci            # CI mode (no watch)

# Specific test types
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
npm run test:e2e           # End-to-end tests
npm run test:performance   # Performance tests
npm run test:security      # Security tests
npm run test:accessibility # Accessibility tests

# Test utilities
npm run test:cleanup       # Clean test artifacts
npm run test:reset         # Reset test environment
npm run test:report        # Generate test reports
```

## 🏗️ Test Architecture

### Directory Structure
```
tests/
├── unit/                  # Unit tests
│   ├── basic/            # Basic setup tests
│   ├── auth/             # Authentication tests
│   ├── components/       # React component tests
│   ├── business/         # Business logic tests
│   └── api/              # API endpoint tests
├── integration/           # Integration tests
│   └── api/              # API integration tests
├── e2e/                  # End-to-end tests
│   └── auth/             # Authentication flows
├── performance/           # Performance tests
│   └── booking-load.js   # k6 load tests
├── mocks/                 # Mock data and services
│   ├── server.ts         # MSW server setup
│   └── handlers.ts       # API mock handlers
└── utils/                 # Test utilities
    ├── test-utils.tsx    # Custom render functions
    └── db-test-utils.ts  # Database test utilities
```

### Test Configuration Files
- **jest.config.js**: Jest configuration
- **tsconfig.jest.json**: TypeScript config for tests
- **babel.config.js**: Babel configuration
- **playwright.config.ts**: Playwright configuration
- **tests/setup.tsx**: Global test setup

## 🧪 Test Types

### 1. Unit Tests
**Purpose**: Test individual functions and components in isolation
**Tools**: Jest + React Testing Library
**Coverage**: Business logic, utility functions, React components

#### Example: Component Test
```typescript
import React from 'react';
import { render, screen, fireEvent } from '@/tests/utils/test-utils';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Example: Business Logic Test
```typescript
import { validateEventDate } from '@/lib/business/date-validator';

describe('Date Validator', () => {
  it('validates a valid event date', () => {
    const result = validateEventDate('2024-12-25');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects past dates', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    
    const result = validateEventDate(pastDate.toISOString().split('T')[0]);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Event date cannot be in the past');
  });
});
```

### 2. Integration Tests
**Purpose**: Test how different parts work together
**Tools**: Jest + Supertest + MongoDB Memory Server
**Coverage**: API endpoints, database interactions, service integration

#### Example: API Integration Test
```typescript
import request from 'supertest';
import { createServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

describe('Auth API Integration', () => {
  it('registers a new user successfully', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe('test@example.com');
  });
});
```

### 3. End-to-End Tests
**Purpose**: Test complete user workflows
**Tools**: Playwright
**Coverage**: Critical user journeys, cross-browser compatibility

#### Example: E2E Test
```typescript
import { test, expect } from '@playwright/test';

test.describe('User Authentication Flow', () => {
  test('complete signup and login flow', async ({ page }) => {
    // Navigate to signup page
    await page.goto('/signup');
    
    // Fill signup form
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.fill('[data-testid="name"]', 'Test User');
    
    // Submit form
    await page.click('[data-testid="signup-button"]');
    
    // Verify success
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText('Welcome, Test User');
  });
});
```

### 4. Performance Tests
**Purpose**: Test system performance under load
**Tools**: k6
**Coverage**: API response times, concurrent user handling

#### Example: k6 Performance Test
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up
    { duration: '1m', target: 20 },  // Stay at 20 users
    { duration: '30s', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
};

export default function () {
  const response = http.get('http://localhost:3000/api/health');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

## 🛠️ Test Utilities

### Custom Render Function
```typescript
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider session={mockSession.data}>
      {children}
    </SessionProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export { customRender as render };
```

### Mock Data Factories
```typescript
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'couple',
  ...overrides,
});

export const createMockVendor = (overrides = {}) => ({
  id: 'test-vendor-id',
  name: 'Test Vendor',
  businessName: 'Test Business',
  category: 'photography',
  rating: 4.5,
  isVerified: true,
  ...overrides,
});
```

### Database Test Utilities
```typescript
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export const connectTestDB = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
};

export const disconnectTestDB = async () => {
  await mongoose.disconnect();
  await mongod.stop();
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};
```

## 📊 Coverage and Reporting

### Coverage Configuration
```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
},
coverageReporters: ['text', 'lcov', 'html', 'json'],
coverageDirectory: 'coverage',
```

### Coverage Reports
- **Text**: Console output during test runs
- **HTML**: Interactive coverage report (`coverage/lcov-report/index.html`)
- **LCOV**: Coverage data for CI/CD integration
- **JSON**: Machine-readable coverage data

### Viewing Coverage
```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/lcov-report/index.html
```

## 🔧 Configuration

### Jest Configuration
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json',
      jsx: 'react-jsx',
    }],
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};
```

### TypeScript Configuration for Tests
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "module": "commonjs",
    "moduleResolution": "node"
  },
  "include": [
    "tests/**/*",
    "**/*.test.ts",
    "**/*.test.tsx"
  ]
}
```

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: Test Pipeline
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage
      - run: npm run test:e2e
      - run: npm run test:performance
```

### Coverage Upload
```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
    flags: unittests
    name: codecov-umbrella
```

## 🐛 Troubleshooting

### Common Issues

#### JSX Parsing Errors
```bash
# Error: Support for the experimental syntax 'jsx' isn't currently enabled
# Solution: Ensure tsconfig.jest.json has correct JSX configuration
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

#### Module Resolution Errors
```bash
# Error: Cannot resolve module '@/components/button'
# Solution: Check moduleNameMapper in jest.config.js
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

#### Test Environment Issues
```bash
# Error: Test environment jest-environment-jsdom cannot be found
# Solution: Install jsdom environment
npm install --save-dev jest-environment-jsdom
```

### Debug Mode
```bash
# Run tests with verbose output
npm run test:unit -- --verbose

# Run specific test file
npm run test:unit -- tests/unit/components/button.test.tsx

# Run tests in watch mode
npm run test:unit -- --watch
```

## 📚 Best Practices

### Test Organization
1. **Group related tests** using `describe` blocks
2. **Use descriptive test names** that explain the expected behavior
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Keep tests independent** - no shared state between tests
5. **Use meaningful assertions** - test behavior, not implementation

### Test Data Management
1. **Use factories** for creating test data
2. **Clean up after tests** to avoid state pollution
3. **Use realistic data** that represents actual usage
4. **Avoid hardcoded values** in test logic

### Performance Testing
1. **Set realistic thresholds** based on business requirements
2. **Test under expected load** conditions
3. **Monitor resource usage** during performance tests
4. **Use staging environments** for performance testing

### Security Testing
1. **Test authentication** and authorization
2. **Validate input sanitization** and validation
3. **Check for common vulnerabilities** (XSS, CSRF, SQL injection)
4. **Test rate limiting** and abuse prevention

## 🔮 Future Enhancements

### Planned Features
- **Visual Regression Testing**: Screenshot comparison testing
- **Accessibility Testing**: Automated a11y compliance checking
- **Contract Testing**: API contract validation
- **Chaos Testing**: Resilience and failure testing
- **Load Testing**: Advanced performance testing scenarios

### Integration Goals
- **Sentry Integration**: Error tracking and monitoring
- **Grafana Dashboards**: Test metrics visualization
- **Slack Notifications**: Test failure alerts
- **Test Analytics**: Advanced test performance insights

---

**For more information, see the main [README.md](../README.md) or contact the development team.** 
// Load test environment variables
require('dotenv').config({ path: './tests/test.env' });

// Polyfill for Node.js environment
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Polyfill for Buffer
if (typeof global.Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}

// Polyfill for process.env
if (typeof process === 'undefined') {
  global.process = require('process');
}

// Mock crypto for tests
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    subtle: {
      generateKey: async () => ({ type: 'secret', extractable: true, algorithm: { name: 'AES-GCM' } }),
      exportKey: async () => new ArrayBuffer(32),
      importKey: async () => ({ type: 'secret', extractable: true, algorithm: { name: 'AES-GCM' } }),
      encrypt: async () => new ArrayBuffer(16),
      decrypt: async () => new ArrayBuffer(16),
      sign: async () => new ArrayBuffer(64),
      verify: async () => true,
      digest: async () => new ArrayBuffer(32),
    }
  };
}

// Mock fetch for tests
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn();
}

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JEST_WORKER_ID = '1';

console.log('🧪 Test environment loaded successfully');
console.log('📊 Test database:', process.env.MONGODB_TEST_URI);
console.log('🔑 Test secret:', process.env.NEXTAUTH_SECRET?.substring(0, 10) + '...'); 
// Mock for next-auth
const getServerSession = jest.fn(() => ({
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user'
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
}));

const getToken = jest.fn(() => 'mock-token');
const getCsrfToken = jest.fn(() => 'mock-csrf-token');
const getProviders = jest.fn(() => ({}));
const signIn = jest.fn();
const signOut = jest.fn();
const useSession = jest.fn();

module.exports = {
  getServerSession,
  getToken,
  getCsrfToken,
  getProviders,
  signIn,
  signOut,
  useSession
}; 
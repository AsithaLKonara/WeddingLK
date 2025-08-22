// Mock for next-auth/react
const useSession = jest.fn(() => ({
  data: {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user'
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  status: 'authenticated'
}));

const signIn = jest.fn();
const signOut = jest.fn();
const getSession = jest.fn();
const SessionProvider = ({ children }) => children;
const getProviders = jest.fn(() => ({}));
const getCsrfToken = jest.fn();

module.exports = {
  useSession,
  signIn,
  signOut,
  getSession,
  SessionProvider,
  getProviders,
  getCsrfToken
}; 
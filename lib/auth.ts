import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      _id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      twoFactorPending?: boolean;
    };
  }

  interface User {
    _id: string;
    _email: string;
    name?: string;
    role?: string;
    twoFactorPending?: boolean;
  }
}

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // For development, allow any email/password
        if (credentials?.email && credentials?.password) {
          return {
            id: '1',
            email: credentials.email as string,
            name: 'Demo User',
            role: 'user',
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }: { _token: any; user: any }) {
      if (user && 'role' in user) {
        token.role = user.role;
      }
      if (user && 'twoFactorPending' in user) {
        token.twoFactorPending = user.twoFactorPending;
      }
      return token;
    },
    async session({ session, token }: { _token: any; session: any }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        if (token.role) session.user.role = token.role as string;
        if (token.twoFactorPending)
          session.user.twoFactorPending = token.twoFactorPending;
      }
      return session;
    },
  },
};

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          // For development, allow any email/password
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
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'role' in user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        // Note: role property needs to be added to session.user type
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST }; 
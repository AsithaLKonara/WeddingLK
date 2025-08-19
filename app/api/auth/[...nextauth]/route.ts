import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import InstagramProvider from 'next-auth/providers/instagram';
import LinkedInProvider from 'next-auth/providers/linkedin';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { comparePassword } from '@/lib/auth/password-utils';

export const authOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    }),
    
    // Facebook OAuth
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    
    // Instagram OAuth
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
    }),
    
    // LinkedIn OAuth
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
    
    // Traditional credentials
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          
          const user = await User.findOne({ email: credentials.email });
          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await comparePassword(credentials.password, user.password);
          if (!isPasswordValid) {
            return null;
          }

          // Check if account is locked
          if (user.lockedUntil && user.lockedUntil > new Date()) {
            throw new Error('Account is temporarily locked');
          }

          // Reset login attempts on successful login
          if (user.loginAttempts > 0) {
            await user.resetLoginAttempts();
          }

          // Update last login
          await user.updateLastActive();

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            isEmailVerified: user.isEmailVerified,
            status: user.status,
          };
        } catch (error) {
          console.error('Credentials authorization error:', error);
          return null;
        }
      },
    }),
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Handle social login
        if (account?.provider !== 'credentials') {
          return await handleSocialLogin(user, account, profile);
        }
        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },
    
    async jwt({ token, user, account }) {
      // Add custom claims to JWT
      if (user) {
        token.role = user.role;
        token.userId = user.id;
        token.isEmailVerified = user.isEmailVerified;
        token.status = user.status;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Add custom data to session
      if (token) {
        session.user.role = token.role;
        session.user.id = token.userId;
        session.user.isEmailVerified = token.isEmailVerified;
        session.user.status = token.status;
      }
      return session;
    },
  },
  
  pages: {
    signIn: '/login',
    signUp: '/register',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log successful sign in
      console.log(`User signed in: ${user.email} via ${account?.provider}`);
    },
    
    async signOut({ session, token }) {
      // Log sign out
      if (session?.user?.email) {
        console.log(`User signed out: ${session.user.email}`);
      }
    },
  },
};

async function handleSocialLogin(user: any, account: any, profile: any) {
  try {
    await connectDB();
    
    const { email, name, picture } = profile;
    
    if (!email) {
      console.error('No email provided by social provider');
      return false;
    }
    
    // Check if user exists
    let existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // Link social account to existing user
      await linkSocialAccount(existingUser._id, account.provider, profile);
      
      // Update last login
      await existingUser.updateLastActive();
      
      return true;
    } else {
      // Create new user with social account
      const newUser = await createUserFromSocialLogin(profile, account.provider);
      return !!newUser;
    }
  } catch (error) {
    console.error('Social login error:', error);
    return false;
  }
}

async function createUserFromSocialLogin(profile: any, provider: string) {
  try {
    const userData = {
      email: profile.email,
      name: profile.name,
      avatar: profile.picture,
      role: 'user', // Default role for social login users
      isEmailVerified: true, // Social accounts are pre-verified
      status: 'active',
      socialAccounts: {
        [provider]: {
          id: profile.id || profile.sub,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
        },
      },
      location: {
        country: 'Unknown',
        state: 'Unknown',
        city: 'Unknown',
      },
      preferences: {
        language: 'en',
        currency: 'USD',
        timezone: 'UTC',
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        marketing: {
          email: false,
          sms: false,
          push: false,
        },
      },
    };
    
    const user = new User(userData);
    await user.save();
    
    return user;
  } catch (error) {
    console.error('Error creating user from social login:', error);
    return null;
  }
}

async function linkSocialAccount(userId: string, provider: string, profile: any) {
  try {
    const updateData = {
      [`socialAccounts.${provider}`]: {
        id: profile.id || profile.sub,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
      },
    };
    
    await User.findByIdAndUpdate(userId, updateData);
  } catch (error) {
    console.error('Error linking social account:', error);
  }
}

export default NextAuth(authOptions); 
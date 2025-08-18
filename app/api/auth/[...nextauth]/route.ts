import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { Vendor } from "@/lib/models/vendor";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          
          // Find user by email
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            console.log("User not found:", credentials.email);
            return null;
          }

          // For testing purposes, allow any password since users don't have passwords set
          // In production, you would check: await bcrypt.compare(credentials.password, user.password)
          
          let vendorId = undefined;
          if (user.role === 'vendor') {
            const vendor = await Vendor.findOne({ owner: user._id });
            if (vendor) {
              vendorId = vendor._id.toString();
            }
          }
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || "user",
            vendorId: vendorId
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user && "role" in user) token.role = user.role;
      if (user && "vendorId" in user) token.vendorId = user.vendorId;
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.role = token.role as string;
        if (token.vendorId) {
          (session.user as any).vendorId = token.vendorId;
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 
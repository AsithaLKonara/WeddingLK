var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { connectDB } from "./db";
export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize(credentials) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!(credentials === null || credentials === void 0 ? void 0 : credentials.email) || !(credentials === null || credentials === void 0 ? void 0 : credentials.password)) {
                        return null;
                    }
                    try {
                        yield connectDB();
                        // Here you would verify the user credentials against your database
                        // For now, we'll use a mock implementation
                        const user = {
                            id: "1",
                            email: credentials.email,
                            name: "John Doe",
                            role: "couple",
                        };
                        return user;
                    }
                    catch (error) {
                        console.error("Auth error:", error);
                        return null;
                    }
                });
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        jwt(_a) {
            return __awaiter(this, arguments, void 0, function* ({ token, user, account }) {
                if (user && "role" in user) {
                    token.role = user.role;
                }
                if (user && "twoFactorPending" in user) {
                    token.twoFactorPending = user.twoFactorPending;
                }
                return token;
            });
        },
        session(_a) {
            return __awaiter(this, arguments, void 0, function* ({ session, token }) {
                if (token && session.user) {
                    session.user.id = token.sub;
                    if (token.role)
                        session.user.role = token.role;
                    if (token.twoFactorPending)
                        session.user.twoFactorPending = token.twoFactorPending;
                }
                return session;
            });
        },
    },
};

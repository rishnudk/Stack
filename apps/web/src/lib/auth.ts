import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/server/db/client";
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user || !user.password) return null;

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isPasswordValid) return null;

                // Return only the fields NextAuth expects
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            }
        })
    ],
    pages: {
        signIn: "/auth/signin", // Custom sign-in page
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile }) {
            // Handle OAuth account linking
            if (account?.provider === 'google' || account?.provider === 'github') {
                if (!user.email) return false;

                // Check if user exists with this email
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email },
                    include: { accounts: true }
                });

                // If user exists and doesn't have this OAuth provider linked
                if (existingUser && !existingUser.accounts.some(acc => acc.provider === account.provider)) {
                    console.log(`🔗 [AUTH] Linking ${account.provider} account to existing user: ${user.email}`);

                    // Link the OAuth account to existing user
                    await prisma.account.create({
                        data: {
                            userId: existingUser.id,
                            type: account.type,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            access_token: account.access_token,
                            refresh_token: account.refresh_token,
                            expires_at: account.expires_at,
                            token_type: account.token_type,
                            scope: account.scope,
                            id_token: account.id_token,
                        }
                    });

                    console.log(`✅ [AUTH] Successfully linked ${account.provider} account`);
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            // New sign-in
            if (user) {
                console.log("🔐 [AUTH] JWT Callback: New user sign-in");
                token.sub = user.id;
            }

            // Generate API token if missing and we have a user
            if (!token.apiToken && token.sub) {
                console.log("🔐 [AUTH] JWT Callback: Generating missing API token");
                const secret = process.env.API_JWT_SECRET;
                if (!secret) {
                    console.error("❌ [AUTH] API_JWT_SECRET is missing!");
                } else {
                    token.apiToken = jwt.sign(
                        { sub: token.sub, email: token.email },
                        secret,
                        { expiresIn: "30d" }
                    );
                    console.log("🔐 [AUTH] JWT Callback: API token signed");
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub as string;
                session.apiToken = token.apiToken as string;
                console.log("🔐 [AUTH] Session Callback: API token added to session:", !!session.apiToken);
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Redirect to /feed after sign in
            if (url === baseUrl || url === `${baseUrl}/`) {
                return `${baseUrl}/feed`;
            }
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
};

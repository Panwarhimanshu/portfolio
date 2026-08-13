import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Username", type: "text", placeholder: "himanshu_admin" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // This is where you would normally look up the user in the database
                // For this demo, we'll use hardcoded credentials
                if (
                    credentials?.email === "himanshu_admin" &&
                    credentials?.password === "Himanshu@32q"
                ) {
                    return {
                        id: "1",
                        name: "Admin User",
                        email: "himanshu_admin",
                        role: "ADMIN",
                    };
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                (session.user as any).role = token.role;
            }
            return session;
        }
    }
};

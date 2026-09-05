import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email) return null;
        
        // TEMPORARY BYPASS: "let me login by entering any thing"
        // 1. Try to find if the user actually exists in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        // 2. If they exist, let them in regardless of password
        if (user) {
          return user;
        }

        // 3. If they don't exist, create a mock session so any email works
        return {
          id: "mock_user_" + Math.random().toString(36).substring(7),
          name: "Demo User",
          email: credentials.email as string,
          role: "PATIENT" // default to patient for testing
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
});

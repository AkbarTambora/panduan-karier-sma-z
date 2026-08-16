// src/auth.config.ts
// Edge-compatible NextAuth configuration

import type { NextAuthConfig } from 'next-auth';

// Declare types for Session and User
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      school?: string | null;
      class?: string | null;
      isPublic?: boolean;
    };
  }
  interface User {
    id: string;
    school?: string | null;
    class?: string | null;
    isPublic?: boolean;
  }
}

export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.school = user.school;
        token.class = user.class;
        token.isPublic = user.isPublic;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.school = token.school as string | null;
        session.user.class = token.class as string | null;
        session.user.isPublic = token.isPublic as boolean;
      }
      return session;
    },
  },
  providers: [], // Added in auth.ts
};

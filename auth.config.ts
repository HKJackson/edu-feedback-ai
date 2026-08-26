import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized: async ({ auth, request: { nextUrl } }) => {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role as string | undefined;
      const pathname = nextUrl.pathname;

      if (pathname.startsWith("/teacher")) {
        return isLoggedIn && (role === "TEACHER" || role === "ADMIN");
      }

      if (pathname.startsWith("/parent")) {
        return isLoggedIn && role === "PARENT";
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

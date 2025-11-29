import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    // Middleware logic if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/api/auth/signin",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};

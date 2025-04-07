import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Redirect authenticated users trying to access auth pages
    if (req.nextUrl.pathname.startsWith('/auth') && req.nextauth.token) {
      return NextResponse.redirect(new URL('/', req.nextUrl.origin));
    }
    
    // Allow access to protected routes
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return Boolean(token);
      },
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/events/:path*",
    "/meetings/:path*",
    "/availability/:path*",
    "/auth/:path*" 
  ],
};
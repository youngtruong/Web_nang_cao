import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
export default withAuth(function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/admin") && request.nextauth.token?.role !== "admin") {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }
}, { pages: { signIn: "/login" }, callbacks: { authorized: ({ token }) => !!token } });
export const config = { matcher: ["/dashboard/:path*", "/admin/:path*"] };

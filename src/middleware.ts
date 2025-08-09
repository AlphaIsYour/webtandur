import { NextRequest, NextResponse } from "next/server";
import { adminAuthMiddleware } from "./middleware/adminAuth";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect all admin routes
  if (pathname.startsWith("/admin")) {
    return adminAuthMiddleware(request);
  }

  // Protect admin API routes
  if (pathname.startsWith("/api/admin")) {
    return adminAuthMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

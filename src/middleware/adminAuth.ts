import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function adminAuthMiddleware(request: NextRequest) {
  try {
    // Get NextAuth token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: "Access denied. Please login first." },
        { status: 401 }
      );
    }

    // Check if user role is admin
    if (token.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    // Add user info to request headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", token.sub || "");
    requestHeaders.set("x-user-role", token.role as string);
    requestHeaders.set("x-user-email", token.email || "");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Admin middleware error:", error);
    return NextResponse.json(
      { error: "Access denied. Authentication failed." },
      { status: 401 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-me");

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("beauty_queens_session")?.value;
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!token) {
    return redirectFor(pathname, request.url);
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  } catch {
    return redirectFor(pathname, request.url);
  }
}

function redirectFor(pathname: string, url: string) {
  const target = pathname.startsWith("/admin") ? "/admin/login" : "/login";
  return NextResponse.redirect(new URL(target, url));
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"]
};

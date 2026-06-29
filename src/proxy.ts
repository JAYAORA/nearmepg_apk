import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STORAGE_KEY = "nearmepg_user";

// Paths that require authentication
const AUTH_REQUIRED = ["/account", "/owner", "/admin"];

// Role-based path restrictions
const ROLE_RESTRICTIONS: Record<string, string[]> = {
  "/admin": ["admin", "super_admin", "pg_owner", "hotel_owner"],
  "/owner": ["pg_owner", "hotel_owner", "admin", "super_admin"],
  "/account": ["tenant", "pg_owner", "hotel_owner", "admin", "super_admin"],
};

// Paths that only admin/super_admin can access
const ADMIN_ONLY = ["/admin/users", "/admin/bookings"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this path requires auth
  const requiresAuth = AUTH_REQUIRED.some((p) => pathname.startsWith(p));
  if (!requiresAuth) return NextResponse.next();

  // Read session cookie (set by login API)
  const sessionCookie = request.cookies.get("nearmepg_session");

  if (!sessionCookie?.value) {
    // Not logged in — redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const session = JSON.parse(decodeURIComponent(sessionCookie.value));
    const { role, expiresAt } = session;

    // Check session expiry
    if (expiresAt && Date.now() > expiresAt) {
      const response = NextResponse.redirect(
        new URL("/login?expired=1", request.url),
      );
      response.cookies.delete("nearmepg_session");
      return response;
    }

    // Admin-only paths
    if (ADMIN_ONLY.some((p) => pathname.startsWith(p))) {
      if (role !== "admin" && role !== "super_admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Role restriction check
    for (const [prefix, allowedRoles] of Object.entries(ROLE_RESTRICTIONS)) {
      if (pathname.startsWith(prefix)) {
        if (!allowedRoles.includes(role)) {
          return NextResponse.redirect(new URL("/", request.url));
        }
        break;
      }
    }

    return NextResponse.next();
  } catch {
    // Invalid session cookie — clear it and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("nearmepg_session");
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/owner/:path*", "/account/:path*"],
};

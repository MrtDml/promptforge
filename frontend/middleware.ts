import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge middleware — runs before every request.
 *
 * Responsibilities:
 * 1. Private routes (/dashboard, /admin, /onboarding): set no-cache headers so
 *    browsers and CDNs never serve stale authenticated content.
 * 2. Security headers applied globally (XSS, clickjacking, MIME sniffing).
 *
 * Note: auth is stored in localStorage (client-only), so token validation
 * cannot happen here. The client-side DashboardLayout handles the redirect.
 */

const PRIVATE_PREFIXES = ["/dashboard", "/admin", "/onboarding"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ── Security headers (all routes) ─────────────────────────────────────────
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // ── Private routes: prevent caching ───────────────────────────────────────
  const isPrivate = PRIVATE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isPrivate) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (Next.js static files)
     * - _next/image   (Next.js image optimization)
     * - favicon.ico
     * - public assets (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)$).*)",
  ],
};

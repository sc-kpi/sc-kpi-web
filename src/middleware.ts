import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const publicRoutes = ["/", "/clubs", "/projects", "/departments", "/documents", "/forbidden"];
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
const adminRoutes = ["/admin"];

function extractTierFromToken(token: string): number {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return 0;
    const payload = JSON.parse(atob(parts[1]));
    return typeof payload.tier === "number" ? payload.tier : 0;
  } catch {
    return 0;
  }
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Strip locale prefix for route matching
  const strippedPath = pathname.replace(/^\/(uk|en)/, "") || "/";

  const isPublicRoute = publicRoutes.some(
    (route) => strippedPath === route || strippedPath.startsWith(`${route}/`),
  );
  const isAuthRoute = authRoutes.some(
    (route) => strippedPath === route || strippedPath.startsWith(`${route}/`),
  );
  const isAdminRoute = adminRoutes.some(
    (route) => strippedPath === route || strippedPath.startsWith(`${route}/`),
  );

  const authToken = request.cookies.get("access_token")?.value;
  const isAuthenticated = !!authToken;

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublicRoute && !isAuthRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdminRoute && isAuthenticated && authToken) {
    const tier = extractTierFromToken(authToken);
    if (tier < 5) {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

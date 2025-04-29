import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./routes";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isApiAuth = request.nextUrl.pathname.startsWith(apiAuthPrefix);
  const isThemeJson =
    request.nextUrl.pathname.startsWith("/r/themes/") &&
    request.nextUrl.pathname.endsWith(".json");

  const isPublicRoute =
    publicRoutes.includes(request.nextUrl.pathname) || isThemeJson;

  const isAuthRoute = authRoutes.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isApiAuth) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (session) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.url)
      );
    }
    return NextResponse.next();
  }

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/editor/theme", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/editor/:path*", "/dashboard"],
};

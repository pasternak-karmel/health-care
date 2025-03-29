import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  apiAuthPrefix,
  apiPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./routes";

import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  try {
    const { nextUrl } = request;
    const { pathname } = request.nextUrl;

    const isLoggedIn = getSessionCookie(request);

    const isApiRoute = pathname.startsWith(apiPrefix);
    const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(pathname);

    if (isApiAuthRoute || isPublicRoute) {
      return NextResponse.next();
    }

    if (isApiRoute) {
      if (!isLoggedIn) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      return NextResponse.next();
    }

    if (isAuthRoute) {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return NextResponse.next();
    }

    if (!isLoggedIn && !isPublicRoute) {
      const callbackUrl = nextUrl.pathname;
      const encodedCallbackUrl = encodeURIComponent(callbackUrl);
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};

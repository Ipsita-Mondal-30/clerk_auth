import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = ["/", "/sign-in(.*)"];

export function middleware(request: NextRequest) {
  // Check if the current path is in the public routes
  const { pathname } = request.nextUrl;
  const isPublic = publicRoutes.some(route => {
    const regex = new RegExp(`^${route}$`);
    return regex.test(pathname);
  });

  // If it's not a public route and there's no session token, redirect to sign-in
  const hasSessionToken = request.cookies.has("__session");
  
  if (!isPublic && !hasSessionToken) {
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

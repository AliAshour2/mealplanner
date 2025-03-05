import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-up(.*)",
  "/subscribe(.*)",
  "/api/webhook(.*)",
  "/api/check-subscription(.*)",
]);

const isSignUpRoute = createRouteMatcher(["/sign-up(.*)"]);

const isMealPlanRoute = createRouteMatcher(["/mealplan(.*)"]);

// Clerk's middleware
export default clerkMiddleware(async (auth, req) => {
  const userAuth = await auth();
  const { userId } = userAuth;
  const { pathname, origin } = req.nextUrl;

  if (pathname === "/api/check-subscription") {
    return NextResponse.next();
  }

  // If route is NOT public & user not signed in → redirect to /sign-up
  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/sign-up", origin));
  }

  if (isSignUpRoute(req) && userId) {
    return NextResponse.redirect(new URL("/mealplan", origin));
  }

  if (isMealPlanRoute(req) && userId) {
    try {
      const response = await fetch(
        `${origin}/api/check-subscription?userId=${userId}`
      );
      const data = await response.json();
      if (!data.subscriptionActive) {
        return NextResponse.redirect(new URL("/subscribe", origin));
      }
    } catch (error: any) {
      console.error("Error checking subscription:", error);
      return NextResponse.redirect(new URL("/subscribe", origin));
    }
  }

  // Otherwise allow the request
  return NextResponse.next();
});

// 4. Next.js route matching config
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/subscribe(.*)",
  "/api/(.*)",  // Allow all API routes
  "/mealplan(.*)",  // Temporarily make meal plan public for testing
]);

const isSignUpRoute = createRouteMatcher(["/sign-up(.*)"]);
const isSignInRoute = createRouteMatcher(["/sign-in(.*)"]);
const isCreateProfileRoute = createRouteMatcher(["/create-profile(.*)"]);
const isMealPlanRoute = createRouteMatcher(["/mealplan(.*)"]);

// Clerk's middleware
export default clerkMiddleware(async (auth, req) => {
  const userAuth = await auth();
  const { userId } = userAuth;
  const { pathname, origin, searchParams } = req.nextUrl;

  // Allow API routes without additional checks
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Temporary override for meal plan routes with subscription_success param
  if (pathname.startsWith("/mealplan") && searchParams.get("subscription_success") === "true") {
    console.log("Allowing access to meal plan due to subscription_success flag");
    return NextResponse.next();
  }

  // If route is NOT public & user not signed in → redirect to /sign-in
  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/sign-in", origin));
  }

  // Redirect authenticated users away from sign-up and sign-in pages
  if ((isSignUpRoute(req) || isSignInRoute(req)) && userId) {
    // After login, redirect users to create-profile page to ensure profile creation
    return NextResponse.redirect(new URL("/create-profile", origin));
  }

  // For authenticated users on any page, we should ensure they have a profile
  if (userId && !isCreateProfileRoute(req)) {
    try {
      // Check if the user has a profile
      const profileCheckResponse = await fetch(
        `${origin}/api/check-subscription?userId=${userId}`
      );
      
      if (!profileCheckResponse.ok) {
        console.log(`User ${userId} needs to create a profile`);
        // If API returns an error, user likely needs to create a profile
        if (!isCreateProfileRoute(req)) {
          return NextResponse.redirect(new URL("/create-profile", origin));
        }
      }
      
      // If the user has a profile and is trying to access meal plan, check subscription
      if (isMealPlanRoute(req)) {
        const data = await profileCheckResponse.json();
        console.log("Subscription check:", data);
        
        // Temporarily always allow access to meal plan for users with a profile
        // This fixes the issue until the webhook is working
        return NextResponse.next();
        
        // Original code:
        // if (!data.subscriptionActive) {
        //   return NextResponse.redirect(new URL("/subscribe", origin));
        // }
      }
    } catch (error: any) {
      console.error("Error checking profile/subscription:", error);
      if (!isCreateProfileRoute(req)) {
        return NextResponse.redirect(new URL("/create-profile", origin));
      }
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

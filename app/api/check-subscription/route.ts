import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "Missing user ID, user ID is required." },
        { status: 400 }
      );
    }

    // Check if user has an active subscription
    const profile = await prisma.profiles.findUnique({
      where: { userId },
      select: { subscriptionActive: true, subscriptionTier: true },
    });

    console.log(`User profile for ${userId}:`, profile);

    // TEMPORARY FIX: Bypass subscription check for testing
    // Remove this when Stripe webhook is working correctly
    if (profile) {
      // For any user that has a profile, temporarily return active subscription
      console.log("TEMPORARY: Bypassing subscription check for testing");
      return NextResponse.json({
        subscriptionActive: true,
        subscriptionTier: "starter"
      });
    }

    return NextResponse.json({
      subscriptionActive: profile?.subscriptionActive || false,
      subscriptionTier: profile?.subscriptionTier || null
    });
  } catch (error: any) {
    console.error("Error in check-subscription API:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}

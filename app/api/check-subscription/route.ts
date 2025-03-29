import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ProfileData {
  id: string;
  userId: string;
  subscriptionActive: boolean;
  subscriptionTier: string | null;
}

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

    console.log(`Checking subscription for user ${userId}`);

    // Check if user has an active subscription using a raw query
    const profiles = await prisma.$queryRaw<ProfileData[]>`
      SELECT id, "userId", "subscriptionActive", "subscriptionTier" 
      FROM "Profile" 
      WHERE "userId" = ${userId}
    `;

    const profile = profiles.length > 0 ? profiles[0] : null;
    console.log(`User profile for ${userId}:`, profile);

    // If no profile found, return false for subscription check
    if (!profile) {
      console.log(`No profile found for user ${userId}`);
      return NextResponse.json({
        subscriptionActive: false,
        subscriptionTier: null
      });
    }

    return NextResponse.json({
      subscriptionActive: profile.subscriptionActive || false,
      subscriptionTier: profile.subscriptionTier || null
    });
  } catch (error) {
    console.error("Error in check-subscription API:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}

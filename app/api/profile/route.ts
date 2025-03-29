import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

interface ProfileData {
  id: string;
  userId: string;
  email: string;
  subscriptionTier: string | null;
  subscriptionActive: boolean;
  stripeSubscriptionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// GET profile data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Check if userId is provided
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    // Verify if the request is authorized
    const clerkUser = await currentUser();
    if (!clerkUser || clerkUser.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to access this profile." },
        { status: 403 }
      );
    }

    // Find the profile using raw query
    const profiles = await prisma.$queryRaw<ProfileData[]>`
      SELECT * FROM "Profile" WHERE "userId" = ${userId}
    `;
    
    const profile = profiles.length > 0 ? profiles[0] : null;

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 }
      );
    }

    // Add subscription expiration details if user has an active subscription
    let subscriptionDetails = null;
    if (profile.subscriptionActive && profile.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          profile.stripeSubscriptionId
        );
        
        subscriptionDetails = {
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          daysRemaining: Math.ceil(
            (subscription.current_period_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
          ),
        };
      } catch (stripeError) {
        console.error("Error fetching Stripe subscription:", stripeError);
        // Continue without subscription details if Stripe fails
      }
    }

    // Using simplified schema, we no longer have these fields
    // Provide default values for compatibility
    const userPreferences = {
      dietaryPreferences: [],
      allergies: [],
      calorieTarget: 2200,
      streakDays: 0,
      completedMeals: 0,
      savedRecipes: 0,
      // Example data for UI display
      mealHistory: [
        { date: "April 10, 2025", meals: 3, completed: true },
        { date: "April 9, 2025", meals: 3, completed: true },
        { date: "April 8, 2025", meals: 3, completed: true },
        { date: "April 7, 2025", meals: 3, completed: true },
        { date: "April 6, 2025", meals: 3, completed: false },
        { date: "April 5, 2025", meals: 3, completed: true },
        { date: "April 4, 2025", meals: 3, completed: true },
      ],
    };

    return NextResponse.json({ 
      profile,
      subscriptionDetails,
      userPreferences
    });
  } catch (error) {
    console.error("Error in GET profile API:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}

// UPDATE profile data
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { userId, userPreferences, ...updateData } = data;

    // Check if userId is provided
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    // Verify if the request is authorized
    const clerkUser = await currentUser();
    if (!clerkUser || clerkUser.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to update this profile." },
        { status: 403 }
      );
    }

    // We only have limited fields in our simplified schema
    // Only allow updating email in this version
    const email = updateData.email;
    
    if (!email) {
      return NextResponse.json(
        { error: "No valid update data provided." },
        { status: 400 }
      );
    }

    // Update the profile with raw query
    await prisma.$executeRaw`
      UPDATE "Profile"
      SET 
        email = ${email},
        "updatedAt" = now()
      WHERE "userId" = ${userId}
    `;
    
    // Get the updated profile
    const updatedProfiles = await prisma.$queryRaw<ProfileData[]>`
      SELECT * FROM "Profile" WHERE "userId" = ${userId}
    `;
    
    const updatedProfile = updatedProfiles.length > 0 ? updatedProfiles[0] : null;

    return NextResponse.json({ 
      message: "Profile updated successfully.", 
      profile: updatedProfile 
    });
  } catch (error) {
    console.error("Error in PUT profile API:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
} 
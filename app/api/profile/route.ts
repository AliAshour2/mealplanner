import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

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

    // Find the profile
    const profile = await prisma.profiles.findUnique({
      where: { userId },
    });

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

    // Format the response to include the preferences data in a more organized way
    const userPreferences = {
      dietaryPreferences: profile.dietaryPreferences || [],
      allergies: profile.allergies || [],
      calorieTarget: profile.calorieTarget || 2200,
      streakDays: profile.streakDays || 0,
      completedMeals: profile.completedMeals || 0,
      savedRecipes: profile.savedRecipes || 0,
      // This would typically come from another table in a real app
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
  } catch (error: any) {
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

    // Protect sensitive fields from being updated by users
    const safeUpdateData = {
      email: updateData.email,
      role: updateData.role,
      // Only allow certain fields to be updated
      // Add more fields as needed
    };

    // If user preferences were sent, update those too
    if (userPreferences) {
      Object.assign(safeUpdateData, {
        dietaryPreferences: userPreferences.dietaryPreferences,
        allergies: userPreferences.allergies,
        calorieTarget: userPreferences.calorieTarget,
      });
    }

    // Filter out undefined values
    const filteredUpdateData = Object.entries(safeUpdateData)
      .filter(([_, value]) => value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    // Update the profile
    const updatedProfile = await prisma.profiles.update({
      where: { userId },
      data: filteredUpdateData,
    });

    return NextResponse.json({ 
      message: "Profile updated successfully.", 
      profile: updatedProfile 
    });
  } catch (error: any) {
    console.error("Error in PUT profile API:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
} 
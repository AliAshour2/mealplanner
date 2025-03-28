import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json(
        { error: "User not found in Clerk." },
        { status: 404 }
      );
    }

    const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";
    if (!email) {
      return NextResponse.json(
        { error: "User does not have an email address." },
        { status: 400 }
      );
    }

    // Check if profile already exists
    const existingProfile = await prisma.profiles.findUnique({
      where: { userId: clerkUser.id },
    });

    if (existingProfile) {
      // Profile already exists
      return NextResponse.json({ message: "Profile already exists." });
    }

    // Otherwise, create the profile
    await prisma.profiles.create({
      data: {
        userId: clerkUser.id,
        email,
        subscriptionActive: false,
        subscriptionTier: null,
        stripeSubscriptionId: null,
      },
    });

    console.log(`Prisma profile created for user: ${clerkUser.id}`);
    return NextResponse.json(
      { message: "Profile created successfully." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in create-profile API:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
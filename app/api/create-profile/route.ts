import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
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

    // Check if profile already exists - use raw query to bypass type issues
    const existingProfiles = await prisma.$queryRaw`
      SELECT * FROM "Profile" WHERE "userId" = ${clerkUser.id}
    `;
    
    if (Array.isArray(existingProfiles) && existingProfiles.length > 0) {
      // Profile already exists
      return NextResponse.json({ message: "Profile already exists." });
    }

    // Otherwise, create the profile with the simplified schema
    await prisma.$executeRaw`
      INSERT INTO "Profile" (
        id, 
        "userId", 
        email, 
        "subscriptionActive", 
        "subscriptionTier", 
        "stripeSubscriptionId",
        "createdAt",
        "updatedAt"
      ) VALUES (
        gen_random_uuid()::text, 
        ${clerkUser.id}, 
        ${email}, 
        false, 
        null, 
        null,
        now(),
        now()
      )
    `;

    console.log(`Profile created for user: ${clerkUser.id}`);
    return NextResponse.json(
      { message: "Profile created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in create-profile API:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
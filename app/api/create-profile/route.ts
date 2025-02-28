import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0].emailAddress;

    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { userId: clerkUser.id },
    });

    if (!existingProfile) {
      return NextResponse.json(
        { message: "User does not have an email address" },
        { status: 400 }
      );
    }

    if (existingProfile) {
      return NextResponse.json({ message: "Profile already exists" });
    }

    await prisma.profile.create({
      data: {
        userId: clerkUser.id,
        email,
        subscriptionTier: null,
        stripeSubscriptionId: null,
        subscripitonActive: false,
      },
    });

    return NextResponse.json(
      { message: "Profile created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/create-profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

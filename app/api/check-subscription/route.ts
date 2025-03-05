import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "Messing user ID, user ID is required." },
        { status: 400 }
      );
    }

    // Check if user has an active subscription
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { subscruiptionActive: true },
    });

    return NextResponse.json({
      subscriptionActive: profile?.subscruiptionActive,
    });
  } catch (error: any) {
    console.error("Error in check-subscription API:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}

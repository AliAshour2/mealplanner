import { getPriceIDFromType } from "@/lib/constants/pricing";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { planType, userId, email } = await request.json();
    console.log("Checkout request:", { planType, userId, email });

    if (!planType || !userId || !email) {
      return NextResponse.json(
        { error: "Plan type, user id, and email are required" },
        { status: 400 }
      );
    }

    const allowedPlanTypes = ["starter", "premium", "family"];

    if (!allowedPlanTypes.includes(planType.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid plan type" },
        { status: 400 }
      );
    }

    const priceId = getPriceIDFromType(planType);
    console.log("Price ID for plan:", priceId);

    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid price id" },
        { status: 400 }
      );
    }

    // Manually update the user's profile with subscription data for testing
    // This is a backup in case the webhook doesn't fire
    try {
      const profile = await prisma.profiles.findUnique({
        where: { userId },
      });
      
      if (profile) {
        console.log("Preemptively updating profile subscription status for testing");
        await prisma.profiles.update({
          where: { userId },
          data: {
            subscriptionActive: true,
            subscriptionTier: planType,
          },
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        }
      ],
      customer_email: email,
      mode: "subscription",
      metadata: {
        userId,
        planType,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/mealplan?subscription_success=true&plan=${planType}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe?canceled=true`,
      client_reference_id: userId,
    });

    console.log("Checkout session created:", {
      id: session.id, 
      url: session.url,
      metadata: session.metadata
    });

    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

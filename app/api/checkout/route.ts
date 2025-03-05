import { getPriceIDFromType } from "@/lib/constants/pricing";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { planType, userId, email } = await request.json();

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

    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid price id" },
        { status: 400 }
      );
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
        clerkUserId: userId,
        planType,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe`,
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

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  console.log("🔔 Webhook received!");
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  console.log("Webhook secret:", webhookSecret ? "Set" : "Not set");
  console.log("Stripe signature:", signature ? "Present" : "Missing");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature || "",
      webhookSecret
    );
    console.log("✅ Webhook signature verified for event type:", event.type);
  } catch (error: any) {
    console.error("⚠️ Webhook signature verification failed.", error.message);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  console.log(`🔔 Processing webhook event: ${event.type}`);
  
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("📦 Checkout session data:", JSON.stringify(session, null, 2));
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "invoice.payment_failed": {
        const session = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(session);
        break;
      }

      case "customer.subscription.deleted": {
        const session = event.data.object as Stripe.Subscription;
        await handleCustomerSubscriptionDeleted(session);
        break;
      }

      default:
        console.warn(`🔔 Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

// Handler for successful checkout sessions
const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session
) => {
  const userId = session.metadata?.clerkUserId;
  console.log("Handling checkout.session.completed for user:", userId);

  if (!userId) {
    console.error("No userId found in session metadata.");
    return;
  }

  // Retrieve subscription ID from the session
  const subscriptionId = session.subscription as string;

  if (!subscriptionId) {
    console.error("No subscription ID found in session.");
    return;
  }

  console.log(`Processing subscription ${subscriptionId} for user ${userId} with plan ${session.metadata?.planType}`);
  
  // Update Prisma with subscription details
  try {
    const before = await prisma.profiles.findUnique({
      where: { userId },
    });
    
    console.log("Profile before update:", before);
    
    const updated = await prisma.profiles.update({
      where: { userId },
      data: {
        stripeSubscriptionId: subscriptionId,
        subscriptionActive: true,
        subscriptionTier: session.metadata?.planType || null,
      },
    });
    
    console.log("Profile after update:", updated);
    console.log(`✅ Subscription activated for user: ${userId}`);
  } catch (error: any) {
    console.error("Prisma Update Error:", error.message);
    console.error("Error stack:", error.stack);
  }
};

// Handler for failed invoice payments
const handleInvoicePaymentFailed = async (invoice: Stripe.Invoice) => {
  const subscriptionId = invoice.subscription as string;
  console.log(
    "Handling invoice.payment_failed for subscription:",
    subscriptionId
  );

  if (!subscriptionId) {
    console.error("No subscription ID found in invoice.");
    return;
  }

  // Retrieve userId from subscription ID
  let userId: string | undefined;
  try {
    const profile = await prisma.profiles.findUnique({
      where: { stripeSubscriptionId: subscriptionId },
      select: { userId: true },
    });

    if (!profile?.userId) {
      console.error("No profile found for this subscription ID.");
      return;
    }

    userId = profile.userId;
  } catch (error: any) {
    console.error("Prisma Query Error:", error.message);
    return;
  }

  // Update Prisma with payment failure
  try {
    await prisma.profiles.update({
      where: { userId },
      data: {
        subscriptionActive: false,
      },
    });
    console.log(`Subscription payment failed for user: ${userId}`);
  } catch (error: any) {
    console.error("Prisma Update Error:", error.message);
  }
};

// Handler for subscription deletions (e.g., cancellations)
const handleCustomerSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  const subscriptionId = subscription.id;
  console.log(
    "Handling customer.subscription.deleted for subscription:",
    subscriptionId
  );

  // Retrieve userId from subscription ID
  let userId: string | undefined;
  try {
    const profile = await prisma.profiles.findUnique({
      where: { stripeSubscriptionId: subscriptionId },
      select: { userId: true },
    });

    if (!profile?.userId) {
      console.error("No profile found for this subscription ID.");
      return;
    }

    userId = profile.userId;
  } catch (error: any) {
    console.error("Prisma Query Error:", error.message);
    return;
  }

  // Update Prisma with subscription cancellation
  try {
    await prisma.profiles.update({
      where: { userId },
      data: {
        subscriptionActive: false,
        stripeSubscriptionId: null,
      },
    });
    console.log(`Subscription canceled for user: ${userId}`);
  } catch (error: any) {
    console.error("Prisma Update Error:", error.message);
  }
};

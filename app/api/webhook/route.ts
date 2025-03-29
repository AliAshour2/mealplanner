import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Define types for the raw query results
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("⚠️ Webhook signature verification failed.", errorMessage);
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
  
  // Update with subscription details (using raw query to avoid type issues)
  try {
    // Get profile before update
    const profiles = await prisma.$queryRaw<ProfileData[]>`
      SELECT * FROM "Profile" WHERE "userId" = ${userId}
    `;
    
    console.log("Profile before update:", profiles[0]);
    
    // Update the profile
    await prisma.$executeRaw`
      UPDATE "Profile" 
      SET 
        "stripeSubscriptionId" = ${subscriptionId},
        "subscriptionActive" = true,
        "subscriptionTier" = ${session.metadata?.planType || null}
      WHERE "userId" = ${userId}
    `;
    
    // Get updated profile
    const updatedProfiles = await prisma.$queryRaw<ProfileData[]>`
      SELECT * FROM "Profile" WHERE "userId" = ${userId}
    `;
    
    console.log("Profile after update:", updatedProfiles[0]);
    console.log(`✅ Subscription activated for user: ${userId}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error("Update Error:", errorMessage);
    if (errorStack) console.error("Error stack:", errorStack);
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
  try {
    // Find the profile with this subscription ID
    const profiles = await prisma.$queryRaw<ProfileData[]>`
      SELECT "userId" FROM "Profile" WHERE "stripeSubscriptionId" = ${subscriptionId}
    `;

    if (!profiles.length || !profiles[0].userId) {
      console.error("No profile found for this subscription ID.");
      return;
    }

    const userId = profiles[0].userId;

    // Update the subscription status
    await prisma.$executeRaw`
      UPDATE "Profile" 
      SET "subscriptionActive" = false
      WHERE "userId" = ${userId}
    `;
    
    console.log(`Subscription payment failed for user: ${userId}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Query or Update Error:", errorMessage);
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
  try {
    // Find the profile with this subscription ID
    const profiles = await prisma.$queryRaw<ProfileData[]>`
      SELECT "userId" FROM "Profile" WHERE "stripeSubscriptionId" = ${subscriptionId}
    `;

    if (!profiles.length || !profiles[0].userId) {
      console.error("No profile found for this subscription ID.");
      return;
    }

    const userId = profiles[0].userId;

    // Update the subscription status
    await prisma.$executeRaw`
      UPDATE "Profile" 
      SET 
        "subscriptionActive" = false,
        "stripeSubscriptionId" = null
      WHERE "userId" = ${userId}
    `;
    
    console.log(`Subscription canceled for user: ${userId}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Query or Update Error:", errorMessage);
  }
};

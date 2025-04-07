/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Profile";

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email" TEXT,
    "subscription_active" BOOLEAN NOT NULL DEFAULT false,
    "subscription_tier" TEXT,
    "stripe_subscription_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'buyer',
    "verification_status" TEXT NOT NULL DEFAULT 'pending',
    "kyc_status" TEXT NOT NULL DEFAULT 'pending',
    "is_manufacturer" BOOLEAN NOT NULL DEFAULT false,
    "average_rating" TEXT NOT NULL DEFAULT '0',
    "total_reviews" INTEGER NOT NULL DEFAULT 0,
    "business_registered" BOOLEAN NOT NULL DEFAULT false,
    "is_mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "preferred_mfa_method" TEXT NOT NULL DEFAULT 'none',

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_stripe_subscription_id_key" ON "profiles"("stripe_subscription_id");

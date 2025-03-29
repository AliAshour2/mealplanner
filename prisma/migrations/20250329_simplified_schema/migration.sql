-- Drop existing profiles table if it exists
DROP TABLE IF EXISTS profiles CASCADE;

-- Create the simplified Profile table
CREATE TABLE "Profile" (
  id TEXT NOT NULL, 
  "userId" TEXT NOT NULL,
  email TEXT NOT NULL,
  "subscriptionTier" TEXT,
  "subscriptionActive" BOOLEAN NOT NULL DEFAULT false,
  "stripeSubscriptionId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  
  CONSTRAINT "Profile_pkey" PRIMARY KEY (id)
);

-- Create unique constraints
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
CREATE UNIQUE INDEX "Profile_stripeSubscriptionId_key" ON "Profile"("stripeSubscriptionId"); 
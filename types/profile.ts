// Common Profile Fields
interface BaseProfile {
  id: string;
  userId: string;
  email: string;
  subscriptionActive: boolean;
  subscriptionTier: string | null;
  stripeSubscriptionId: string | null;
}

// Database Profile (includes string dates for hydration)
export interface DatabaseProfile extends BaseProfile {
  createdAt: string;
  updatedAt: string;
}

// MCP Profile (uses Date objects)
export interface ProfileMCP extends BaseProfile {
  createdAt: Date;
  updatedAt: Date;
}

// Profile mapping functions
export function mcpToDatabase(profile: ProfileMCP): DatabaseProfile {
  return {
    ...profile,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

export function databaseToMcp(profile: DatabaseProfile): ProfileMCP {
  return {
    ...profile,
    createdAt: new Date(profile.createdAt),
    updatedAt: new Date(profile.updatedAt),
  };
}

// Subscription Props
export interface SubscriptionProps {
  plan?: string;
  nextBilling?: string;
}

// User Props extending Clerk User
export interface ClerkUserProps {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  imageUrl?: string;
  emailAddresses?: Array<{ emailAddress: string }>;
  createdAt?: number | null;
  plan?: string;
  nextBilling?: string;
}

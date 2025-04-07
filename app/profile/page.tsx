"use client";

import NavItem from "@/components/profilePage/navItem";
import ProfileTab from "@/components/profilePage/profile-tab";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  CreditCard,
  HelpCircle,
  History,
  LogOut,
  Settings,
  User,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TabContentLoading from "@/components/skeletons/tabContentLoading";

// Define interface matching Clerk user properties we use
interface ClerkUser {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  imageUrl?: string;
  emailAddresses?: Array<{ emailAddress: string }>;
  createdAt?: number | null;
}

// Profile interface
interface DatabaseProfile {
  id: string;
  userId: string;
  email: string;
  subscriptionActive: boolean;
  subscriptionTier: string | null;
  stripeSubscriptionId: string | null;
  createdAt: string; // Using string to avoid hydration mismatch
  updatedAt: string; // Using string to avoid hydration mismatch
}

const Profile = () => {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Fetch profile data from your database when Clerk user is loaded
  const { data: dbProfile, isLoading: isLoadingProfile } = useQuery<DatabaseProfile>({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      // Fetch profile from the database
      const response = await fetch(`/api/profile?userId=${user.id}`);
      if (!response.ok) {
        // If profile doesn't exist, create it
        if (response.status === 404) {
          const createResponse = await fetch('/api/profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              email: user.emailAddresses[0].emailAddress,
            }),
          });
          
          if (createResponse.ok) {
            return createResponse.json();
          }
          throw new Error('Failed to create profile');
        }
        throw new Error('Failed to fetch profile');
      }
      
      return response.json();
    },
    enabled: !!user?.id && isLoaded,
  });
  
  // Initial loading state for the entire page
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Get subscription tier display name
  const getSubscriptionTierLabel = () => {
    if (!dbProfile?.subscriptionActive) return "Free Plan";
    return dbProfile?.subscriptionTier || "Free Plan";
  };

  // Create a type-safe user object to pass to the ProfileTab
  const typedUser: ClerkUser = user ? {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    imageUrl: user.imageUrl,
    emailAddresses: user.emailAddresses,
    createdAt: user.createdAt ? +user.createdAt : null // Convert to number or null
  } : {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row">

        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-6 text-center ">
                <div className=" rounded-full overflow-hidden">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-20 h-20 border-4 border-green-500",
                      },
                    }}
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {user?.fullName || ""}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.emailAddresses[0].emailAddress || ""}
                </p>
                <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  {isLoadingProfile ? "Loading..." : getSubscriptionTierLabel()}
                </Badge>
              </div>
              <Separator className="my-4" />

              <nav className="space-y-1">
                <NavItem
                  icon={<User className="w-5 h-5" />}
                  label="Profile"
                  active={activeTab === "profile"}
                  onClick={() => setActiveTab("profile")}
                />
                <NavItem
                  icon={<CreditCard className="w-5 h-5" />}
                  label="Subscription"
                  active={activeTab === "subscription"}
                  onClick={() => setActiveTab("subscription")}
                />
                <NavItem
                  icon={<Utensils className="w-5 h-5" />}
                  label="Preferences"
                  active={activeTab === "preferences"}
                  onClick={() => setActiveTab("preferences")}
                />
                <NavItem
                  icon={<History className="w-5 h-5" />}
                  label="Meal History"
                  active={activeTab === "history"}
                  onClick={() => setActiveTab("history")}
                />
                <NavItem
                  icon={<Settings className="w-5 h-5" />}
                  label="Settings"
                  active={activeTab === "settings"}
                  onClick={() => setActiveTab("settings")}
                />

                <Separator className="my-4" />
                <NavItem
                  icon={<HelpCircle className="w-5 h-5" />}
                  label="Help & Support"
                  active={false}
                  onClick={() => {}}
                />
                <NavItem
                  icon={<LogOut className="w-5 h-5" />}
                  label="Sign Out"
                  active={false}
                  onClick={() => {}}
                  className="text-red-500 dark:text-red-400"
                />
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsContent value="profile" className="mt-4">
              {isLoadingProfile ? (
                <TabContentLoading />
              ) : (
                <ProfileTab user={typedUser} dbProfile={dbProfile} />
              )}
            </TabsContent>
            <TabsContent value="subscription" className="mt-4">
              {isLoadingProfile ? (
                <TabContentLoading />
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold">Subscription Details</h2>
                    <div className="mt-4">
                      <p className="mb-2"><strong>Status:</strong> {dbProfile?.subscriptionActive ? 'Active' : 'Inactive'}</p>
                      <p className="mb-2"><strong>Plan:</strong> {getSubscriptionTierLabel()}</p>
                      {dbProfile?.subscriptionActive && dbProfile?.stripeSubscriptionId && (
                        <p className="mb-2"><strong>Subscription ID:</strong> {dbProfile.stripeSubscriptionId}</p>
                      )}
                      <p className="mb-2">
                        <strong>Member Since:</strong> {dbProfile?.createdAt ? 
                          new Date(dbProfile.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'N/A'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

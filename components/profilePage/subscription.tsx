import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import PricingCard from "../PricingCard";
import { plans } from "@/lib/constants/pricingProfileData";

interface SubscriptionProps {
  user: {
    plan?: string;
    nextBilling?: string;
  };
}

const SubscriptionTap = ({ user }: SubscriptionProps) => {
  // Default values if user or user.plan is undefined
  const userPlan = user?.plan || "";
  const nextBilling = user?.nextBilling || "N/A";

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
          <CardDescription>
            Manage your subscription plan and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {userPlan ? `${userPlan} Plan` : "No Plan Selected"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userPlan ? `Billed monthly • Next payment on ${nextBilling}` : "No active subscription"}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-600 dark:bg-green-400 dark:text-green-100">
                {userPlan ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
              const isCurrentPlan = userPlan ? plan.name.toLowerCase() === userPlan.toLowerCase() : false;
              return (
                <PricingCard 
                  key={index} 
                  plan={plan.name}
                  price={plan.price}
                  period="month"
                  features={plan.features}
                  isPopular={plan.highlighted}
                  ctaText={isCurrentPlan ? "Current Plan" : plan.buttonText}
                  current={isCurrentPlan}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionTap;

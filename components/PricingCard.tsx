"use client";
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { PricingPlan } from "@/lib/constants/pricing";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const PricingCard = ({
  plan,
  price,
  period,
  features,
  isPopular,
  ctaText,
}: PricingPlan) => {
  const { user } = useUser();
  const userId = user?.id;
  const email = user?.emailAddresses[0].emailAddress;
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { planType: string }) => {
      if (!userId || !email) {
        throw new Error("Please sign in to subscribe");
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType: data.planType.toLowerCase(),
          userId,
          email,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create checkout session");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onMutate: () => {
      toast.loading("Processing...");
    },
    onError: (error) => {
      console.error("Subscription error:", error);
      toast.error(error.message || "Failed to subscribe");
    },
  });

  function handleSubscribe(planType: string) {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    mutate({ planType });
  }
  return (
    <Card
      className={`relative flex flex-col h-full transition-all duration-300 hover:shadow-lg dark:bg-gray-800 ${
        isPopular ? "border-green-500 dark:border-green-400 shadow-md" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium translate-y-[-50%] bg-green-500 text-white rounded-full">
          Most Popular
        </div>
      )}
      <CardContent className="flex flex-col h-full p-6">
        <div className="mb-5">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {plan}
          </h3>
          <div className="mt-4 mb-6">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {price}
            </span>
            <span className="text-gray-500 dark:text-gray-400">/{period}</span>
          </div>
        </div>

        <ul className="flex-1 mb-6 space-y-3">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center text-gray-600 dark:text-gray-300"
            >
              <Check className="w-5 h-5 mr-2 text-green-500 dark:text-green-400" />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          onClick={() => handleSubscribe(plan)}
          disabled={isPending}
          className={`w-full ${
            isPopular
              ? "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          }`}
        >
          {isPending ? "Processing..." : ctaText || `Subscribe to ${plan}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;

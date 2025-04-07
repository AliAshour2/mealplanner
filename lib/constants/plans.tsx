export interface Plan {
  name: string;
  amount: number;
  currency: string;
  interval: string;
  isPopular?: boolean;
  description: string;
  features: string[];
  ctaText?: boolean;
}

export const availablePlans: Plan[] = [
  {
    name: "Weekly Plan",
    amount: 9.99,
    currency: "USD",
    interval: "week",
    description:
      "Great if you want to try the service before committing longer.",
    features: [
      "  AI-generated weekly meal plan",
      "50+ recipes",
      "Basic nutritional information",
      "Shopping list generator",
      "Email support",
    ],
  },
  {
    name: "Monthly Plan",
    amount: 39.99,
    currency: "USD",
    interval: "month",
    isPopular: true, // Marking this plan as the most popular
    description:
      "Perfect for ongoing, month-to-month meal planning and features.",
    features: [
      "Everything in Starter",
      "200+ recipes",
      "Detailed nutritional analysis",
      "Dietary preference settings",
      "Meal prep instructions",
      "Priority support",
    ],
  },
  {
    name: "Yearly Plan",
    amount: 299.99,
    currency: "USD",
    interval: "year",
    description:
      "Best value for those committed to improving their diet long-term.",
    features: [
      "Everything in Premium",
      "Family-sized recipes",
      "Multiple dietary profiles",
      "Pantry management system",
      "Leftover recipe suggestions",
      "24/7 priority support",
      "Custom recipe requests",
    ],
  },
];

const priceIdMap: Record<string, string> = {
  week: process.env.STRIPE_PRICE_WEEKLY!,
  month: process.env.STRIPE_PRICE_MONTHLY!,
  year: process.env.STRIPE_PRICE_YEARLY!,
};

export const getPriceIdFromType = (planType: string) => priceIdMap[planType];

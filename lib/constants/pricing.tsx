export interface PricingPlan {
    plan: string;
    price: string;
    period: string;
    features: string[];
    isPopular?: boolean;
    ctaText?: string;
  }
  
  export const  pricingPlans: PricingPlan[] = [
    {
      plan: "Starter",
      price: "$9.99",
      period: "month",
      features: [
        "AI-generated weekly meal plan",
        "50+ recipes",
        "Basic nutritional information",
        "Shopping list generator",
        "Email support",
      ],
    },
    {
      plan: "Premium", 
      price: "$19.99",
      period: "month",
      features: [
        "Everything in Starter",
        "200+ recipes",
        "Detailed nutritional analysis",
        "Dietary preference settings",
        "Meal prep instructions",
        "Priority support",
      ],
      isPopular: true,
      ctaText: "Try Premium",
    },
    {
      plan: "Family",
      price: "$29.99",
      period: "month",
      features: [
        "Everything in Premium",
        "Family-sized recipes",
        "Multiple dietary profiles",
        "Pantry management system",
        "Leftover recipe suggestions",
        "24/7 priority support",
        "Custom recipe requests",
      ],
      ctaText: "Best for Families",
    },
  ]; 
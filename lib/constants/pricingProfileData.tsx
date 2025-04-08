
import { Check } from "lucide-react";

export const plans = [
  {
    name: "Starter",
    price: "$9.99",
    current: false,
    description: "Starter",
    features: ["Weekly meal plans", "50+ recipes", "Basic nutrition info"],
    buttonText: "Downgrade",
    disabled: false,
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$19.99",
    current: true,
    description: "Premium",
    features: [
      "Everything in Starter",
      "200+ recipes",
      "Detailed nutrition analysis",
      "Priority support",
    ],
    buttonText: "Current Plan",
    disabled: true,
    highlighted: true,
  },
  {
    name: "Family",
    price: "$29.99",
    current: false,
    description: "Family",
    features: [
      "Everything in Premium",
      "Family-sized recipes",
      "Multiple dietary profiles",
      "24/7 priority support",
    ],
    buttonText: "Upgrade",
    disabled: false,
    highlighted: false,
  },
];

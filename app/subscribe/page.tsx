import PricingCard from "@/components/PricingCard";
import { pricingPlans } from "@/lib/constants/pricing";

const Subscribe = () => {
  return (
    <div className="py-16">
      <h2 className="mb-4 text-3xl font-bold text-center text-gray-900 dark:text-white">
        Choose your plan
      </h2>
      <p className="max-w-2xl mx-auto mb-12 text-center text-gray-600 dark:text-gray-300">
        Select the perfect meal planning subscription that fits your lifestyle
        and budget
      </p>

      <div className="grid gap-8 md:grid-cols-3">
        {pricingPlans.map((plan, index) => (
          <PricingCard key={index} {...plan} />
        ))}
      </div>

      <div className="flex items-center justify-center mt-10">
        <div className="px-4 py-2 text-sm bg-green-100 rounded-full text-green-800 dark:bg-green-900/50 dark:text-green-100">
          All plans include a 14-day free trial. No credit card required.
        </div>
      </div>
    </div>
  );
};

export default Subscribe;

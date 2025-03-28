"use client";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Utensils,
  Flame,
  AlertCircle,
  Globe,
  Apple,
  Calendar,
  ChevronRight,
  CheckCircle,
  X
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MealPlanDisplay, { MealPlanData } from "@/components/mealPlanDisplay";
import { CUISINES, DIET_TYPES } from "@/lib/constants/mealDashBoard";

// Toast notification component
const SuccessToast = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed top-4 right-4 z-50 animate-fade-in animate-slide-in-right">
    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg flex items-center justify-between w-[300px]">
      <div className="flex items-center">
        <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
        <span>Subscription activated successfully!</span>
      </div>
      <button onClick={onClose} className="text-green-700 hover:text-green-800">
        <X className="h-4 w-4" />
      </button>
    </div>
  </div>
);

interface MealPlanInput {
  dietType: string;
  calories: number;
  allergies: string;
  cuisine: string;
  snacks: boolean;
  days: number;
}

interface MealPlanResponse {
  mealPlan?: MealPlanData;
  error?: string;
}

async function generateMealPlan(payload: MealPlanInput) {
  const response = await fetch("/api/generate-meal-plan", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData: MealPlanResponse = await response.json();
    throw new Error(errorData.error || "Failed to generate meal plan.");
  }

  return response.json();
}

const MealPlanDashboard = () => {
  const [calories, setCalories] = React.useState(2000);
  const [days, setDays] = React.useState(7);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('subscription_success') === 'true') {
      setShowSuccessToast(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const { data, mutate, isPending, isSuccess } = useMutation<
    MealPlanResponse,
    Error,
    MealPlanInput
  >({
    mutationFn: generateMealPlan,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload: MealPlanInput = {
      dietType: formData.get("dietType")?.toString() || "",
      calories: calories,
      allergies: formData.get("allergies")?.toString() || "",
      cuisine: formData.get("cuisine")?.toString() || "",
      snacks: formData.get("snacks") === "on",
      days: 7,
    };

    mutate(payload);
  }

  if (data) {
    console.log(data);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/30 p-6 md:p-10">
      {showSuccessToast && <SuccessToast onClose={() => setShowSuccessToast(false)} />}
      
      <div className="mx-auto max-w-5xl w-full">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">
            AI Meal Planner 🍽️
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Create personalized meal plans tailored to your dietary preferences
            and nutritional goals
          </p>
        </div>

        <Card className="w-full shadow-lg border-primary/10 overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <div className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Create Your Meal Plan</h2>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-primary" />
                    <Label htmlFor="dietType" className="font-medium">
                      Diet Type
                    </Label>
                  </div>
                  <Select name="dietType" defaultValue="balanced">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIET_TYPES.map((diet) => (
                        <SelectItem key={diet.value} value={diet.value}>
                          {diet.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-primary" />
                    <Label htmlFor="calories" className="font-medium">
                      Daily Calorie Goal: {calories}
                    </Label>
                  </div>
                  <Slider
                    id="calories"
                    min={1000}
                    max={4000}
                    step={50}
                    defaultValue={[2000]}
                    onValueChange={(value) => setCalories(value[0])}
                    className="py-4"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <Label htmlFor="allergies" className="font-medium">
                      Allergies or Restrictions
                    </Label>
                  </div>
                  <Input
                    type="text"
                    id="allergies"
                    name="allergies"
                    placeholder="e.g. Nuts, Dairy, Gluten..."
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <Label htmlFor="cuisine" className="font-medium">
                      Preferred Cuisine
                    </Label>
                  </div>
                  <Select name="cuisine" defaultValue="any">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      {CUISINES.map((cuisine) => (
                        <SelectItem key={cuisine.value} value={cuisine.value}>
                          {cuisine.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <Label htmlFor="days" className="font-medium">
                      Plan Duration: {days} days
                    </Label>
                  </div>
                  <Slider
                    id="days"
                    min={1}
                    max={14}
                    step={1}
                    defaultValue={[7]}
                    onValueChange={(value) => setDays(value[0])}
                    className="py-4"
                  />
                </div>

                <div className="flex items-center h-full">
                  <div className="flex items-center space-x-2 bg-secondary/30 p-4 rounded-lg w-full">
                    <Checkbox id="snacks" name="snacks" />
                    <div className="space-y-1">
                      <Label
                        htmlFor="snacks"
                        className="font-medium flex items-center gap-2"
                      >
                        <Apple className="h-4 w-4 text-primary" />
                        Include snacks
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Add healthy snack options between meals
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <CardFooter className="px-0 pt-4 pb-0 flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto flex-1 gap-2 bg-green-600 hover:bg-green-600/90"
                >
                  {isPending ? "Generating..." : "Generate Meal Plan"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  type="reset"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Reset
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Your personalized meal plan will be generated based on your
            preferences.
          </p>
        </div>
      </div>

      {isPending && (
        <Card className="w-full mt-8 shadow-lg border-primary/10 overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin">
                <Utensils className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground">
                Creating your personalized meal plan...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {data?.mealPlan && isSuccess && (
        <MealPlanDisplay mealPlan={data.mealPlan} calories={calories} />
      )}
    </div>
  );
};

export default MealPlanDashboard;

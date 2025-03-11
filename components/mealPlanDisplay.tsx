"use client"

import type React from "react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UtensilsCrossed, Coffee, Utensils, Clock } from "lucide-react"

export interface MealItem {
  description: string
  calories: number
  protein: number
  carbs: number
  prep_time: number
}

export interface DayMeals {
  Breakfast: MealItem
  Lunch: MealItem
  Dinner: MealItem
}

export interface MealPlanData {
  [day: string]: DayMeals
}

interface MealPlanDisplayProps {
  mealPlan: MealPlanData
  calories: number
}

const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({ mealPlan, calories }) => {
  const days = Object.keys(mealPlan)

  return (
    <Card className="w-full shadow-lg border-primary/10 overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Your {days.length}-Day Meal Plan</h2>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            ~{calories} calories/day
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs defaultValue={days[0]} className="w-full">
          <TabsList className="mb-4 flex flex-wrap h-auto">
            {days.map((day) => (
              <TabsTrigger key={day} value={day} className="flex-grow">
                {day}
              </TabsTrigger>
            ))}
          </TabsList>

          {days.map((day) => (
            <TabsContent key={day} value={day} className="space-y-6">
              {/* Breakfast */}
              <MealCard meal={mealPlan[day].Breakfast} title="Breakfast" icon={Coffee} mealType="breakfast" />

              {/* Lunch */}
              <MealCard meal={mealPlan[day].Lunch} title="Lunch" icon={Utensils} mealType="lunch" />

              {/* Dinner */}
              <MealCard meal={mealPlan[day].Dinner} title="Dinner" icon={UtensilsCrossed} mealType="dinner" />

              {/* Daily Summary */}
              <DailySummary dayMeals={mealPlan[day]} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>

      <CardFooter className="bg-primary/5 border-t border-primary/10 p-4">
        <div className="w-full flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Meal plan generated based on your preferences</p>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            Print Plan
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// Helper function to get a consistent image for each meal type
const getMealImage = (mealType: string, description: string) => {
  // Create a simple hash of the description to get a consistent but varied image
  const hash = description.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  const mealTypeMap: Record<string, string> = {
    breakfast: "/placeholder.svg?height=200&width=300&text=Breakfast",
    lunch: "/placeholder.svg?height=200&width=300&text=Lunch",
    dinner: "/placeholder.svg?height=200&width=300&text=Dinner",
  }

  return `${mealTypeMap[mealType]}&seed=${hash}`
}

const MealCard: React.FC<{
  meal: MealItem
  title: string
  icon: React.ElementType
  mealType: string
}> = ({ meal, title, icon: Icon, mealType }) => (
  <div className="rounded-lg border overflow-hidden">
    <div className="bg-secondary/30 px-4 py-2 border-b">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="font-medium">{title}</h3>
      </div>
    </div>
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3">
          <div className="aspect-video rounded-md overflow-hidden bg-muted">
            <img
              src={getMealImage(mealType, meal.description) || "/placeholder.svg"}
              alt={meal.description}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="md:w-2/3 space-y-2">
          <h4 className="font-semibold text-lg">{meal.description}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{meal.prep_time} mins prep time</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <NutritionBadge label="Calories" value={meal.calories} />
            <NutritionBadge label="Protein" value={`${meal.protein}g`} />
            <NutritionBadge label="Carbs" value={`${meal.carbs}g`} />
          </div>
        </div>
      </div>
    </div>
  </div>
)

const NutritionBadge: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-secondary/30 p-2 rounded text-center">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="font-medium">{value}</div>
  </div>
)

const DailySummary: React.FC<{ dayMeals: DayMeals }> = ({ dayMeals }) => {
  const totalCalories = dayMeals.Breakfast.calories + dayMeals.Lunch.calories + dayMeals.Dinner.calories
  const totalProtein = dayMeals.Breakfast.protein + dayMeals.Lunch.protein + dayMeals.Dinner.protein
  const totalCarbs = dayMeals.Breakfast.carbs + dayMeals.Lunch.carbs + dayMeals.Dinner.carbs

  // Estimate fat based on remaining calories (9 calories per gram of fat)
  const estimatedFat = Math.round((totalCalories - totalProtein * 4 - totalCarbs * 4) / 9)

  return (
    <div className="rounded-lg border overflow-hidden bg-primary/5">
      <div className="p-4">
        <h3 className="font-medium mb-2">Daily Summary</h3>
        <div className="grid grid-cols-4 gap-2">
          <NutritionBadge label="Total Calories" value={totalCalories} />
          <NutritionBadge label="Total Protein" value={`${totalProtein}g`} />
          <NutritionBadge label="Total Carbs" value={`${totalCarbs}g`} />
          <NutritionBadge label="Est. Fat" value={`${Math.max(0, estimatedFat)}g`} />
        </div>
      </div>
    </div>
  )
}

export default MealPlanDisplay


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, Heart } from "lucide-react";
import Subscribe from "./subscribe/page";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center">
      <section className="w-full flex flex-col items-center justify-center mt-24 py-24 md:py-24 lg:py-20 xl:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Plan Your Meals with Ease
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Simplify your life with our in tuitive meal planning app using the power of Ai. Eat
                healthier, save time, and enjoy delicious meals every day.
              </p>
            </div>
            <div className="space-x-4">
              <Button className="bg-green-500 hover:bg-green-600">Get Started</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full flex flex-col items-center justify-center  py-24 md:py-24 lg:py-20 xl:py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Why Choose MealPlanner?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Clock className="w-8 h-8 mb-2" />
                  <CardTitle>Save Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Streamline your meal planning and grocery shopping process.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Heart className="w-8 h-8 mb-2" />
                  <CardTitle>Eat Healthier</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Choose from a variety of nutritious recipes and balanced meal plans.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CalendarDays className="w-8 h-8 mb-2" />
                  <CardTitle>Easy Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Effortlessly organize your meals for the week with our intuitive planner Using Ai.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Subscribe />
    </div>
  );
}
import { NextRequest, NextResponse } from "next/server";

import openAi from "openai";

const openAI = new openAi({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

console.log("OpenAI API Key:", process.env.OPEN_ROUTER_API_KEY);

interface DailyMealPlan {
  Breakfast?: string;
  Lunch?: string;
  Dinner?: string;
  Snacks?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { dietType, calories, allergies, cuisine, snacks} =
      await request.json();

    const prompt = `
      You are a professional nutritionist. Create a 7-day meal plan for an individual following a ${dietType} diet aiming for ${calories} calories per day.
      
      Allergies or restrictions: ${allergies || "none"}.
      Preferred cuisine: ${cuisine || "no preference"}.
      Snacks included: ${snacks ? "yes" : "no"}.
      
      For each day, provide:
        - Breakfast
        - Lunch
        - Dinner
        ${snacks ? "- Snacks" : ""}
      
      Each meal should include:
        - A short description
        - Approximate calories
        - Protein (grams)
        - Carbohydrates (grams)
        - Preparation time (in minutes)
      
      Structure the response as a JSON object where each day is a key, and each meal (breakfast, lunch, dinner, snacks) is a sub-key. Example:
      
      {
        "Monday": {
          "Breakfast": {
            "description": "Oatmeal with fruits",
            "calories": 350,
            "protein": 10,
            "carbs": 50,
            "prep_time": 10
          },
          "Lunch": {
            "description": "Grilled chicken salad",
            "calories": 500,
            "protein": 45,
            "carbs": 30,
            "prep_time": 15
          },
          "Dinner": {
            "description": "Steamed vegetables with quinoa",
            "calories": 600,
            "protein": 20,
            "carbs": 70,
            "prep_time": 25
          },
          "Snacks": {
            "description": "Greek yogurt",
            "calories": 150,
            "protein": 12,
            "carbs": 15,
            "prep_time": 5
          }
        },
        "Tuesday": {
          "Breakfast": {
            "description": "Smoothie bowl",
            "calories": 300,
            "protein": 8,
            "carbs": 40,
            "prep_time": 5
          },
          "Lunch": {
            "description": "Turkey sandwich",
            "calories": 450,
            "protein": 35,
            "carbs": 50,
            "prep_time": 10
          },
          "Dinner": {
            "description": "Baked salmon with asparagus",
            "calories": 700,
            "protein": 50,
            "carbs": 20,
            "prep_time": 30
          },
          "Snacks": {
            "description": "Almonds",
            "calories": 200,
            "protein": 7,
            "carbs": 5,
            "prep_time": 2
          }
        }
        // ...and so on for each day
      }

      Return just the JSON with no extra commentaries and no backticks.
    `;

    const response = await openAI.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1500,
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const aiMealPlan = response.choices[0].message.content!.trim();

    let parsedMealPlan: { [day: string]: DailyMealPlan };

    try {
      parsedMealPlan = JSON.parse(aiMealPlan);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    if (typeof parsedMealPlan !== "object" || !parsedMealPlan === null) {
      console.error("Invalid AI response:", parsedMealPlan);
      return NextResponse.json(
        { error: "Invalid AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ mealPlan: parsedMealPlan });
  } catch (error: unknown) {
    console.log("Internal Error ", error);
    return NextResponse.json({ error: "Inernal  Error" }, { status: 500 });
  }
}

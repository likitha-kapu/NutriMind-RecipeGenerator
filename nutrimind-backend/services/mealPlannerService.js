import fs from "fs";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

/* ===============================
   LOAD DATASET
================================ */

const allRecipes = JSON.parse(
  fs.readFileSync("data/recipes.json", "utf8")
);

const recipes = allRecipes.slice(0, 20000);

/* ===============================
   GROQ SETUP
================================ */

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ===============================
   FIND CLOSEST RECIPE
================================ */

function findClosestRecipe(recipes, targetCalories) {

  return recipes.reduce((closest, recipe) => {

    if (!recipe.calories) return closest;

    const currentDiff =
      Math.abs(recipe.calories - targetCalories);

    const closestDiff =
      Math.abs(closest.calories - targetCalories);

    return currentDiff < closestDiff
      ? recipe
      : closest;

  });

}

/* ===============================
   CREATE MEAL PLAN
================================ */

function createMealPlan(
  days,
  recipes,
  breakfastTarget,
  lunchTarget,
  dinnerTarget
) {

  const plan = [];

  for (let i = 0; i < days; i++) {

    const breakfast =
      findClosestRecipe(recipes, breakfastTarget);

    const lunch =
      findClosestRecipe(recipes, lunchTarget);

    const dinner =
      findClosestRecipe(recipes, dinnerTarget);

    plan.push({
      day: `Day ${i + 1}`,
      breakfast: breakfast?.title || "Oatmeal",
      lunch: lunch?.title || "Vegetable Salad",
      dinner: dinner?.title || "Lentil Soup"
    });

  }

  return plan;

}

/* ===============================
   GET RECIPE CALORIES
================================ */

function getRecipeCalories(title, recipes) {

  const recipe =
    recipes.find(r => r.title === title);

  return recipe?.calories || 0;

}

/* ===============================
   MAIN FUNCTION
================================ */

export async function generateMealPlan(
  days,
  diet,
  goal,
  cookingTime
) {

  try {

    let filteredRecipes = recipes;

    /* ==========================
       FILTER BY DIET
    ========================== */

    if (diet) {

      filteredRecipes =
        filteredRecipes.filter(recipe =>
          recipe.tags.some(tag =>
            tag.toLowerCase().includes(
              diet.toLowerCase()
            )
          )
        );

    }

    /* ==========================
       FILTER BY COOKING TIME
    ========================== */

    if (cookingTime === "Quick") {

      filteredRecipes =
        filteredRecipes.filter(
          r => r.minutes <= 20
        );

    }

    if (cookingTime === "Moderate") {

      filteredRecipes =
        filteredRecipes.filter(
          r => r.minutes <= 45
        );

    }

    /* ==========================
       GOAL CALORIE TARGET
    ========================== */

    const calorieTargets = {
      "Weight Loss": 1800,
      "Balanced": 2000,
      "Muscle Gain": 2500,
      "Energy Boost": 2200
    };

    const targetCalories =
      calorieTargets[goal] || 2000;

    const breakfastTarget =
      targetCalories * 0.3;

    const lunchTarget =
      targetCalories * 0.4;

    const dinnerTarget =
      targetCalories * 0.3;

    /* ==========================
       GENERATE PLAN FROM DATASET
    ========================== */

    const datasetPlan =
      createMealPlan(
        days,
        filteredRecipes,
        breakfastTarget,
        lunchTarget,
        dinnerTarget
      );

    /* ==========================
       CALCULATE DAILY CALORIES
    ========================== */

    const dailyCalories =
      datasetPlan.map(day => {

        const breakfastCal =
          getRecipeCalories(day.breakfast, filteredRecipes);

        const lunchCal =
          getRecipeCalories(day.lunch, filteredRecipes);

        const dinnerCal =
          getRecipeCalories(day.dinner, filteredRecipes);

        return {
          day: day.day,
          calories:
            breakfastCal +
            lunchCal +
            dinnerCal
        };

      });

    /* ==========================
       AVERAGE CALORIES
    ========================== */

    const totalCalories =
      dailyCalories.reduce(
        (sum, d) => sum + d.calories,
        0
      );

    const averageCalories =
      totalCalories / dailyCalories.length;

    /* ==========================
       GOAL ADHERENCE SCORE
    ========================== */

    const adherenceScore =
      1 -
      Math.abs(
        averageCalories - targetCalories
      ) / targetCalories;

    const finalScore =
      Math.max(0, Math.min(1, adherenceScore));

    /* ==========================
       OPTIONAL LLM IMPROVEMENT
    ========================== */

    let improvedPlan = { days: datasetPlan };

    try {

      const completion =
        await groq.chat.completions.create({

          messages: [
            {
              role: "system",
              content: `
Improve this meal plan if needed.

${JSON.stringify(datasetPlan)}

Return ONLY JSON with double quotes.

Format:
{
 "days":[
  {"day":"Day 1","breakfast":"Meal","lunch":"Meal","dinner":"Meal"}
 ]
}
`
            }
          ],

          model: "llama-3.1-8b-instant",
          temperature: 0.6

        });

      let content =
        completion.choices[0].message.content;

      content =
        content.replace(/```json/g, "")
        .replace(/```/g, "");

      const firstBrace =
        content.indexOf("{");

      const lastBrace =
        content.lastIndexOf("}");

      if (firstBrace !== -1 && lastBrace !== -1) {

        const jsonString =
          content.substring(firstBrace, lastBrace + 1);

        improvedPlan =
          JSON.parse(jsonString);

      }

    }
    catch (err) {

      console.log(
        "LLM returned invalid JSON, using dataset plan"
      );

    }

    /* ==========================
       RETURN FINAL RESULT
    ========================== */

    return {

      days: improvedPlan.days,

      analytics: {
        dailyCalories,
        averageCalories,
        goalCalories: targetCalories,
        adherenceScore: finalScore
      }

    };

  }
  catch (error) {

    console.error(
      "Meal planner error:",
      error.message
    );

    return null;

  }

}
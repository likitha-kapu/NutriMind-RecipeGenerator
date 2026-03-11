import express from "express";
import { generateMealPlan } from "../services/mealPlannerService.js";

const router = express.Router();

router.post("/", async (req, res) => {

  const { days, diet, goal, cookingTime } = req.body;

  if (!days) {
    return res.status(400).json({
      error: "Days required"
    });
  }

  try {

    const plan = await generateMealPlan(
      days,
      diet,
      goal,
      cookingTime
    );

    if (!plan) {
      return res.status(500).json({
        error: "Failed to generate meal plan"
      });
    }

    res.json(plan);

  } catch (error) {

    console.error("Meal planner route error:", error);

    res.status(500).json({
      error: "Server error"
    });

  }

});

export default router;
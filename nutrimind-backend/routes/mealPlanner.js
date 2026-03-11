import express from "express";
import { generateMealPlan } from "../services/mealPlannerService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { days, diet } = req.body;

  if (!days) {
    return res.status(400).json({ error: "Days required" });
  }

  const plan = await generateMealPlan(days, diet);

  if (!plan) {
    return res.status(500).json({ error: "Failed to generate meal plan" });
  }

  res.json(plan);
});

export default router;
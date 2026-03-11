import express from "express";
import { generateRecipeDetails } from "../services/recipeService.js";

const router = express.Router();

router.post("/details", async (req, res) => {
  try {
    const { recipeName } = req.body;

    if (!recipeName) {
      return res.status(400).json({ error: "recipeName is required" });
    }

    const recipe = await generateRecipeDetails(recipeName);

    if (!recipe) {
      return res.status(500).json({ error: "AI failed to generate recipe" });
    }

    res.json(recipe);

  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({ error: "Recipe generation failed" });
  }
});

export default router;
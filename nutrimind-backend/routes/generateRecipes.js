import express from "express";
import { generateMultipleRecipes } from "../services/groqService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { ingredients, diet } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: "Ingredients required" });
    }

    const recipes = await generateMultipleRecipes(ingredients, diet);

    if (!recipes) {
      return res.status(500).json({ error: "AI failed to generate recipes" });
    }

    res.json({ recipes });

  } catch (error) {
    console.error("Generate multiple recipes error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
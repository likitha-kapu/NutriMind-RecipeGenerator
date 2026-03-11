import express from "express";
import { generateMultipleRecipes } from "../services/groqService.js";
import SearchHistory from "../models/SearchHistory.js";

const router = express.Router();

router.post("/", async (req, res) => {

  try {

    let { ingredients, diet, healthConditions } = req.body;

    console.log("Incoming request:", req.body);

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({
        error: "Ingredients required"
      });
    }

    if (!Array.isArray(ingredients)) {
      ingredients = [ingredients];
    }

    diet = diet || "";
    healthConditions = healthConditions || [];

    console.log("Generating recipes...");

    const recipes = await generateMultipleRecipes(
      ingredients,
      diet,
      healthConditions
    );

    console.log("Recipes from AI:", recipes);

    if (!recipes) {
      return res.status(500).json({
        error: "AI failed to generate recipes"
      });
    }

    try {

      await SearchHistory.create({
        userId: "demoUser",
        ingredients,
        diet,
        health: healthConditions,
        recipes: recipes || []
      });

      console.log("History saved successfully");

    } catch (dbError) {

      console.log("History save failed:", dbError);

    }

    res.json({
      success: true,
      recipes
    });

  } catch (error) {

    console.error("Generate recipes error:", error);

    res.status(500).json({
      error: "Server error"
    });

  }

});

export default router;
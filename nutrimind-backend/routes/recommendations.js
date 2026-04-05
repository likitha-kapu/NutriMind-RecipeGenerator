import express from "express";
import SearchHistory from "../models/SearchHistory.js";

const router = express.Router();

/* ============================
   CONTENT BASED RECOMMENDATION
============================ */

router.get("/:userId", async (req, res) => {

  try {

    const userId = req.params.userId;

    const history = await SearchHistory
      .find({ userId })
      .sort({ createdAt: -1 });

    if (history.length < 2) {

      return res.json({
        recommendations: []
      });

    }

    /* Latest search */

    const latestSearch = history[0];

    const currentIngredients = latestSearch.ingredients || [];

    /* Calculate similarity with previous searches */

    const scoredHistory = history.slice(1).map(item => {

      const previousIngredients = item.ingredients || [];

      const commonIngredients = previousIngredients.filter(ing =>
        currentIngredients.includes(ing)
      );

      const similarity =
        commonIngredients.length / currentIngredients.length;

      return {
        ...item.toObject(),
        similarity
      };

    });

    /* Filter similar searches */

    const recommendations = scoredHistory
      .filter(item => item.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .map(item => ({
        recipes: item.recipes || []
      }));

    res.json({
      recommendations
    });

  } catch (error) {

    console.error("Recommendation error:", error);

    res.status(500).json({
      error: "Failed to fetch recommendations"
    });

  }

});

export default router;
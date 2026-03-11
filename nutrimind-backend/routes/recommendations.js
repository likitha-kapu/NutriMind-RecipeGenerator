import express from "express";
import SearchHistory from "../models/SearchHistory.js";

const router = express.Router();

/* ============================
   GET RECOMMENDATIONS
============================ */

router.get("/:userId", async (req, res) => {

  try {

    const userId = req.params.userId;

    /* Get last searches */

    const history = await SearchHistory
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    if (!history.length) {

      return res.json({
        recommendations: []
      });

    }

    /* Extract recipes from history */

    const recommendations = history.map(item => ({
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
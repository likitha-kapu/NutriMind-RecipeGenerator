import express from "express";
import SearchHistory from "../models/SearchHistory.js";
const router = express.Router();

/* ========================
   Save Search
======================== */

router.post("/save", async (req, res) => {

  try {

    const { userId, ingredients, diet, health } = req.body;

    const history = new SearchHistory({
      userId,
      ingredients,
      diet,
      health
    });

    await history.save();

    res.json({
      success: true,
      message: "Search saved"
    });

  } catch (error) {

    console.error("Save history error:", error);

    res.status(500).json({
      error: "Failed to save history"
    });

  }

});


/* ========================
   Get Search History
======================== */

router.get("/:userId", async (req, res) => {

  try {

    const history = await SearchHistory
      .find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(history);

  } catch (error) {

    console.error("Fetch history error:", error);

    res.status(500).json({
      error: "Failed to fetch history"
    });

  }

});


/* ========================
   Delete History
======================== */

router.delete("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const deleted = await SearchHistory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        error: "History not found"
      });
    }

    res.json({
      success: true,
      message: "History deleted successfully"
    });

  } catch (error) {

    console.error("Delete history error:", error);

    res.status(500).json({
      error: "Failed to delete history"
    });

  }

});

export default router;
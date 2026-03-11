import express from "express";
import { generateFromAssistant } from "../services/assistantService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const recipe = await generateFromAssistant(message);

    // 🔥 Directly send JSON recipe object
    res.json(recipe);

  } catch (error) {
    console.error("Assistant route error:", error);
    res.status(500).json({
      title: "Error",
      description: "Assistant failed",
      ingredients: [],
      instructions: []
    });
  }
});

export default router;
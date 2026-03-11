import express from "express";
import { chatWithAssistant } from "../services/chatService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { recipeName, message } = req.body;

    if (!recipeName || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const reply = await chatWithAssistant(recipeName, message);

    res.json({ reply });

  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).json({ error: "Chat failed" });
  }
});

export default router;
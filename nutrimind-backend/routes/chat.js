import express from "express";
import { chatWithAssistant } from "../services/chatService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, recipeName } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await chatWithAssistant(message, recipeName);
    res.json({ reply });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Assistant failed to reply" });
  }
});

export default router;

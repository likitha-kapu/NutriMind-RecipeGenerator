import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateFromAssistant(userMessage) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
You are an AI chef assistant.

If the user asks for a recipe,
respond ONLY in valid JSON in this exact format:

{
  "title": "",
  "description": "",
  "ingredients": ["", ""],
  "instructions": ["", ""]
}

Rules:
- Do NOT return markdown
- Do NOT return explanation
- Return ONLY pure JSON
`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7
    });

    const raw = completion.choices[0].message.content;

    // 🔥 Safe JSON extraction
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Invalid JSON format from AI");
    }

    const jsonString = raw.substring(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonString);

  } catch (error) {
    console.error("❌ Assistant failed:", error.message);

    return {
      title: "Error",
      description: "Something went wrong.",
      ingredients: [],
      instructions: []
    };
  }
}
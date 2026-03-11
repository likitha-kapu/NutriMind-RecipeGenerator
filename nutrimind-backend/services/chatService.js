import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function chatWithAssistant(recipeName, userMessage) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful cooking assistant. Give short, practical answers."
        },
        {
          role: "user",
          content: `
Recipe: ${recipeName}

User Question: ${userMessage}

Answer clearly and concisely.
`
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7
    });

    return completion.choices[0].message.content;

  } catch (error) {
    console.error("❌ Groq Chat failed:", error.message);
    return "Sorry, something went wrong.";
  }
}
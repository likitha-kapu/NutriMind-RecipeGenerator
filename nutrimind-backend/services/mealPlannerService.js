import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateMealPlan(days, diet) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
You are an AI meal planner.

Generate a ${days}-day meal plan.
Diet preference: ${diet || "No restriction"}.

Each day must include:
- Breakfast
- Lunch
- Dinner

Return ONLY valid JSON.
Do NOT include explanations.
Do NOT include markdown.
Do NOT include backticks.

Format:

{
  "days": [
    {
      "day": "Day 1",
      "breakfast": "Meal name",
      "lunch": "Meal name",
      "dinner": "Meal name"
    }
  ]
}
          `,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
    });

    let content = completion.choices[0].message.content;

    // 🔥 Remove markdown if present
    content = content.replace(/```json/g, "").replace(/```/g, "");

    // 🔥 Extract JSON safely
    const firstBrace = content.indexOf("{");
    const lastBrace = content.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("Invalid JSON format from AI");
    }

    const jsonString = content.substring(firstBrace, lastBrace + 1);

    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Meal planner error:", error.message);
    return null;
  }
}
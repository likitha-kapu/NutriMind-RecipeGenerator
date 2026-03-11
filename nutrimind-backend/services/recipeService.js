import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateRecipeDetails(recipeName) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional cooking assistant. Always respond in valid JSON only. Ingredients must be plain strings."
        },
        {
          role: "user",
          content: `
Generate a detailed cooking recipe for "${recipeName}".

Return ONLY JSON in this format:

{
  "title": "",
  "ingredients": [],
  "dietary_preferences": [],
  "instructions": [],
  "additional_information": {
    "tips": "",
    "variations": "",
    "serving_suggestions": "",
    "nutrition_information": ""
  }
}
`
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7
    });

    const content = completion.choices[0].message.content;

    const jsonStart = content.indexOf("{");
    const jsonEnd = content.lastIndexOf("}");
    const jsonString = content.substring(jsonStart, jsonEnd + 1);

    const parsed = JSON.parse(jsonString);

    // 🔥 SAFETY: Convert ingredient objects to strings if needed
    parsed.ingredients = parsed.ingredients.map((item) => {
      if (typeof item === "string") return item;
      if (typeof item === "object") {
        return `${item.quantity || ""} ${item.unit || ""} ${item.name || ""}`.trim();
      }
      return String(item);
    });

    // 🖼 Unlimited Unsplash Image
    parsed.image = `https://source.unsplash.com/800x600/?${encodeURIComponent(recipeName)},food`;

    return parsed;

  } catch (error) {
    console.error("❌ Groq generation failed:", error.message);
    return null;
  }
}
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

/* ==========================
   Initialize Groq Client
========================== */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ==========================
   Generate Single Recipe
========================== */
export async function generateRecipeDetails(recipeName) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional cooking assistant. Always respond in valid JSON only."
        },
        {
          role: "user",
          content: `
Generate a detailed cooking recipe for "${recipeName}".

Return ONLY JSON in this format:

{
  "title": "",
  "ingredients": ["string"],
  "dietary_preferences": ["string"],
  "instructions": ["string"],
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

    return JSON.parse(jsonString);

  } catch (error) {
    console.error("❌ Single recipe generation failed:", error.message);
    return null;
  }
}

/* ==========================
   Generate Multiple Recipes
========================== */
export async function generateMultipleRecipes(ingredients, diet) {
  try {
    const ingredientText = ingredients.join(", ");

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional chef AI. Always respond in valid JSON only."
        },
        {
          role: "user",
          content: `
Generate EXACTLY 3 different cooking recipes using these ingredients:

${ingredientText}

Diet preference: ${diet || "No specific diet"}

IMPORTANT:
- Return ONLY JSON.
- Ingredients must be plain strings.
- Do NOT return objects.
- Format like this:

[
  {
    "title": "",
    "ingredients": ["string"],
    "instructions": ["string"],
    "additional_information": {
      "tips": "",
      "variations": ""
    }
  }
]
`
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7
    });

    const content = completion.choices[0].message.content;

    const jsonStart = content.indexOf("[");
    const jsonEnd = content.lastIndexOf("]");
    const jsonString = content.substring(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonString);

  } catch (error) {
    console.error("❌ Multiple recipe generation failed:", error.message);
    return null;
  }
}
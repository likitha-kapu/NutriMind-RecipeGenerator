import fetch from "node-fetch";

/**
 * Extract valid JSON from Ollama response
 */
function extractJSON(text) {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON found in Ollama response");
  }

  return text.substring(firstBrace, lastBrace + 1);
}

/**
 * Generate recipe details using Ollama (mistral)
 */
export async function generateRecipeDetails(recipeName) {
  // ⛔ REMOVE abort controller (THIS WAS CAUSING THE ISSUE)
  // Ollama can take 30–60 seconds on CPU

  const prompt = `
Generate a detailed cooking recipe for "${recipeName}".

Respond ONLY in JSON format using EXACTLY this structure:

{
  "title": "string",
  "ingredients": ["string"],
  "dietary_preferences": ["string"],
  "instructions": ["string"],
  "additional_information": {
    "tips": "string",
    "variations": "string",
    "serving_suggestions": "string",
    "nutrition_information": "string"
  }
}
`;

  try {
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt,
        stream: false
      })
    });

    // ✅ IMPORTANT: check HTTP errors
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Ollama HTTP error ${response.status}: ${text}`);
    }

    const data = await response.json();

    console.log("🟢 RAW OLLAMA RESPONSE:\n", data.response);

    const jsonText = extractJSON(data.response);
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("❌ Ollama generation failed:", error.message);
    return null;
  }
}

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
 * Generate recipe details using Ollama (llama3)
 */
export async function generateRecipeDetails(recipeName) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000); // 20 seconds

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
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false
      })
    });

    const data = await response.json();

    console.log("RAW OLLAMA RESPONSE:\n", data.response);

    const jsonText = extractJSON(data.response);
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("❌ Ollama generation failed:", error.message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

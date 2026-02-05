import fetch from "node-fetch";

/**
 * Chat with assistant using Ollama
 */
export async function chatWithAssistant(message, recipeName) {
  const prompt = `
You are a helpful cooking assistant.

Context:
Recipe name: ${recipeName}

User question:
${message}

Reply in plain text (NOT JSON).
`;

  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral",   // fast + stable
      prompt,
      stream: false
    })
  });

  const data = await response.json();
  return data.response;
}

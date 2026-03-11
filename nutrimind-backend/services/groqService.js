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
   Health Restrictions
========================== */

const healthRestrictions = {

  Diabetes: ["sugar", "honey", "condensed milk"],

  Hypertension: ["salt", "soy sauce"],

  "High Cholesterol": [
    "butter",
    "ghee",
    "cream",
    "beef",
    "pork",
    "bacon",
    "red meat"
  ],

  "Lactose Intolerance": [
    "milk",
    "cheese",
    "butter",
    "cream"
  ],

  "Gluten Intolerance": [
    "flour",
    "wheat",
    "bread"
  ]

};

/* ==========================
   Ingredient Replacements
========================== */

const replacements = {

  sugar: "stevia",

  honey: "stevia",

  butter: "olive oil",

  ghee: "olive oil",

  cream: "coconut cream",

  milk: "almond milk",

  flour: "gluten-free flour",

  beef: "tofu",

  pork: "tofu",

  bacon: "mushroom slices",

  "red meat": "tofu"

};

/* ==========================
   Apply Health Rules
========================== */

function applyHealthRules(recipes, healthConditions) {

  if (!healthConditions || healthConditions.length === 0) {
    return recipes;
  }

  return recipes.map((recipe) => {

    let notes = [];

    recipe.ingredients = recipe.ingredients.map((ingredient) => {

      let modified = ingredient;

      for (let condition of healthConditions) {

        const restricted = healthRestrictions[condition] || [];

        restricted.forEach((item) => {

          if (ingredient.toLowerCase().includes(item)) {

            if (replacements[item]) {

              modified = replacements[item];

              notes.push(
                `${item} replaced with ${replacements[item]} because you selected ${condition}`
              );

            }

          }

        });

      }

      return modified;

    });

    recipe.health_notes = notes;

    return recipe;

  });

}

/* ==========================
   Generate Multiple Recipes
========================== */

export async function generateMultipleRecipes(
  ingredients,
  diet,
  healthConditions
) {

  try {

    const ingredientText = ingredients.join(", ");

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are a professional chef AI. Always return valid JSON only."
        },
        {
          role: "user",
          content: `
Generate EXACTLY 3 recipes using these ingredients:

${ingredientText}

Diet preference: ${diet || "None"}

Health conditions: ${healthConditions?.join(", ") || "None"}

Return STRICT JSON format:

[
{
"title":"",
"ingredients":["string"],
"instructions":["string"],
"additional_information":{
"tips":"",
"variations":""
}
}
]
`
        }
      ]
    });

    const content = completion.choices[0].message.content;

    /* SAFE JSON PARSING */

    let recipes = [];

    try {

      const start = content.indexOf("[");
      const end = content.lastIndexOf("]") + 1;

      if (start === -1 || end === -1) {
        throw new Error("JSON array not found in AI response");
      }

      const jsonString = content.slice(start, end);

      recipes = JSON.parse(jsonString);

    } catch (err) {

      console.error("⚠ JSON parsing error");
      console.error(content);

      throw new Error("Failed to parse AI recipe response");

    }

    return recipes;

  } catch (error) {

    console.error("❌ Multiple recipe generation failed:", error.message);
    return null;

  }

}
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";

const RecipeDetails = () => {
  const { recipeName } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/recipe/details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipeName: decodeURIComponent(recipeName),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // 🔴 Defensive checks (VERY IMPORTANT)
        if (!data || data.error) {
          throw new Error("Invalid recipe data");
        }

        // Normalize backend → frontend
        setRecipe({
          title: data.title || "",
          ingredients: data.ingredients || [],
          dietary_preferences: data.dietary_preferences || [],
          instructions: data.instructions || [],
          additional_information: data.additional_information || {
            tips: "",
            variations: "",
            serving_suggestions: "",
            nutrition_information: "",
          },
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Recipe fetch failed:", err);
        setError("Failed to generate recipe. Please try again.");
        setLoading(false);
      });
  }, [recipeName]);

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          Generating recipe… ⏳
        </p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <p style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
          {error}
        </p>
      </>
    );
  }

  if (!recipe) {
    return (
      <>
        <Navbar />
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          No recipe found.
        </p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: "800px", margin: "30px auto", padding: "20px" }}>
        <h1>{recipe.title}</h1>

        {/* Ingredients */}
        <h3>Ingredients</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {recipe.ingredients.map((item, idx) => (
            <span
              key={idx}
              style={{
                background: "#c8e6c9",
                padding: "6px 10px",
                borderRadius: "12px",
                fontSize: "14px",
              }}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Dietary Preferences */}
        <h3 style={{ marginTop: "20px" }}>Dietary Preferences</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          {recipe.dietary_preferences.map((tag, idx) => (
            <span
              key={idx}
              style={{
                background: "#e1bee7",
                padding: "6px 10px",
                borderRadius: "12px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Instructions */}
        <details open style={{ marginTop: "20px" }}>
          <summary
            style={{
              background: "#d0f0e0",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Instructions
          </summary>
          <ol>
            {recipe.instructions.map((step, idx) => (
              <li key={idx} style={{ margin: "10px 0" }}>
                {step}
              </li>
            ))}
          </ol>
        </details>

        {/* Additional Information */}
        <details style={{ marginTop: "20px" }}>
          <summary
            style={{
              background: "#d0f0e0",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Additional Information
          </summary>

          <p>
            <b>Tips:</b> {recipe.additional_information.tips}
          </p>
          <p>
            <b>Variations:</b> {recipe.additional_information.variations}
          </p>
          <p>
            <b>Serving Suggestions:</b>{" "}
            {recipe.additional_information.serving_suggestions}
          </p>
          <p>
            <b>Nutritional Information:</b>{" "}
            {recipe.additional_information.nutrition_information}
          </p>
        </details>
      </div>
    </>
  );
};

export default RecipeDetails;

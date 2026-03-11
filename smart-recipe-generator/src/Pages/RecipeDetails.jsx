import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import NutritionChart from "../Components/NutritionChart";

const RecipeDetails = () => {
  const { recipeName } = useParams();
  const decodedName = decodeURIComponent(recipeName);

  const [recipe, setRecipe] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ==========================
     Fetch Recipe Data
  ========================== */
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/recipe/details",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recipeName: decodedName,
            }),
          }
        );

        const data = await res.json();

        if (!data || data.error) {
          throw new Error("Invalid recipe data");
        }

        setRecipe({
          title: data.title || "",
          ingredients: data.ingredients || [],
          dietary_preferences: data.dietary_preferences || [],
          instructions: data.instructions || [],
          additional_information:
            data.additional_information || {
              tips: "",
              variations: "",
              serving_suggestions: "",
              nutrition_information: "",
            },
        });

      } catch (err) {
        console.error("Recipe fetch failed:", err);
        setError("Failed to generate recipe. Please try again.");
      }
    };

    fetchRecipe();
  }, [decodedName]);

  /* ==========================
     Fetch Image
  ========================== */
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/image/${encodeURIComponent(decodedName)}`
        );

        const data = await res.json();
        setImage(data.image);

      } catch (err) {
        console.error("Image fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [decodedName]);

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          Loading recipe… ⏳
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
          Your Recipe is being Generated.....
        </p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: "800px", margin: "30px auto", padding: "20px" }}>

        <h1>{recipe.title}</h1>

        {/* Recipe Image */}
        {image && (
          <img
            src={image}
            alt={recipe.title}
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              borderRadius: "12px",
              margin: "20px 0",
            }}
          />
        )}

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

        {/* Diet */}
        <h3 style={{ marginTop: "20px" }}>Dietary Preferences</h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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
                {typeof step === "object"
                  ? step.description
                  : step}
              </li>
            ))}
          </ol>

        </details>

        {/* Additional Info */}
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

          <p><b>Tips:</b> {recipe.additional_information.tips}</p>
          <p><b>Variations:</b> {recipe.additional_information.variations}</p>
          <p><b>Serving Suggestions:</b> {recipe.additional_information.serving_suggestions}</p>
          <p><b>Nutritional Information:</b> {recipe.additional_information.nutrition_information}</p>

        </details>

        {/* Nutrition Chart */}
        <details style={{ marginTop: "20px" }}>

          <summary
            style={{
              background: "#d0f0e0",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Nutrition Breakdown
          </summary>

          <div style={{ marginTop: "20px" }}>
            <NutritionChart ingredients={recipe.ingredients} />
          </div>

        </details>

      </div>
    </>
  );
};

export default RecipeDetails;
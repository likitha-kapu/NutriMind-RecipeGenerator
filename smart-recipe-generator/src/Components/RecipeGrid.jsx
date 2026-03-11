import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ==========================
   Health Profiles
========================== */
const healthProfiles = {
  diabetes: { idealCalories: 300 },
  heartDisease: { idealCalories: 350 },
  hypertension: { idealCalories: 300 },
  obesity: { idealCalories: 250 },
  anemia: { idealCalories: 400 },
  highCholesterol: { idealCalories: 320 },
  fever: { idealCalories: 450 },
  cold: { idealCalories: 450 },
  weightLoss: { idealCalories: 200 },
  muscleGain: { idealCalories: 600 }
};
/* ==========================
   Health Score Calculation
========================== */
const calculateHealthScore = (recipe, profile) => {

  if (!profile) return 0;

  const calorieScore =
    1 - Math.abs(recipe.calories - profile.idealCalories) /
        profile.idealCalories;

  const tagScore =
    recipe.tags?.includes("Vegetarian") ? 0.2 : 0;

  const simplicityScore =
    recipe.tags?.includes("Easy") ? 0.1 : 0;

  const finalScore =
    0.7 * calorieScore +
    tagScore +
    simplicityScore;

  return finalScore;
};
const RecipeGrid = ({ healthCondition }) => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ==========================
     Fetch Recipes
  ========================== */
  useEffect(() => {
    fetch("http://localhost:5000/api/recipes")
      .then((res) => res.json())
      .then(async (data) => {
        setRecipes(data);

        // Fetch image for each recipe
        data.forEach(async (recipe) => {
          try {
            const res = await fetch(
              `http://localhost:5000/api/image/${encodeURIComponent(
                recipe.title
              )}`
            );
            const imgData = await res.json();

            setImages((prev) => ({
              ...prev,
              [recipe.id]: imgData.image,
            }));
          } catch (err) {
            console.error(err);
          }
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch recipes:", err);
        setLoading(false);
      });
  }, []);

  /* ==========================
     Fetch Favorites
  ========================== */
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch((err) => console.error(err));
  }, [token]);

  /* ==========================
     Toggle Favorite
  ========================== */
  const toggleFavorite = async (recipe) => {
    const isFavorited = favorites.some(
      (fav) => fav.recipeId === recipe.id
    );

    try {
      if (isFavorited) {
        await fetch(
          `http://localhost:5000/api/favorites/${recipe.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFavorites((prev) =>
          prev.filter((fav) => fav.recipeId !== recipe.id)
        );
      } else {
        const res = await fetch(
          "http://localhost:5000/api/favorites",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              recipeId: recipe.id,
              title: recipe.title,
              image: images[recipe.id] || "",
              calories: recipe.calories,
              difficulty: recipe.tags?.[0] || "Easy",
            }),
          }
        );

        const newFav = await res.json();
        setFavorites((prev) => [...prev, newFav]);
      }
    } catch (error) {
      console.error("Favorite error:", error);
    }
  };

  /* ==========================
     Render
  ========================== */
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {loading && (
        <p style={{ textAlign: "center" }}>
          Loading recipes...
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
    {(healthCondition
  ? [...recipes]
      .map((recipe) => ({
        ...recipe,
        score: calculateHealthScore(
          recipe,
          healthProfiles[healthCondition]
        )
      }))
      .filter((recipe) => recipe.score > 0.4)   // add this line
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)   // optional but good
  : recipes
).map((recipe) => {
          const isFavorited = favorites.some(
            (fav) => fav.recipeId === recipe.id
          );

          return (
            <div
              key={recipe.id}
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.08)",
                background: "#f7f9f8",
                display: "flex",
                flexDirection: "column",
                transition: "0.3s",
              }}
            >
              {/* Image */}
              <img
                src={
                  images[recipe.id] ||
                  "https://images.unsplash.com/photo-1490645935967-10de6ba17061"
                }
                alt={recipe.title}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "12px" }}>
                <h3>{recipe.title}</h3>

                <p style={{ color: "#555" }}>
                  Approximately {recipe.calories} calories
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                  }}
                >
                 {recipe.tags
  ?.filter(tag =>
    ["Vegetarian", "Vegan", "Easy"].includes(tag)
  )
  .map((tag, idx) => (
    <span
      key={idx}
      style={{
        background: "#c8e6c9",
        padding: "3px 8px",
        borderRadius: "8px",
        fontSize: "12px",
      }}
    >
      {tag}
    </span>
))}
                </div>
              </div>

              {/* Bottom Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", gap: "8px" }}>
                  
                  {/* See Recipe */}
                  <button
                    onClick={() =>
                      navigate(
                        `/recipe/${encodeURIComponent(
                          recipe.title
                        )}`
                      )
                    }
                    style={{
                      background: "#1b5e20",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    See Recipe →
                  </button>

                  {/* Ask AI */}
                  <button
                    onClick={() =>
                     navigate(
  `/recipe/${encodeURIComponent(recipe.title)}/chat`
)
                    }
                    style={{
                      background: "#0d47a1",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Ask AI 🤖
                  </button>
                </div>

                {/* Favorite */}
                <div
                  onClick={() => toggleFavorite(recipe)}
                  style={{
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                >
                  {isFavorited ? "❤️" : "🤍"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecipeGrid;
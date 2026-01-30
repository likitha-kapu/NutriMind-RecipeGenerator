import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* =======================
   Category-based images
======================= */
const categoryImages = {
  vegetarian:
    "https://images.unsplash.com/photo-1540420773420-3366772f4999",

  dessert:
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af",

  mexican:
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",

  indian:
    "https://images.unsplash.com/photo-1589302168068-964664d93dc0",

  chicken:
    "https://images.unsplash.com/photo-1604908177522-402e7d1b5f2a",

  vegetables:
    "https://images.unsplash.com/photo-1540420773420-3366772f4999",

  salad:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",

  breakfast:
    "https://images.unsplash.com/photo-1506084868230-bb9d95c24759",

  default:
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
};

const getRecipeImage = (tags = []) => {
  for (let tag of tags) {
    const normalizedTag = tag.toLowerCase().replace(/[^a-z]/g, "");
    for (let key in categoryImages) {
      if (normalizedTag.includes(key)) {
        return categoryImages[key];
      }
    }
  }
  return categoryImages.default;
};

/* =======================
   RecipeGrid Component
======================= */
const RecipeGrid = () => {
  const [recipes, setRecipes] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch recipes from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/recipes")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);

        const allTags = data.flatMap((recipe) => recipe.tags || []);
        const uniqueTags = [...new Set(allTags)];
        setPopularTags(uniqueTags);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch recipes:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {/* Search */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search recipes by name, ingredient, or type..."
          style={{
            width: "60%",
            padding: "12px 20px",
            borderRadius: "50px",
            border: "1px solid #c8e6c9",
            outline: "none",
          }}
        />
        <button
          style={{
            marginLeft: "10px",
            padding: "12px 20px",
            borderRadius: "50px",
            border: "none",
            background: "#1b5e20",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* Popular Tags */}
      <div style={{ marginBottom: "20px" }}>
        {popularTags.map((tag, idx) => (
          <span
            key={idx}
            style={{
              display: "inline-block",
              margin: "4px",
              padding: "6px 12px",
              borderRadius: "20px",
              background: "#c8e6c9",
              fontSize: "14px",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading recipes...</p>}

      {/* Recipe Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              background: "#f7f9f8",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={getRecipeImage(recipe.tags)}
              alt={recipe.title}
              style={{ width: "100%", height: "180px", objectFit: "cover" }}
            />

            <div style={{ padding: "12px" }}>
              <h3>{recipe.title}</h3>
              <p style={{ color: "#555" }}>
                Approximately {recipe.calories} calories
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {recipe.tags.map((tag, idx) => (
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

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px",
              }}
            >
              <button
                onClick={() =>
                  navigate(`/recipe/${encodeURIComponent(recipe.title)}`)
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

              <span>👍 {Math.floor(Math.random() * 100)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeGrid;

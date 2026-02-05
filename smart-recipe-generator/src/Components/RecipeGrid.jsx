import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* =======================
   Category-based images
======================= */
const categoryImages = {
  vegetarian: "https://images.unsplash.com/photo-1540420773420-3366772f4999",
  dessert: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af",
  mexican: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
  indian: "https://images.unsplash.com/photo-1589302168068-964664d93dc0",
  chicken: "https://images.unsplash.com/photo-1604908177522-402e7d1b5f2a",
  vegetables: "https://images.unsplash.com/photo-1540420773420-3366772f4999",
  salad: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  breakfast: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759",
  default: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
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
  const [openMenuId, setOpenMenuId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/recipes")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        const allTags = data.flatMap((recipe) => recipe.tags || []);
        setPopularTags([...new Set(allTags)]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch recipes:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {loading && <p style={{ textAlign: "center" }}>Loading recipes...</p>}

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
              position: "relative",
            }}
          >
            <img
              src={getRecipeImage(recipe.tags)}
              alt={recipe.title}
              style={{ width: "100%", height: "180px", objectFit: "cover" }}
            />

            <div style={{ padding: "12px" }}>
              {/* Title + three dots */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <h3 style={{ margin: 0 }}>{recipe.title}</h3>

                <div
                  style={{
                    cursor: "pointer",
                    fontSize: "20px",
                    paddingLeft: "8px",
                  }}
                  onClick={() =>
                    setOpenMenuId(
                      openMenuId === recipe.id ? null : recipe.id
                    )
                  }
                >
                  ⋮
                </div>
              </div>

              {/* Dropdown menu */}
              {openMenuId === recipe.id && (
                <div
                  style={{
                    position: "absolute",
                    top: "210px",
                    right: "12px",
                    background: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      padding: "10px 14px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    onClick={() =>
                      navigate(
                        `/recipe/${encodeURIComponent(recipe.title)}/chat`
                      )
                    }
                  >
                    💬 Chat with Assistant
                  </div>
                </div>
              )}

              <p style={{ color: "#555", marginTop: "6px" }}>
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

// RecipeGrid.jsx
import React, { useState, useEffect } from "react";

// Tags (you can expand later)
const tags = [
  "vegetarian", "gluten-free", "savory", "healthy", "spicy",
  "protein", "vegan", "breakfast", "quick", "garlic",
  "easy", "dinner", "chicken", "tomato", "dessert",
  "almond", "sweet", "indian", "creamy", "salad"
];

// Generate placeholder recipes
const generateRecipes = (startId = 0, count = 12) => {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i + 1,
    name: `Recipe ${startId + i + 1}`,
    image: `https://picsum.photos/400/300?random=${startId + i + 10}`,
    calories: 250 + (startId + i) * 10,
    tags: ["Healthy", "Quick"],
    likes: Math.floor(Math.random() * 100),
  }));
};

const RecipeGrid = () => {
  const [recipes, setRecipes] = useState(generateRecipes());
  const [page, setPage] = useState(1);

  // Infinite scroll
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 500
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (page === 1) return;
    const newRecipes = generateRecipes(recipes.length, 12);
    setRecipes((prev) => [...prev, ...newRecipes]);
  }, [page]);

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
        {tags.map((tag, idx) => (
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

      {/* Sort buttons */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <button
          style={{
            padding: "8px 16px",
            marginRight: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Most Recent
        </button>
        <button
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#1b5e20",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Most Popular
        </button>
      </div>

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
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={recipe.image}
              alt={recipe.name}
              style={{ width: "100%", height: "180px", objectFit: "cover" }}
            />
            <div style={{ padding: "12px" }}>
              <h3 style={{ margin: "0 0 8px 0" }}>{recipe.name}</h3>
              <p style={{ margin: "0 0 8px 0", color: "#555" }}>
                {recipe.calories} calories
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
                      fontWeight: "500",
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
                alignItems: "center",
                padding: "0 12px 12px 12px",
              }}
            >
              <button
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
              <span>👍 {recipe.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeGrid;

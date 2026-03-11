import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "./AIResult.css";

const AIResult = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState(null);
  const [image, setImage] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const token = localStorage.getItem("token");

  /* ==========================
     Fetch AI Recipe
  ========================== */
  useEffect(() => {
    const fetchAssistant = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: query })
        });

        const data = await res.json();
        setRecipe(data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    if (query) fetchAssistant();
  }, [query]);

  /* ==========================
     Fetch Image
  ========================== */
  useEffect(() => {
    if (!recipe?.title) return;

    const fetchImage = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/image/${encodeURIComponent(recipe.title)}`
        );
        const data = await res.json();
        setImage(data.image);
      } catch (err) {
        console.error("Image fetch error:", err);
      }
    };

    fetchImage();
  }, [recipe]);

  /* ==========================
     Load Favorites
  ========================== */
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/favorites", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setFavorites(data.map(item => item.recipeId));
      })
      .catch(err => console.error(err));
  }, [token]);

  /* ==========================
     Toggle Favorite
  ========================== */
  const toggleFavorite = async () => {
    if (!token) {
      alert("Please login first");
      return;
    }

    const isFav = favorites.includes(recipe.title);

    try {
      if (isFav) {
        await fetch(
          `http://localhost:5000/api/favorites/${recipe.title}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setFavorites(favorites.filter(id => id !== recipe.title));
      } else {
        await fetch("http://localhost:5000/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            recipeId: recipe.title,
            title: recipe.title,
            image: image,
            calories: "Custom",
            difficulty: "AI Generated"
          })
        });

        setFavorites([...favorites, recipe.title]);
      }
    } catch (error) {
      console.error("Favorite error:", error);
    }
  };

  const isFav = favorites.includes(recipe?.title);

  return (
    <>
      <Navbar />

      <div className="ai-layout">

        {/* LEFT SIDE - Chat */}
        <div className="ai-left">
          <div className="user-message">
            {query}
          </div>

          <div className="ai-message">
            {loading
              ? "Thinking..."
              : recipe?.description || "Recipe generated successfully!"}
          </div>
        </div>

        {/* RIGHT SIDE - Recipe */}
        <div className="ai-right">
          {loading ? (
            <h2>Generating recipe...</h2>
          ) : recipe ? (
            <div className="recipe-box">

              {/* 🔥 Image + Favorite */}
              {image && (
                <div style={{ position: "relative" }}>
                  <img
                    src={image}
                    alt={recipe.title}
                    style={{
                      width: "100%",
                      height: "250px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      marginBottom: "15px"
                    }}
                  />

                  <div
                    onClick={toggleFavorite}
                    style={{
                      position: "absolute",
                      top: "15px",
                      right: "15px",
                      fontSize: "24px",
                      cursor: "pointer"
                    }}
                  >
                    {isFav ? "❤️" : "🤍"}
                  </div>
                </div>
              )}

              <h2 className="recipe-title">{recipe.title}</h2>

              <p className="recipe-description">
                {recipe.description}
              </p>

              <div className="recipe-section">
                <h3>Ingredients</h3>
                <ul>
                  {recipe.ingredients?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="recipe-section">
                <h3>Instructions</h3>
                <ol>
                  {recipe.instructions?.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

            </div>
          ) : (
            <h2>No recipe found</h2>
          )}
        </div>
      </div>
    </>
  );
};

export default AIResult;
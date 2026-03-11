import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "./GeneratedRecipes.css";
import NutritionChart from "../Components/NutritionChart";

const GeneratedRecipes = () => {

  const location = useLocation();

  const { recipes, ingredients, diet, health } = location.state || {};

  const [favorites, setFavorites] = useState([]);
  const [images, setImages] = useState({});

  const token = localStorage.getItem("token");

  /* ===============================
     Fetch Recipe Images
  =============================== */

  useEffect(() => {

    if (!recipes) return;

    recipes.forEach(async (recipe) => {

      try {

        const res = await fetch(
          `http://localhost:5000/api/image/${encodeURIComponent(recipe.title)}`
        );

        const imgData = await res.json();

        setImages((prev) => ({
          ...prev,
          [recipe.title]: imgData.image
        }));

      } catch (err) {
        console.error(err);
      }

    });

  }, [recipes]);

  /* ===============================
     Load Favorites
  =============================== */

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

  /* ===============================
     Toggle Favorite
  =============================== */

  const toggleFavorite = async (recipe) => {

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
            image: images[recipe.title] || ""
          })
        });

        setFavorites([...favorites, recipe.title]);

      }

    } catch (error) {
      console.error("Favorite error:", error);
    }

  };

  if (!recipes) {
    return (
      <>
        <Navbar />
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          No recipes found.
        </p>
      </>
    );
  }

  return (

    <>
      <Navbar />

      <div className="generated-container">

        {/* SUMMARY */}

        <div className="summary-box">

          <h2>Submit Your Recipe Choices</h2>

          <p className="summary-sub">
            Here's a recap of your choices.
          </p>

          <div className="section-title">Ingredients:</div>

          <div className="chips">
            {ingredients.map((item, i) => (
              <span key={i} className="chip">
                {item}
              </span>
            ))}
          </div>

          <div className="section-title">Diet Preference:</div>

          {diet && (
            <span className="chip diet-chip">
              ⚡ {diet}
            </span>
          )}

          <div className="section-title">Health Conditions:</div>

          <div className="chips">
            {health && health.length > 0 ? (
              health.map((item, i) => (
                <span key={i} className="chip health-chip">
                  {item}
                </span>
              ))
            ) : (
              <span>None</span>
            )}
          </div>

        </div>

        {/* RECIPES */}

        <div className="recipes-grid">

          {recipes.map((recipe, index) => {

            const isFav = favorites.includes(recipe.title);

            return (

              <div key={index} className="recipe-card">

                {/* IMAGE */}

                <img
                  src={
                    images[recipe.title] ||
                    "https://images.unsplash.com/photo-1490645935967-10de6ba17061"
                  }
                  alt={recipe.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "15px"
                  }}
                />

                {/* HEADER */}

                <div className="recipe-header">

                  <div className="recipe-title">
                    {recipe.title}
                  </div>

                  <div
                    className={`favorite-icon ${isFav ? "active" : ""}`}
                    onClick={() => toggleFavorite(recipe)}
                  >
                    {isFav ? "❤️" : "🤍"}
                  </div>

                </div>

                {/* INGREDIENTS */}

                <div className="section-title">Ingredients:</div>

                <div className="chips ingredients-list">
                  {recipe.ingredients.map((ing, i) => (
                    <span key={i} className="chip">
                      {ing}
                    </span>
                  ))}
                </div>

                {/* DIET */}

                {diet && (
                  <>
                    <div className="section-title">
                      Dietary Preference:
                    </div>

                    <span className="chip diet-chip">
                      {diet}
                    </span>
                  </>
                )}

                {/* HEALTH */}

                <div className="section-title">Health Conditions:</div>

                <div className="chips">
                  {health && health.length > 0 ? (
                    health.map((item, i) => (
                      <span key={i} className="chip health-chip">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span>None</span>
                  )}
                </div>

                {/* INSTRUCTIONS */}

                <details>
                  <summary>Instructions</summary>

                  <ol className="instructions-list">
                    {recipe.instructions.map((step, i) => (
                      <li key={i}>
                        {typeof step === "string"
                          ? step
                          : step.description
                          ? `Step ${step.step}: ${step.description}`
                          : JSON.stringify(step)
                        }
                      </li>
                    ))}
                  </ol>

                </details>

                {/* ADDITIONAL INFO */}

                <details>
                  <summary>Additional Information</summary>

                  <p style={{ marginTop: "8px" }}>
                    <strong>Tips:</strong>{" "}
                    {recipe.additional_information?.tips}
                  </p>

                  <p>
                    <strong>Variations:</strong>{" "}
                    {recipe.additional_information?.variations}
                  </p>

                </details>

                {/* NUTRITION DROPDOWN */}

                <details className="nutrition-dropdown">

                  <summary>Nutrition Breakdown</summary>

                  <div style={{ marginTop: "15px" }}>
                    <NutritionChart ingredients={recipe.ingredients} />
                  </div>

                </details>

              </div>

            );

          })}

        </div>

      </div>

    </>
  );

};

export default GeneratedRecipes;
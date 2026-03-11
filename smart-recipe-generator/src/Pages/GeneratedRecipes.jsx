import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "./GeneratedRecipes.css";
import NutritionChart from "../Components/NutritionChart";
import RecommendationCard from "../Components/RecommendationCard";

const GeneratedRecipes = () => {

  const location = useLocation();

  const { recipes, ingredients, diet, health } = location.state || {};

  const [favorites, setFavorites] = useState([]);
  const [images, setImages] = useState({});
  const [recommendations, setRecommendations] = useState([]);

  const recipeRefs = useRef({});

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
     Fetch Recommendations
  =============================== */

  useEffect(() => {

    const fetchRecommendations = async () => {

      try {

        const res = await fetch(
          "http://localhost:5000/api/recommendations/demoUser"
        );

        const data = await res.json();

        console.log("Recommendations:", data);

        if (data.recommendations) {
          setRecommendations(data.recommendations);
        }

      } catch (error) {

        console.error("Recommendation fetch error:", error);

      }

    };

    fetchRecommendations();

  }, []);

  /* ===============================
     Scroll To Focused Recipe
  =============================== */

  useEffect(() => {

    if (location.state?.focusRecipe) {

      const recipeTitle = location.state.focusRecipe;

      const element = recipeRefs.current[recipeTitle];

      if (element) {

        element.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    }

  }, [recipes]);

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
              <span key={i} className="chip">{item}</span>
            ))}
          </div>

          {diet && (
            <>
              <div className="section-title">Diet Preference:</div>
              <span className="chip diet-chip">⚡ {diet}</span>
            </>
          )}

          <div className="section-title">Health Conditions:</div>

          <div className="chips">
            {health && health.length > 0 ? (
              health.map((item, i) => (
                <span key={i} className="chip health-chip">{item}</span>
              ))
            ) : (
              <span>None</span>
            )}
          </div>

        </div>

        {/* GENERATED RECIPES */}

        <div className="recipes-grid">

          {recipes.map((recipe, index) => {

            const isFav = favorites.includes(recipe.title);

            return (

              <div
                key={index}
                className="recipe-card"
                ref={(el) => (recipeRefs.current[recipe.title] = el)}
              >

                <img
                  src={
                    images[recipe.title] ||
                    "https://images.unsplash.com/photo-1490645935967-10de6ba17061"
                  }
                  alt={recipe.title}
                  className="recipe-image"
                />

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
                    <span key={i} className="chip">{ing}</span>
                  ))}
                </div>

                {/* INSTRUCTIONS */}

                <details>
                  <summary>Instructions</summary>

                  <ol className="instructions-list">
                    {recipe.instructions.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>

                </details>

                {/* ADDITIONAL INFORMATION */}

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

                {/* NUTRITION */}

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

        {/* RECOMMENDATIONS */}

        {recommendations.length > 0 && (

          <div className="recommendation-section">

            <h2>You may also like</h2>

            <div className="recommendation-grid">

              {recommendations
                .flatMap((rec) => rec.recipes || [])
                .map((recipe, index) => (

                  <RecommendationCard
                    key={index}
                    recipe={recipe}
                  />

              ))}

            </div>

          </div>

        )}

      </div>

    </>
  );

};

export default GeneratedRecipes;
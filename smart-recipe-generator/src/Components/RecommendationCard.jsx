import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecommendationCard.css";

const RecommendationCard = ({ recipe }) => {

  const navigate = useNavigate();
  const [image, setImage] = useState("");

  /* Fetch Image */

  useEffect(() => {

    if (!recipe?.title) return;

    const fetchImage = async () => {

      try {

        const res = await fetch(
          `http://localhost:5000/api/image/${encodeURIComponent(recipe.title)}`
        );

        const data = await res.json();

        setImage(data.image);

      } catch (error) {

        console.error("Image fetch error:", error);

      }

    };

    fetchImage();

  }, [recipe]);

  /* Navigate to recipe */

  const handleClick = () => {

    navigate("/generated-recipes", {
      state: {
        recipes: [recipe],
        ingredients: recipe.ingredients || [],
        diet: "",
        health: [],
        focusRecipe: recipe.title
      }
    });

  };

  return (

    <div
      className="recommendation-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >

      <img
        src={
          image ||
          "https://images.unsplash.com/photo-1490645935967-10de6ba17061"
        }
        alt={recipe.title}
        className="recommendation-image"
      />

      <div className="recommendation-content">

        {/* Only Title */}

        <h4>{recipe.title}</h4>

      </div>

    </div>

  );

};

export default RecommendationCard;
// src/Components/RecipeCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  const handleSeeRecipe = () => {
    navigate(`/recipe/${encodeURIComponent(recipe.title)}`);
  };

  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.title} />

      <div className="recipe-info">
        <h3>{recipe.title}</h3>
        <p>{recipe.calories} calories</p>

        <div className="tags">
          {recipe.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="actions">
          <button className="see-recipe" onClick={handleSeeRecipe}>
            See Recipe →
          </button>

          <div className="likes">👍 {Math.floor(Math.random() * 100)}</div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;

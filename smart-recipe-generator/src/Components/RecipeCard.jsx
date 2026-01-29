// src/Components/RecipeCard.jsx
import React from "react";

const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.name} />
      <div className="recipe-info">
        <h3>{recipe.name}</h3>
        <p>{recipe.calories} calories</p>
        <div className="tags">
          {recipe.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
        <div className="actions">
          <button className="see-recipe">See Recipe →</button>
          <div className="likes">👍 {recipe.likes}</div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;

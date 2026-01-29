import React, { useState } from "react";
import "./CreateRecipes.css";

const ingredientsList = [
  "Agave", "Agua", "All purpose flour", "Almidon de maiz", "Almond",
  "Almond flour", "Aloo", "Amul butter", "Anchovies", "Apple Cider", "Apples"
];

function CreateRecipes() {
  const [activeStep, setActiveStep] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState("");

  const filteredIngredients = ingredientsList
    .filter((ing) => ing.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort();

  const toggleStep = (step) => {
    setActiveStep(activeStep === step ? null : step);
  };

  return (
    <div className="create-recipes-container">
      {/* Step 1 */}
      <div className="accordion-card">
        <div className="accordion-header" onClick={() => toggleStep(1)}>
          <h3>Step 1: Choose Ingredients</h3>
          <span>{activeStep === 1 ? "▲" : "▼"}</span>
        </div>
        {activeStep === 1 && (
          <div className="accordion-body">
            <button className="add-ingredient-btn">+ Add New Ingredient</button>
            <div className="ingredient-dropdown">
              <input
                type="text"
                placeholder="Select an existing ingredient"
                value={selectedIngredient || searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setDropdownOpen(true);
                  setSelectedIngredient("");
                }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="ingredient-input"
              />
              {dropdownOpen && (
                <ul className="ingredient-list">
                  {filteredIngredients.map((item, idx) => (
                    <li
                      key={idx}
                      className="ingredient-item"
                      onClick={() => {
                        setSelectedIngredient(item);
                        setDropdownOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      {item}
                    </li>
                  ))}
                  {filteredIngredients.length === 0 && (
                    <li className="ingredient-item disabled">No results found</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Step 2 */}
      <div className="accordion-card">
        <div className="accordion-header" onClick={() => toggleStep(2)}>
          <h3>Step 2: Choose Diet</h3>
          <span>{activeStep === 2 ? "▲" : "▼"}</span>
        </div>
        {activeStep === 2 && <div className="accordion-body">Diet options will go here</div>}
      </div>

      {/* Step 3 */}
      <div className="accordion-card">
        <div className="accordion-header" onClick={() => toggleStep(3)}>
          <h3>Step 3: Review and Create Recipes</h3>
          <span>{activeStep === 3 ? "▲" : "▼"}</span>
        </div>
        {activeStep === 3 && <div className="accordion-body">Review & generate recipes here</div>}
      </div>
    </div>
  );
}

export default CreateRecipes;

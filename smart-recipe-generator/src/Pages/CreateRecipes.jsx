import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import "./CreateRecipes.css";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
const ingredientOptions = [
  "Chicken", "Fish", "Egg", "Onion", "Tomato", "Rice", "Paneer",
  "Potato", "Carrot", "Capsicum", "Garlic", "Ginger", "Mushroom",
  "Spinach", "Cabbage", "Broccoli", "Cauliflower", "Corn",
  "Cheese", "Milk", "Butter", "Yogurt", "Cream",
  "Beef", "Pork", "Tofu", "Lentils", "Chickpeas",
  "Beans", "Peas", "Avocado", "Cucumber", "Lemon",
  "Chili", "Turmeric", "Salt", "Pepper", "Sugar",
  "Honey", "Olive Oil"
];

const dietOptions = ["Keto", "Vegetarian", "Vegan", "High Protein"];

const CreateRecipes = () => {
  const navigate = useNavigate();

  const [openStep, setOpenStep] = useState(1);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedDiet, setSelectedDiet] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ==========================
     SPEECH TO INGREDIENTS
  ========================== */
  const handleVoiceInput = () => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      const spokenIngredients = transcript
        .split(/,|and/)
        .map(item => item.trim())
        .filter(item => item.length > 0);

      let newIngredients = [...selectedIngredients];

      spokenIngredients.forEach((ingredient) => {
        if (
          !newIngredients.includes(ingredient) &&
          newIngredients.length < 10
        ) {
          newIngredients.push(ingredient);
        }
      });

      setSelectedIngredients(newIngredients);
    };

    recognition.onerror = () => {
      alert("Voice recognition failed. Try again.");
    };
  };

  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(
        selectedIngredients.filter((item) => item !== ingredient)
      );
    } else {
      if (selectedIngredients.length < 10) {
        setSelectedIngredients([...selectedIngredients, ingredient]);
      }
    }
  };

  const handleAddCustomIngredient = () => {
    const trimmed = searchTerm.trim();
    if (
      trimmed &&
      !selectedIngredients.includes(trimmed) &&
      selectedIngredients.length < 10
    ) {
      setSelectedIngredients([...selectedIngredients, trimmed]);
      setSearchTerm("");
      setShowDropdown(false);
    }
  };

  const filteredIngredients = ingredientOptions.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const progress = (selectedIngredients.length / 10) * 100;

  /* ==========================
     HANDLE GENERATE RECIPES
  ========================== */
  const handleGenerateRecipes = async () => {
    if (selectedIngredients.length === 0) {
      alert("Please select at least one ingredient.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/recipe/generate-multiple",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ingredients: selectedIngredients,
            diet: selectedDiet,
          }),
        }
      );

      const data = await res.json();

      if (!data.recipes) {
        alert("Failed to generate recipes.");
        setLoading(false);
        return;
      }

      navigate("/generated-recipes", {
        state: {
          recipes: data.recipes,
          ingredients: selectedIngredients,
          diet: selectedDiet,
        },
      });

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="create-recipes-container">

        {/* STEP 1 */}
        <div className="accordion-card">
          <div
            className="accordion-header"
            onClick={() => setOpenStep(openStep === 1 ? null : 1)}
          >
            <h3>Step 1: Choose Ingredients</h3>
            <span>{openStep === 1 ? "▲" : "▼"}</span>
          </div>

          {openStep === 1 && (
            <div className="accordion-body">

              {/* VOICE INPUT BUTTON */}
              <button
                className="add-ingredient-btn"
                onClick={handleVoiceInput}
              >
                🎤 Speak Ingredients
              </button>

              <div className="ingredient-dropdown">
                <input
                  type="text"
                  className="ingredient-input"
                  placeholder="Search or type ingredient..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddCustomIngredient();
                    }
                  }}
                />

                {showDropdown && searchTerm && (
                  <ul className="ingredient-list">
                    {filteredIngredients.length > 0 ? (
                      filteredIngredients.map((item, index) => (
                        <li
                          key={index}
                          className={`ingredient-item ${
                            selectedIngredients.includes(item)
                              ? "disabled"
                              : ""
                          }`}
                          onClick={() => {
                            toggleIngredient(item);
                            setSearchTerm("");
                            setShowDropdown(false);
                          }}
                        >
                          {item}
                        </li>
                      ))
                    ) : (
                      <li
                        className="ingredient-item"
                        onClick={handleAddCustomIngredient}
                      >
                        ➕ Add "{searchTerm}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              {/* Progress */}
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p style={{ textAlign: "right", marginTop: "5px" }}>
                  {selectedIngredients.length}/10 ingredients selected
                </p>
              </div>

              <div className="selected-ingredients-text">
                Selected Ingredients:
              </div>

              <div className="selected-chips">
                {selectedIngredients.map((item, index) => (
                  <span
                    key={index}
                    className="selected-chip"
                    onClick={() => toggleIngredient(item)}
                  >
                    {item} ×
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* STEP 2 */}
        <div className="accordion-card">
          <div
            className="accordion-header"
            onClick={() => setOpenStep(openStep === 2 ? null : 2)}
          >
            <h3>Step 2: Choose Diet</h3>
            <span>{openStep === 2 ? "▲" : "▼"}</span>
          </div>

          {openStep === 2 && (
            <div className="accordion-body">
              <div className="diet-options">
                {dietOptions.map((diet, index) => (
                  <button
                    key={index}
                    className={`diet-button ${
                      selectedDiet === diet ? "active" : ""
                    }`}
                    onClick={() => setSelectedDiet(diet)}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* STEP 3 */}
        <div className="accordion-card">
          <div
            className="accordion-header"
            onClick={() => setOpenStep(openStep === 3 ? null : 3)}
          >
            <h3>Step 3: Review and Create Recipes</h3>
            <span>{openStep === 3 ? "▲" : "▼"}</span>
          </div>

          {openStep === 3 && (
            <div className="accordion-body">
              <div className="review-box">
                <h2>Review Your Selections</h2>

                <p>
                  <strong>{selectedIngredients.length}</strong> Ingredients:
                </p>

                <div className="selected-chips">
                  {selectedIngredients.map((item, index) => (
                    <span key={index} className="selected-chip">
                      {item}
                    </span>
                  ))}
                </div>

                <p style={{ marginTop: "15px" }}>
                  <strong>Dietary Preference:</strong>
                </p>

                {selectedDiet && (
                  <span className="diet-chip">⚡ {selectedDiet}</span>
                )}

                <div className="review-actions">
                  <button
                    className="edit-btn"
                    onClick={() => setOpenStep(1)}
                  >
                    ✏ Edit
                  </button>

                  <button
                    className="create-btn"
                    onClick={handleGenerateRecipes}
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Create Recipes →"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
      <Footer />
    </>
  );
};

export default CreateRecipes;
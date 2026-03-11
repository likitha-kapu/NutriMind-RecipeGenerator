import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import "./CreateRecipes.css";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";

const ingredientOptions = [
  "Chicken","Fish","Egg","Onion","Tomato","Rice","Paneer",
  "Potato","Carrot","Capsicum","Garlic","Ginger","Mushroom",
  "Spinach","Cabbage","Broccoli","Cauliflower","Corn",
  "Cheese","Milk","Butter","Yogurt","Cream",
  "Beef","Pork","Tofu","Lentils","Chickpeas",
  "Beans","Peas","Avocado","Cucumber","Lemon",
  "Chili","Turmeric","Salt","Pepper","Sugar",
  "Honey","Olive Oil"
];

const dietOptions = ["Keto","Vegetarian","Vegan","High Protein"];

const healthOptions = [
  "Diabetes",
  "Hypertension",
  "High Cholesterol",
  "Lactose Intolerance",
  "Gluten Intolerance"
];

const CreateRecipes = () => {

  const navigate = useNavigate();

  const [openStep,setOpenStep] = useState(1);

  const [selectedIngredients,setSelectedIngredients] = useState([]);
  const [selectedDiet,setSelectedDiet] = useState("");
  const [selectedHealth,setSelectedHealth] = useState([]);

  const [searchTerm,setSearchTerm] = useState("");
  const [showDropdown,setShowDropdown] = useState(false);
  const [loading,setLoading] = useState(false);

  /* ================= SPEECH INPUT ================= */

  const handleVoiceInput = () => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if(!SpeechRecognition){
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event)=>{

      const transcript = event.results[0][0].transcript;

      const spokenIngredients = transcript
        .split(/,|and/)
        .map(i=>i.trim())
        .filter(i=>i.length>0);

      let newIngredients = [...selectedIngredients];

      spokenIngredients.forEach((ingredient)=>{

        if(!newIngredients.includes(ingredient) && newIngredients.length < 10){
          newIngredients.push(ingredient);
        }

      });

      setSelectedIngredients(newIngredients);
    };

    recognition.onerror = ()=>{
      alert("Voice recognition failed. Try again.");
    };
  };

  /* ================= INGREDIENT TOGGLE ================= */

  const toggleIngredient = (ingredient)=>{

    if(selectedIngredients.includes(ingredient)){

      setSelectedIngredients(
        selectedIngredients.filter(i=>i!==ingredient)
      );

    }else{

      if(selectedIngredients.length < 10){
        setSelectedIngredients([...selectedIngredients,ingredient]);
      }

    }

  };

  /* ================= HEALTH TOGGLE ================= */

  const toggleHealth = (condition)=>{

    if(selectedHealth.includes(condition)){

      setSelectedHealth(
        selectedHealth.filter(c=>c!==condition)
      );

    }else{

      setSelectedHealth([...selectedHealth,condition]);

    }

  };

  /* ================= ADD CUSTOM INGREDIENT ================= */

  const handleAddCustomIngredient = ()=>{

    const trimmed = searchTerm.trim();

    if(
      trimmed &&
      !selectedIngredients.includes(trimmed) &&
      selectedIngredients.length < 10
    ){
      setSelectedIngredients([...selectedIngredients,trimmed]);
      setSearchTerm("");
      setShowDropdown(false);
    }

  };

  const filteredIngredients = ingredientOptions.filter((item)=>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const progress = (selectedIngredients.length / 10) * 100;

  /* ================= GENERATE RECIPES ================= */

  const handleGenerateRecipes = async ()=>{

    if(selectedIngredients.length === 0){
      alert("Please select at least one ingredient.");
      return;
    }

    setLoading(true);

    try{

      const res = await fetch(
        "http://localhost:5000/api/recipe/generate-multiple",
        {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({
            ingredients:selectedIngredients,
            diet:selectedDiet,
            healthConditions:selectedHealth
          })
        }
      );

      const data = await res.json();

      if(!data.recipes){
        alert("Failed to generate recipes.");
        setLoading(false);
        return;
      }

      navigate("/generated-recipes",{
        state:{
          recipes:data.recipes,
          ingredients:selectedIngredients,
          diet:selectedDiet,
          health:selectedHealth
        }
      });

    }catch(error){
      console.error(error);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div className="create-recipes-container">

      {/* STEP 1 INGREDIENTS */}

      <div className="accordion-card">

      <div
        className="accordion-header"
        onClick={()=>setOpenStep(openStep===1 ? null : 1)}
      >
        <h3>Step 1: Choose Ingredients</h3>
        <span>{openStep===1 ? "▲" : "▼"}</span>
      </div>

      {openStep===1 && (

      <div className="accordion-body">

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
        onChange={(e)=>{
          setSearchTerm(e.target.value);
          setShowDropdown(true);
        }}
        onKeyDown={(e)=>{
          if(e.key==="Enter"){
            handleAddCustomIngredient();
          }
        }}
      />

      {showDropdown && searchTerm && (

      <ul className="ingredient-list">

      {filteredIngredients.length>0 ? (

      filteredIngredients.map((item,index)=>(
        <li
          key={index}
          className={`ingredient-item ${
            selectedIngredients.includes(item)
            ?"disabled"
            :""
          }`}
          onClick={()=>{
            toggleIngredient(item);
            setSearchTerm("");
            setShowDropdown(false);
          }}
        >
          {item}
        </li>
      ))

      ):(
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

      <div className="progress-container">
      <div className="progress-bar">
      <div
        className="progress-fill"
        style={{width:`${progress}%`}}
      ></div>
      </div>

      <p style={{textAlign:"right"}}>
        {selectedIngredients.length}/10 ingredients selected
      </p>
      </div>

      <div className="selected-chips">

      {selectedIngredients.map((item,index)=>(
      <span
        key={index}
        className="selected-chip"
        onClick={()=>toggleIngredient(item)}
      >
        {item} ×
      </span>
      ))}

      </div>

      </div>

      )}

      </div>

      {/* STEP 2 DIET */}

      <div className="accordion-card">

      <div
        className="accordion-header"
        onClick={()=>setOpenStep(openStep===2 ? null : 2)}
      >
        <h3>Step 2: Choose Diet</h3>
        <span>{openStep===2 ? "▲" : "▼"}</span>
      </div>

      {openStep===2 && (

      <div className="accordion-body">

      <div className="diet-options">

      {dietOptions.map((diet,index)=>(
      <button
        key={index}
        className={`diet-button ${
          selectedDiet===diet ? "active" : ""
        }`}
        onClick={()=>setSelectedDiet(diet)}
      >
        {diet}
      </button>
      ))}

      </div>

      </div>

      )}

      </div>

      {/* STEP 3 HEALTH CONDITIONS */}

      <div className="accordion-card">

      <div
        className="accordion-header"
        onClick={()=>setOpenStep(openStep===3 ? null : 3)}
      >
        <h3>Step 3: Health Conditions</h3>
        <span>{openStep===3 ? "▲" : "▼"}</span>
      </div>

      {openStep===3 && (

      <div className="accordion-body">

      <div className="diet-options">

      {healthOptions.map((condition,index)=>(
      <button
        key={index}
        className={`diet-button ${
          selectedHealth.includes(condition) ? "active" : ""
        }`}
        onClick={()=>toggleHealth(condition)}
      >
        {condition}
      </button>
      ))}

      </div>

      </div>

      )}

      </div>

      {/* STEP 4 REVIEW */}

      <div className="accordion-card">

      <div
        className="accordion-header"
        onClick={()=>setOpenStep(openStep===4 ? null : 4)}
      >
        <h3>Step 4: Review and Create Recipes</h3>
        <span>{openStep===4 ? "▲" : "▼"}</span>
      </div>

      {openStep===4 && (

      <div className="accordion-body">

      <div className="review-box">

      <h2>Review Your Selections</h2>

      <p><strong>Ingredients:</strong></p>

      <div className="selected-chips">
      {selectedIngredients.map((item,index)=>(
      <span key={index} className="selected-chip">
      {item}
      </span>
      ))}
      </div>

      <p><strong>Diet:</strong></p>
      {selectedDiet && (
      <span className="diet-chip">{selectedDiet}</span>
      )}

      <p><strong>Health Conditions:</strong></p>

      <div className="selected-chips">
      {selectedHealth.length===0
        ? "None"
        : selectedHealth.map((item,index)=>(
            <span key={index} className="selected-chip">
              {item}
            </span>
          ))
      }
      </div>

      <div className="review-actions">

      <button
        className="edit-btn"
        onClick={()=>setOpenStep(1)}
      >
        ← Edit
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

      <Footer/>

    </>
  );
};

export default CreateRecipes;
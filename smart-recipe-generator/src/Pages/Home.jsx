import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import RecipeGrid from "../Components/RecipeGrid";
import "./Home.css";
import Footer from "../Components/Footer";
const Home = () => {
  const [message, setMessage] = useState("");
  const [healthCondition, setHealthCondition] = useState(null);
  const navigate = useNavigate();

  const handleSend = () => {
    if (!message.trim()) return;

    navigate(`/ai-result?q=${encodeURIComponent(message)}`);
  };

  return (
    <div>
      <Navbar />

      <div className="home-hero">
        <h1>Ask Your AI Cooking Assistant 🍳</h1>
        <p>Get instant recipe ideas and cooking help</p>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask something like 'Give me keto dinner ideas...'"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button onClick={handleSend}>➤</button>
        </div>
      </div>
<div className="health-section">
  <h2 className="health-title">Health-Based Recipes</h2>

  <div className="health-buttons">

    <button
      className="health-btn all-btn"
      onClick={() => setHealthCondition(null)}
    >
      All Recipes
    </button>

    {[
      "diabetes",
      "heartDisease",
      "hypertension",
      "obesity",
      "anemia",
      "highCholesterol",
      "fever",
      "cold",
      "weightLoss",
      "muscleGain"
    ].map((condition) => (
      <button
        key={condition}
        className="health-btn"
        onClick={() => setHealthCondition(condition)}
      >
        {condition}
      </button>
    ))}
    
  </div>
</div>
      <RecipeGrid healthCondition={healthCondition} />
      <Footer />
    </div>
  );
};

export default Home;
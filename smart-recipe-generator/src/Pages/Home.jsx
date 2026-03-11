import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import RecipeGrid from "../Components/RecipeGrid";
import "./Home.css";
import Footer from "../Components/Footer";
const Home = () => {
  const [message, setMessage] = useState("");
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

      <RecipeGrid />
      <Footer />
    </div>
  );
};

export default Home;
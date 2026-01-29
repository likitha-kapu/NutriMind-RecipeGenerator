import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-nav">
        <h2 className="logo">Smart Recipe Generator</h2>
        <button
          className="login-btn"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <h1>Cook Smarter with AI 🍳</h1>
        <p>
          Enter the ingredients you have at home and let AI create
          delicious recipes just for you ✨
        </p>

        <div className="hero-buttons">
          <button
            className="primary-btn"
            onClick={() => navigate("/login")}
          >
            Get Started →
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

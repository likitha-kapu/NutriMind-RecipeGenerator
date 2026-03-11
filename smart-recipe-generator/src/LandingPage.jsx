import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">

      {/* NAVBAR */}
      <nav className="landing-nav">
        <h2 className="logo">🍽 NutriMind</h2>

        <div className="nav-buttons">
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <h1>Cook Smarter with AI 🍳</h1>

        <p>
          Generate delicious recipes, meal plans and nutrition insights
          instantly using Artificial Intelligence.
        </p>

        <div className="hero-buttons">
          <button
            className="primary-btn"
            onClick={() => navigate("/login")}
          >
            Get Started →
          </button>

          
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">

        <h2>Powerful AI Features</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Recipe Generator</h3>
            <p>
              Enter your ingredients and instantly generate delicious
              recipes powered by AI.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Meal Planner</h3>
            <p>
              Automatically generate personalized weekly meal plans
              based on your goals.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🥗</div>
            <h3>Nutrition Insights</h3>
            <p>
              Analyze calories, proteins, fats and carbs for a healthier
              lifestyle.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">

        <h2>How NutriMind Works</h2>

        <div className="steps">

          <div className="step">
            <span>1</span>
            <h4>Add Ingredients</h4>
            <p>Tell the AI what ingredients you have at home.</p>
          </div>

          <div className="step">
            <span>2</span>
            <h4>AI Generates Recipes</h4>
            <p>Our AI instantly creates delicious recipes.</p>
          </div>

          <div className="step">
            <span>3</span>
            <h4>Cook & Enjoy</h4>
            <p>Follow the instructions and enjoy your meal.</p>
          </div>

        </div>
      </section>

     {/* BIG CTA SECTION */}
<section className="cta-modern">

  <h2>Start Cooking Smarter Today</h2>

  <button
    onClick={() => navigate("/login")}
    className="cta-btn"
  >
    Get Started →
  </button>

  {/* Separator Line */}
  <div className="cta-divider"></div>

</section>


{/* MODERN FOOTER */}

<footer className="modern-footer">
    

  <div className="footer-top">
    <div className="footer-brand">
      <h2>🍽 NutriMind</h2>

      <p>
        NutriMind is an AI powered recipe generator.
        Enter ingredients and generate delicious recipes,
        meal plans and nutrition insights instantly.
      </p>
    </div>

    <div className="footer-tags">

      <span>healthy</span>
      <span>quick meals</span>
      <span>breakfast</span>
      <span>dinner</span>
      <span>vegetarian</span>
      <span>high protein</span>
      <span>gluten free</span>
      <span>easy cooking</span>
      <span>AI recipes</span>
      <span>meal planner</span>

    </div>

  </div>

  <hr />

  <p className="footer-bottom">
    © 2026 NutriMind • Terms • Privacy • Contact
  </p>

</footer>

    </div>
  );
};

export default LandingPage;
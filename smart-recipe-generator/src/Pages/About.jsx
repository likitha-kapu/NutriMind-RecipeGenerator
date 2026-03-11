import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./About.css";

const About = () => {
  return (
    <>
      <Navbar />

      <div className="about-page">

        {/* HERO SECTION */}
        <section className="about-hero">
          <h1>About NutriMind</h1>
          <p>
            NutriMind is an AI-powered cooking assistant that helps users
            generate recipes using the ingredients they already have.
            It simplifies meal planning and makes cooking smarter.
          </p>
        </section>

        {/* FEATURES */}
        <section className="about-section">

          <h2>Key Features</h2>

          <div className="about-grid">

            <div className="about-card">
              <h3>🤖 AI Recipe Generator</h3>
              <p>
                Generate creative recipes instantly from ingredients
                available in your kitchen.
              </p>
            </div>

            <div className="about-card">
              <h3>🎤 Voice Ingredients</h3>
              <p>
                Speak ingredients using voice recognition and let
                NutriMind detect them automatically.
              </p>
            </div>

            <div className="about-card">
              <h3>📅 Meal Planner</h3>
              <p>
                Plan your meals in advance and maintain a healthy
                balanced diet easily.
              </p>
            </div>

            <div className="about-card">
              <h3>❤️ Favorites</h3>
              <p>
                Save your favorite recipes and revisit them anytime.
              </p>
            </div>

          </div>
        </section>

        {/* TECHNOLOGY */}
        <section className="about-section">

          <h2>Technologies Used</h2>

          <div className="tech-stack">

            <span>React</span>
            <span>Node.js</span>
            <span>Express</span>
            <span>MongoDB</span>
            <span>AI APIs</span>

          </div>

        </section>

      </div>

      <Footer />
    </>
  );
};

export default About;
import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-grid">

        {/* BRAND */}
        <div className="footer-brand">
            
          <h2>🍽 NutriMind</h2>
          <p>
            AI powered recipe generator that turns your ingredients
            into delicious meals instantly.
          </p>
        </div>

        {/* PRODUCT */}
        <div className="footer-column">
          <h4>Product</h4>

          <ul>
            <li>
              <Link to="/home">🤖 AI Recipes</Link>
            </li>

            <li>
              <Link to="/meal-planner">🍴 Meal Planner</Link>
            </li>

            <li>
              <Link to="/favorites">❤️ Favorites</Link>
            </li>

            <li>
              <Link to="/create">➕ Create Recipes</Link>
            </li>
          </ul>
        </div>

        {/* RESOURCES */}
        <div className="footer-column">
          <h4>Resources</h4>

          <ul>
            <li>
              <Link to="/create">📖 Cooking Guides</Link>
            </li>

            <li>
              <Link to="/create">🥗 Vegetarian Meals</Link>
            </li>

            <li>
              <Link to="/create">🍳 Quick Recipes</Link>
            </li>

            <li>
              <Link to="/home">🤖 AI Cooking Tips</Link>
            </li>
          </ul>
        </div>

        {/* COMPANY */}
        <div className="footer-column">
          <h4>Company</h4>

          <ul>
            <li>
              <Link to="/about">ℹ About</Link>

            </li>

            <li>
              <Link to="/contact">✉ Contact</Link>
            </li>

            <li>
              <Link to="/">📄 Privacy Policy</Link>
            </li>

            <li>
              <Link to="/">📜 Terms</Link>
            </li>
          </ul>
        </div>

      </div>

      {/* FOOTER BOTTOM */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} NutriMind • Built with React & AI
      </div>

    </footer>
  );
};

export default Footer;
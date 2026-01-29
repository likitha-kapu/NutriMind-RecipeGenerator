import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Left: Title only */}
      <div className="navbar-left">
        <span className="brand">Smart Recipe Generator</span>
      </div>

      {/* Center: Links */}
      <div className="navbar-center">
        <NavLink to="/home" className="nav-link">
          Home
        </NavLink>
        <NavLink to="/create" className="nav-link">
          Create Recipes
        </NavLink>
        <NavLink to="/about" className="nav-link">
          About
        </NavLink>
      </div>

      {/* Right */}
      <div className="navbar-right">
        <span className="bell">🔔</span>
        <div className="avatar">S</div>
      </div>
    </nav>
  );
};

export default Navbar;

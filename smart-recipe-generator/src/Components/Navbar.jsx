import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="navbar">
      {/* Left */}
      <div className="navbar-left">
        <span className="brand">NutriMind</span>
      </div>

      {/* Center */}
      <div className="navbar-center">
        <NavLink to="/home" className="nav-link">
          Home
        </NavLink>
        <NavLink to="/create" className="nav-link">
          Create Recipes
        </NavLink>
        <NavLink to="/favorites" className="nav-link">
          Favorites
        </NavLink>
        <NavLink to="/meal-planner" className="nav-link">
          Meal Planner
        </NavLink>
        
        <NavLink to="/history" className="nav-link">
          History
        </NavLink>
       
        <NavLink to="/about" className="nav-link">
          About
        </NavLink>
      </div>

      {/* Right */}
      <div className="navbar-right">
        <span className="bell">🔔</span>

        {user && (
          <div className="avatar-container" ref={dropdownRef}>
            <div className="avatar" onClick={() => setOpen(!open)}>
              {user.name.charAt(0).toUpperCase()}
            </div>

            {open && (
              <div className="dropdown">
                <div className="dropdown-name">{user.name}</div>

                <div className="dropdown-item" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

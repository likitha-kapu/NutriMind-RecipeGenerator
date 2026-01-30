import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./LandingPage";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import CreateRecipes from "./Pages/CreateRecipes";
import RecipeDetails from "./Pages/RecipeDetails";

const isLoggedIn = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Login Page */}
      <Route
        path="/login"
        element={isLoggedIn() ? <Navigate to="/home" /> : <Login />}
      />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateRecipes />
          </ProtectedRoute>
        }
      />

      {/* Recipe Details Page (PROTECTED) */}
      <Route
        path="/recipe/:recipeName"
        element={
          <ProtectedRoute>
            <RecipeDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

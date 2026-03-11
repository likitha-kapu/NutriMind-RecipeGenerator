import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RecipeChat from "./Pages/RecipeChat";

import LandingPage from "./LandingPage";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import CreateRecipes from "./Pages/CreateRecipes";
import RecipeDetails from "./Pages/RecipeDetails";
import GeneratedRecipes from "./Pages/GeneratedRecipes";
import AIResult from "./Pages/AIResult";
import Favorites from "./Pages/Favorites";
import MealPlanner from "./Pages/MealPlanner";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
const isLoggedIn = () => {
  return localStorage.getItem("token") !== null;
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
      <Route path="/login" element={<Login />} />

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

      {/* ✅ NEW Generated Recipes Route */}
      <Route
        path="/generated-recipes"
        element={
          <ProtectedRoute>
            <GeneratedRecipes />
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
      <Route path="/ai-result" element={<AIResult />} />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route path="/recipe/:recipeName/chat" element={<RecipeChat />} />
      <Route path="/meal-planner" element={<MealPlanner />} />
      <Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;

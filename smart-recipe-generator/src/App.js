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
import History from "./Pages/History";

/* =========================
   Auth Check
========================= */

const isLoggedIn = () => {
  return localStorage.getItem("token") !== null;
};

/* =========================
   Protected Route
========================= */

const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" />;
};

function App() {

  return (

    <Routes>

      {/* Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Home */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Create Recipes */}
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateRecipes />
          </ProtectedRoute>
        }
      />

      {/* Generated Recipes */}
      <Route
        path="/generated-recipes"
        element={
          <ProtectedRoute>
            <GeneratedRecipes />
          </ProtectedRoute>
        }
      />

      {/* Recipe Details */}
      <Route
        path="/recipe/:recipeName"
        element={
          <ProtectedRoute>
            <RecipeDetails />
          </ProtectedRoute>
        }
      />

      {/* Chat Recipe Page */}
      <Route
        path="/recipe/:recipeName/chat"
        element={
          <ProtectedRoute>
            <RecipeChat />
          </ProtectedRoute>
        }
      />

      {/* AI Result */}
      <Route path="/ai-result" element={<AIResult />} />

      {/* Favorites */}
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />

      {/* History */}
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      {/* Meal Planner */}
      <Route
        path="/meal-planner"
        element={
          <ProtectedRoute>
            <MealPlanner />
          </ProtectedRoute>
        }
      />

      {/* About */}
      <Route path="/about" element={<About />} />

      {/* Contact */}
      <Route path="/contact" element={<Contact />} />

    </Routes>

  );

}

export default App;
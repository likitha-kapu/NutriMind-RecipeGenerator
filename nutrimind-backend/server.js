import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));
/* ========================
   Route Imports
======================== */
import recipeDetailsRoute from "./routes/recipeDetails.js";
import chatRoute from "./routes/chat.js";
import generateRecipesRoute from "./routes/generateRecipes.js";
import authRoute from "./routes/auth.js";
import assistantRoute from "./routes/assistant.js";
import favoriteRoute from "./routes/favorite.js";
import imageRoute from "./routes/image.js";
import mealPlannerRoute from "./routes/mealPlanner.js";
import historyRoutes from "./routes/history.js";
import recommendationRoute from "./routes/recommendations.js";
/* ========================
   Static Data
======================== */
import homeRecipes from "./data/home_recipes.json" with { type: "json" };


const app = express();
const PORT = process.env.PORT || 5000;

/* ========================
   Middleware
======================== */
app.use(cors());
app.use(express.json());


/* ========================
   Root Test Route
======================== */
app.get("/", (req, res) => {
  res.send("Nutrimind backend is running 🚀");
});

/* ========================
   API Routes
======================== */

// Home recipes
app.get("/api/recipes", (req, res) => {
  res.json(homeRecipes);
});

// Single recipe generation
app.use("/api/recipe", recipeDetailsRoute);

// Multiple recipe generation
app.use("/api/recipe/generate-multiple", generateRecipesRoute);

// Chat assistant
app.use("/api/chat", chatRoute);
app.use("/api/auth", authRoute);
app.use("/api/assistant", assistantRoute);
app.use("/api/favorites", favoriteRoute);
app.use("/api/image", imageRoute);
app.use("/api/meal-planner", mealPlannerRoute);
app.use("/api/history", historyRoutes);
app.use("/api/recommendations", recommendationRoute);
/* ========================
   404 Handler (Optional)
======================== */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ========================
   Start Server
======================== */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
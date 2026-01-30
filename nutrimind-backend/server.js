import recipeDetailsRoute from "./routes/recipeDetails.js";
import express from "express";
import cors from "cors";
import homeRecipes from "./data/home_recipes.json" assert { type: "json" };

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Nutrimind backend is running");
});

// Home screen recipes API
app.get("/api/recipes", (req, res) => {
  res.json(homeRecipes);
});
app.use("/api/recipe", recipeDetailsRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



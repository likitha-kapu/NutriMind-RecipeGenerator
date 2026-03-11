import express from "express";
import Favorite from "../models/Favorite.js";
import jwt from "jsonwebtoken";

const router = express.Router();

/* Middleware to verify user */
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

/* Add to favorites */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { recipeId, title, image, calories, difficulty } = req.body;

    const existing = await Favorite.findOne({
      user: req.user.id,
      recipeId
    });

    if (existing) {
      return res.json({ message: "Already favorited" });
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      recipeId,
      title,
      image,
      calories,
      difficulty
    });

    res.json(favorite);
  } catch (error) {
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

/* Get favorites */
router.get("/", authMiddleware, async (req, res) => {
  const favorites = await Favorite.find({ user: req.user.id });
  res.json(favorites);
});

/* Remove favorite */
router.delete("/:recipeId", authMiddleware, async (req, res) => {
  await Favorite.findOneAndDelete({
    user: req.user.id,
    recipeId: req.params.recipeId
  });

  res.json({ message: "Removed" });
});

export default router;
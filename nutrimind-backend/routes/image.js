import express from "express";
import { fetchRecipeImage } from "../services/unsplashService.js";

const router = express.Router();

router.get("/:title", async (req, res) => {
  const { title } = req.params;

  const image = await fetchRecipeImage(title);

  res.json({ image });
});

export default router;
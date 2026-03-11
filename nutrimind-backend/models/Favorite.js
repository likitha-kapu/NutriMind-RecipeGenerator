import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    recipeId: {
      type: String,
      required: true
    },
    title: String,
    image: String,
    calories: String,
    difficulty: String
  },
  { timestamps: true }
);

export default mongoose.model("Favorite", favoriteSchema);
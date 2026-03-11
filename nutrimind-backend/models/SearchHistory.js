import mongoose from "mongoose";

const SearchHistorySchema = new mongoose.Schema({

  userId: {
    type: String,
    required: true
  },

  ingredients: {
    type: [String],
    default: []
  },

  diet: {
    type: String,
    default: ""
  },

  health: {
    type: [String],
    default: []
  },

  recipes: {
    type: Array,
    default: []
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.models.SearchHistory ||
mongoose.model("SearchHistory", SearchHistorySchema);
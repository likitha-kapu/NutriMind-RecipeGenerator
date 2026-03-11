import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// 🔥 Fallback image
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80";

export async function fetchRecipeImage(title) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        title + " food"
      )}&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }

    // 🔥 If no results, return fallback
    return FALLBACK_IMAGE;

  } catch (error) {
    console.error("Unsplash error:", error);

    // 🔥 If error, also return fallback
    return FALLBACK_IMAGE;
  }
}
import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/favorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setFavorites(data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [token]);

  const removeFavorite = async (recipeId) => {
    try {
      await fetch(
        `http://localhost:5000/api/favorites/${recipeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFavorites((prev) =>
        prev.filter((fav) => fav.recipeId !== recipeId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Default fallback image
  const defaultImage =
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061";

  return (
    <>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h2 style={{ marginBottom: "20px" }}>
          ❤️ My Favorites
        </h2>

        {loading && <p>Loading favorites...</p>}

        {!loading && favorites.length === 0 && (
          <p>No favorites yet.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {favorites.map((fav) => (
            <div
              key={fav._id}
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow:
                  "0 4px 8px rgba(0,0,0,0.1)",
                background: "#f7f9f8",
              }}
            >
              {/* ✅ Image Fix */}
              <img
                src={
                  fav.image && fav.image !== "generated"
                    ? fav.image
                    : defaultImage
                }
                alt={fav.title}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "12px" }}>
                <h3>{fav.title}</h3>

                <p style={{ color: "#555" }}>
                  Approximately {fav.calories} calories
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  padding: "12px",
                }}
              >
                <button
                  onClick={() =>
                    navigate(
                      `/recipe/${encodeURIComponent(
                        fav.title
                      )}`
                    )
                  }
                  style={{
                    background: "#1b5e20",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  See Recipe →
                </button>

               <button
  onClick={() => removeFavorite(fav.recipeId)}
  style={{
    background: "transparent",
    color: "#e63946",
    border: "1px solid #e63946",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "0.2s",
  }}
  onMouseOver={(e) => {
    e.target.style.background = "#e63946";
    e.target.style.color = "white";
  }}
  onMouseOut={(e) => {
    e.target.style.background = "transparent";
    e.target.style.color = "#e63946";
  }}
>
  Delete
</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Favorites;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const History = () => {

  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchHistory = async () => {

      try {

        const res = await fetch("http://localhost:5000/api/history/demoUser");
        const data = await res.json();

        setHistory(data);

      } catch (error) {

        console.error("History fetch error:", error);

      }

    };

    fetchHistory();

  }, []);


  const viewRecipes = (item) => {

  if (!item.recipes || item.recipes.length === 0) {
    alert("Recipes not available for this search.");
    return;
  }

  navigate("/generated-recipes", {
    state: {
      recipes: item.recipes,
      ingredients: item.ingredients,
      diet: item.diet,
      health: item.health
    }
  });
};


  const deleteHistory = async (id) => {

    if (!window.confirm("Delete this search history?")) return;

    try {

      const res = await fetch(
        `http://localhost:5000/api/history/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!res.ok) {
        alert("Failed to delete history");
        return;
      }

      setHistory(prev => prev.filter(item => item._id !== id));

    } catch (error) {

      console.error("Delete error:", error);
      alert("Something went wrong");

    }

  };
  


  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          padding: "20px"
        }}
      >

        <h2 style={{ marginBottom: "20px" }}>
          🔎 Recent Searches
        </h2>

        {history.length === 0 ? (

          <p>No search history yet.</p>

        ) : (

          history.map((item, index) => (

            <div
              key={item._id}
              style={{
                background: "#f8f9fa",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >

              <h3>Search #{index + 1}</h3>

              <p>
                <strong>Ingredients:</strong>{" "}
                {item.ingredients.join(" • ")}
              </p>

              <p>
                <strong>Diet:</strong>{" "}
                {item.diet || "None"}
              </p>

              <p>
                <strong>Health:</strong>{" "}
                {item.health?.length
                  ? item.health.join(", ")
                  : "None"}
              </p>

              <p style={{ fontSize: "14px", color: "gray" }}>
                {new Date(item.createdAt).toLocaleString()}
              </p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>

                <button
                  onClick={() => viewRecipes(item)}
                  style={{
                    background: "#0f6848",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  View Recipes
                </button>

                <button
                  onClick={() => deleteHistory(item._id)}
                  style={{
                    background: "#c0392b",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  Delete
                </button>

              </div>

            </div>

          ))

        )}

      </div>
    </>
  );
};

export default History;
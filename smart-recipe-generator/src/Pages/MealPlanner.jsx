import React, { useState, useRef } from "react";
import Navbar from "../Components/Navbar";
import "./MealPlanner.css";
import Footer from "../Components/Footer";
import html2pdf from "html2pdf.js";

const MealPlanner = () => {
  const [days, setDays] = useState(7);
  const [diet, setDiet] = useState("");
  const [goal, setGoal] = useState("Balanced");
  const [time, setTime] = useState("Any");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const resultRef = useRef(null);

  /* GENERATE PLAN */
  const generatePlan = async () => {
    setLoading(true);
    setPlan(null);

    try {
      const res = await fetch("http://localhost:5000/api/meal-planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          days: Number(days),
          diet,
          goal,
          cookingTime: time
        })
      });

      const data = await res.json();
      setPlan(data);

    } catch (error) {
      console.error("Meal planner fetch error:", error);
    }

    setLoading(false);

    // scroll to results
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  /* DOWNLOAD PDF */
  const downloadPDF = () => {
    const element = document.getElementById("meal-plan-result");

    const options = {
      margin: 10,
      filename: "NutriMind_Meal_Plan.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <>
      <Navbar />

      <div className="meal-hero">
        <div className="hero-content">

          <h1>AI Meal Planner</h1>
          <p>Create a smart weekly plan based on your goals & lifestyle</p>

          <div className="planner-card">

            <div className="planner-grid">

              {/* Days */}
              <div className="control-group">
                <label>📅 Days</label>
                <select value={days} onChange={(e) => setDays(e.target.value)}>
                  <option value={3}>3 Days</option>
                  <option value={5}>5 Days</option>
                  <option value={7}>7 Days</option>
                </select>
              </div>

              {/* Diet */}
              <div className="control-group">
                <label>🥗 Diet Type</label>
                <select value={diet} onChange={(e) => setDiet(e.target.value)}>
                  <option value="">No Restriction</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Keto">Keto</option>
                  <option value="High Protein">High Protein</option>
                </select>
              </div>

              {/* Goal */}
              <div className="control-group">
                <label>🎯 Primary Goal</label>
                <select value={goal} onChange={(e) => setGoal(e.target.value)}>
                  <option value="Balanced">Balanced</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Energy Boost">Energy Boost</option>
                </select>
              </div>

              {/* Cooking Time */}
              <div className="control-group">
                <label>⏱ Cooking Time</label>
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                  <option value="Any">Any</option>
                  <option value="Quick">Quick (Under 20 min)</option>
                  <option value="Moderate">Moderate (30–45 min)</option>
                  <option value="Long">Long (1+ hour)</option>
                </select>
              </div>

            </div>

            <button className="generate-btn" onClick={generatePlan}>
              Generate My Plan →
            </button>

          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <p className="loading-text">
          Generating your personalized meal plan...
        </p>
      )}

      {/* RESULTS */}
      {plan?.days && (
        <>
          {/* DOWNLOAD BUTTON */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button className="pdf-btn" onClick={downloadPDF}>
              Download Meal Plan as PDF
            </button>
          </div>

          <div
            id="meal-plan-result"
            className="plan-grid"
            ref={resultRef}
          >
            {plan.days.map((day, index) => (
              <div key={index} className="day-card">
                <h3>{day.day}</h3>
                <p><strong>🍳 Breakfast:</strong> {day.breakfast}</p>
                <p><strong>🥗 Lunch:</strong> {day.lunch}</p>
                <p><strong>🍲 Dinner:</strong> {day.dinner}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <Footer />
    </>
  );
};

export default MealPlanner;
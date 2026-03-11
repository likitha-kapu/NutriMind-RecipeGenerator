import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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

  /* Track completed meals */
  const [completedMeals, setCompletedMeals] = useState({});

  const resultRef = useRef(null);

  /* =============================
     GENERATE PLAN
  ============================== */

  const generatePlan = async () => {

    setLoading(true);
    setPlan(null);
    setCompletedMeals({});

    try {

      const res = await fetch(
        "http://localhost:5000/api/meal-planner",
        {
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
        }
      );

      const data = await res.json();
      setPlan(data);

    }
    catch (error) {
      console.error("Meal planner error:", error);
    }

    setLoading(false);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth"
      });
    }, 200);

  };

  /* =============================
     TOGGLE MEAL COMPLETION
  ============================== */

  const toggleMeal = (dayIndex, meal) => {

    const key = `${dayIndex}-${meal}`;

    setCompletedMeals(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

  };

  /* =============================
     CALCULATE DAY CALORIES
  ============================== */

  const calculateDayCalories = (index) => {

    if (!plan) return 0;

    const dailyTotal =
      plan.analytics.dailyCalories[index].calories;

    const mealCalories = dailyTotal / 3;

    let calories = 0;

    if (completedMeals[`${index}-breakfast`])
      calories += mealCalories;

    if (completedMeals[`${index}-lunch`])
      calories += mealCalories;

    if (completedMeals[`${index}-dinner`])
      calories += mealCalories;

    return Math.round(calories);

  };

  /* =============================
     TOTAL CALORIES ACHIEVED
  ============================== */

  const calculateAchievedCalories = () => {

    if (!plan) return 0;

    let total = 0;

    plan.analytics.dailyCalories.forEach((d, index) => {

      total += calculateDayCalories(index);

    });

    return Math.round(total);

  };

  const achievedCalories =
    calculateAchievedCalories();

 const goalCalories =
  plan?.analytics?.goalCalories || 2000;

const totalDays = plan?.days?.length || 1;

/* weekly target calories */
const weeklyTargetCalories =
  goalCalories * totalDays;

const progressPercentage =
  Math.min(
    (achievedCalories / weeklyTargetCalories) * 100,
    100
  );

  /* =============================
     GRAPH DATA
  ============================== */

  const graphData =
    plan?.analytics?.dailyCalories?.map(
      (d, index) => ({

        day: d.day,
        calories: d.calories,
        achieved: calculateDayCalories(index)

      })
    ) || [];

  /* =============================
     DOWNLOAD PDF
  ============================== */

  const downloadPDF = () => {

    const element =
      document.getElementById("meal-plan-result");

    html2pdf()
      .set({
        margin: 10,
        filename: "NutriMind_Meal_Plan.pdf",
        html2canvas: { scale: 2 }
      })
      .from(element)
      .save();

  };

  return (

    <>
      <Navbar />

      <div className="meal-hero">
        <div className="hero-content">

          <h1>AI Meal Planner</h1>
          <p>Create a smart weekly plan</p>

          <div className="planner-card">

            <div className="planner-grid">

              {/* Days */}

              <div className="control-group">
                <label>📅 Days</label>
                <select
                  value={days}
                  onChange={(e) =>
                    setDays(e.target.value)
                  }
                >
                  <option value={3}>3 Days</option>
                  <option value={5}>5 Days</option>
                  <option value={7}>7 Days</option>
                </select>
              </div>

              {/* Diet */}

              <div className="control-group">
                <label>🥗 Diet</label>
                <select
                  value={diet}
                  onChange={(e) =>
                    setDiet(e.target.value)
                  }
                >
                  <option value="">
                    No Restriction
                  </option>
                  <option value="Vegetarian">
                    Vegetarian
                  </option>
                  <option value="Vegan">
                    Vegan
                  </option>
                  <option value="Keto">
                    Keto
                  </option>
                  <option value="High Protein">
                    High Protein
                  </option>
                </select>
              </div>

              {/* Goal */}

              <div className="control-group">
                <label>🎯 Goal</label>
                <select
                  value={goal}
                  onChange={(e) =>
                    setGoal(e.target.value)
                  }
                >
                  <option value="Balanced">
                    Balanced
                  </option>
                  <option value="Weight Loss">
                    Weight Loss
                  </option>
                  <option value="Muscle Gain">
                    Muscle Gain
                  </option>
                  <option value="Energy Boost">
                    Energy Boost
                  </option>
                </select>
              </div>

              {/* Time */}

              <div className="control-group">
                <label>⏱ Cooking Time</label>
                <select
                  value={time}
                  onChange={(e) =>
                    setTime(e.target.value)
                  }
                >
                  <option value="Any">Any</option>
                  <option value="Quick">Quick</option>
                  <option value="Moderate">
                    Moderate
                  </option>
                  <option value="Long">Long</option>
                </select>
              </div>

            </div>

            <button
              className="generate-btn"
              onClick={generatePlan}
            >
              Generate Plan →
            </button>

          </div>

        </div>
      </div>

      {loading &&
        <p className="loading-text">
          Generating meal plan...
        </p>
      }

      {/* =============================
         RESULTS
      ============================== */}

      {plan?.days && (

        <>
          <div style={{ textAlign: "center" }}>
            <button
              className="pdf-btn"
              onClick={downloadPDF}
            >
              Download PDF
            </button>
          </div>

          <div
            id="meal-plan-result"
            className="plan-grid"
            ref={resultRef}
          >

            {plan.days.map((day, index) => {

              const dayCalories =
                calculateDayCalories(index);

              const dailyTarget =
                plan.analytics.dailyCalories[index]
                  .calories;

              return (

                <div
                  key={index}
                  className="day-card"
                >

                  <h3>{day.day}</h3>

                  <p
                    onClick={() =>
                      toggleMeal(index, "breakfast")
                    }
                    style={{
                      textDecoration:
                        completedMeals[`${index}-breakfast`]
                          ? "line-through"
                          : "none",
                      cursor: "pointer"
                    }}
                  >
                    🍳 Breakfast: {day.breakfast}
                  </p>

                  <p
                    onClick={() =>
                      toggleMeal(index, "lunch")
                    }
                    style={{
                      textDecoration:
                        completedMeals[`${index}-lunch`]
                          ? "line-through"
                          : "none",
                      cursor: "pointer"
                    }}
                  >
                    🥗 Lunch: {day.lunch}
                  </p>

                  <p
                    onClick={() =>
                      toggleMeal(index, "dinner")
                    }
                    style={{
                      textDecoration:
                        completedMeals[`${index}-dinner`]
                          ? "line-through"
                          : "none",
                      cursor: "pointer"
                    }}
                  >
                    🍲 Dinner: {day.dinner}
                  </p>

                  {/* DAILY PROGRESS */}

                  <div
                    style={{
                      marginTop: "15px"
                    }}
                  >

                    <div
                      style={{
                        background: "#ddd",
                        borderRadius: "10px"
                      }}
                    >
                      <div
                        style={{
                          width:
                            `${Math.min(
                              (dayCalories /
                                dailyTarget) *
                                100,
                              100
                            )}%`,
                          height: "10px",
                          background: "#22c55e",
                          borderRadius: "10px"
                        }}
                      />
                    </div>

                    <p>
                      Calories Achieved:
                      {dayCalories}/{dailyTarget}
                    </p>

                  </div>

                </div>

              );

            })}

          </div>

          {/* =============================
             ANALYTICS DASHBOARD
          ============================== */}

          <div style={{ marginTop: "50px" }}>

            <h2 style={{ textAlign: "center" }}>
              Nutrition Analytics Dashboard
            </h2>

            <div
              style={{
                width: "140px",
                margin: "30px auto"
              }}
            >
              <CircularProgressbar
                value={progressPercentage}
                text={`${progressPercentage.toFixed(0)}%`}
              />
              <p style={{ textAlign: "center" }}>
                Goal Adherence
              </p>
            </div>

            <div
              style={{
                textAlign: "center",
                fontWeight: "bold"
              }}
            >
              Calories Achieved: {achievedCalories}
Target Calories: {weeklyTargetCalories}
            </div>

            {/* GRAPH */}

            <div
              style={{
                width: "90%",
                height: 350,
                margin: "40px auto"
              }}
            >

              <ResponsiveContainer>

                <LineChart data={graphData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="day" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#22c55e"
                    name="Planned Calories"
                  />

                  <Line
                    type="monotone"
                    dataKey="achieved"
                    stroke="#3b82f6"
                    name="Achieved Calories"
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

        </>

      )}

      <Footer />
    </>
  );
};

export default MealPlanner;
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = [
  "#6FAF73", // Protein
  "#E6A35C", // Carbs
  "#D96C6C", // Fat
  "#8BC34A", // Fiber
  "#E91E63"  // Sugar
];

const nutritionDatabase = [
  {
    keywords: ["chicken", "egg", "fish", "beef", "meat"],
    protein: 40,
    carbs: 0,
    fat: 25,
    fiber: 0,
    sugar: 0
  },
  {
    keywords: ["rice", "bread", "pasta", "noodle"],
    protein: 8,
    carbs: 70,
    fat: 5,
    fiber: 5,
    sugar: 2
  },
  {
    keywords: ["potato"],
    protein: 5,
    carbs: 60,
    fat: 2,
    fiber: 8,
    sugar: 5
  },
  {
    keywords: ["carrot", "broccoli", "spinach", "vegetable", "lettuce"],
    protein: 5,
    carbs: 10,
    fat: 1,
    fiber: 15,
    sugar: 4
  },
  {
    keywords: ["cheese", "milk", "yogurt"],
    protein: 20,
    carbs: 5,
    fat: 40,
    fiber: 0,
    sugar: 5
  },
  {
    keywords: ["butter", "oil", "ghee"],
    protein: 0,
    carbs: 0,
    fat: 90,
    fiber: 0,
    sugar: 0
  },
  {
    keywords: ["sugar", "honey"],
    protein: 0,
    carbs: 90,
    fat: 0,
    fiber: 0,
    sugar: 90
  }
];

function calculateNutrition(ingredients = []) {

  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;
  let sugar = 0;

  ingredients.forEach((ingredient) => {

    const lower = ingredient.toLowerCase();

    nutritionDatabase.forEach((item) => {

      item.keywords.forEach((key) => {

        if (lower.includes(key)) {

          protein += item.protein;
          carbs += item.carbs;
          fat += item.fat;
          fiber += item.fiber;
          sugar += item.sugar;

        }

      });

    });

  });

  const total = protein + carbs + fat + fiber + sugar;

  if (total === 0) {

    return [
      { name: "Protein", value: 25 },
      { name: "Carbs", value: 25 },
      { name: "Fat", value: 25 },
      { name: "Fiber", value: 15 },
      { name: "Sugar", value: 10 }
    ];

  }

  return [
    { name: "Protein", value: Math.round((protein / total) * 100) },
    { name: "Carbs", value: Math.round((carbs / total) * 100) },
    { name: "Fat", value: Math.round((fat / total) * 100) },
    { name: "Fiber", value: Math.round((fiber / total) * 100) },
    { name: "Sugar", value: Math.round((sugar / total) * 100) }
  ];
}

const NutritionChart = ({ ingredients }) => {

  const data = calculateNutrition(ingredients);

  return (
    <div style={{ width: "100%", height: 300 }}>

      <ResponsiveContainer>

        <PieChart>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={({ name, value }) => `${name} ${value}%`}
          >

            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

          </Pie>

          <Tooltip />
          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );

};

export default NutritionChart;
const ingredients = [
  "Agave",
  "Agua",
  "All purpose flour",
  "Almidon de maiz",
  "Almond",
  "Almond flour",
  "Aloo",
  "Amul butter",
  "Anchovies",
  "Apple Cider",
  "Apples",
  "Avocado",
  "Basil",
  "Butter",
  "Cheese",
  "Chicken",
  "Eggs",
  "Flour",
  "Garlic",
  "Milk",
  "Olive oil",
  "Onion",
  "Salt",
  "Sugar",
  "Tomato"
];

// IMPORTANT: sort lexicographically
export default ingredients.sort((a, b) => a.localeCompare(b));

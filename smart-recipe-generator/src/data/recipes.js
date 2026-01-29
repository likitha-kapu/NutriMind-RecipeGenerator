export const generateRecipes = () => {
  const recipeNames = [
    "Grilled Chicken Sandwich",
    "Veggie Salad Bowl",
    "Pasta Alfredo",
    "Beef Burger",
    "Fruit Smoothie",
    "Chocolate Cake",
    "Avocado Toast",
    "Tomato Soup",
    "Chicken Curry",
    "Vegan Tacos",
    "Toast Recipe",
    "Cake Recipe"
  ];

  const keywords = [
    "chicken", "salad", "pasta", "burger", "smoothie",
    "cake", "avocado", "soup", "curry", "tacos",
    "toast", "dessert"
  ];

  const tagsList = [
    ["High Protein", "Low Carb"],
    ["Vegan", "Healthy"],
    ["Low Carb", "Quick"],
    ["High Protein", "Healthy"],
    ["Healthy", "Spicy"],
    ["Spicy", "Breakfast"],
    ["Vegan", "Spicy"],
    ["Dinner", "Vegan"],
    ["Dinner", "Dessert"],
    ["Healthy", "Dinner"],
    ["Breakfast", "Dinner"],
    ["Dessert", "Quick"]
  ];

  return recipeNames.map((name, index) => ({
    id: index + 1,
    name,
    image: `https://source.unsplash.com/400x300/?${keywords[index]}&sig=${index}`,
    calories: 300 + index,
    tags: tagsList[index],
    likes: Math.floor(Math.random() * 100)
  }));
};

import csv
import json
import ast

INPUT_CSV = "data/RAW_recipes.csv"
OUTPUT_JSON = "data/home_recipes.json"

home_recipes = []

with open(INPUT_CSV, encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)

    for row in reader:
        try:
            # Get calories from nutrition column
            nutrition = ast.literal_eval(row["nutrition"])
            calories = round(float(nutrition[0]))

            # Get tags
            raw_tags = ast.literal_eval(row["tags"])
            ui_tags = []

            if "vegetarian" in raw_tags:
                ui_tags.append("Vegetarian")
            if "vegan" in raw_tags:
                ui_tags.append("Vegan")
            if "gluten-free" in raw_tags:
                ui_tags.append("Gluten-Free")
            if "easy" in raw_tags:
                ui_tags.append("Easy")

            # Create clean recipe object
            recipe = {
                "id": row["id"],
                "title": row["name"].title(),
                "calories": calories,
                "tags": ui_tags,
                "imagePrompt": f"{row['name']} food photography"
            }

            home_recipes.append(recipe)

            # Limit recipes (important!)
            if len(home_recipes) >= 70:
                break

        except Exception:
            continue

# Save to JSON
with open(OUTPUT_JSON, "w", encoding="utf-8") as jsonfile:
    json.dump(home_recipes, jsonfile, indent=2)

print("home_recipes.json created successfully")

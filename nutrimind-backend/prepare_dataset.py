import pandas as pd
import ast
import json

df = pd.read_csv("data/RAW_recipes.csv")

recipes = []

for _, row in df.iterrows():

    try:

        if pd.isna(row["name"]):
            continue

        tags = ast.literal_eval(row["tags"])
        nutrition = ast.literal_eval(row["nutrition"])

        recipe = {
            "title": str(row["name"]),
            "minutes": int(row["minutes"]),
            "calories": float(nutrition[0]),
            "tags": [t.lower() for t in tags]
        }

        recipes.append(recipe)

    except:
        continue


with open("recipes.json", "w") as f:
    json.dump(recipes, f, indent=2)

print("Dataset converted successfully!")
const tags = [
  "vegetarian", "vegan", "healthy", "spicy", "protein",
  "quick", "breakfast", "dinner", "indian", "dessert"
];

const Tags = () => {
  return (
    <div>
      <h3>🔥 Popular Tags</h3>
      <div className="tags">
        {tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );
};

export default Tags;

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";

const RecipeChat = () => {
  const { recipeName } = useParams();
  const decodedRecipeName = decodeURIComponent(recipeName);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 Ask me anything about this recipe!"
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage.text,
          recipeName: decodedRecipeName
        })
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.reply }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "⚠️ No response from assistant." }
        ]);
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Failed to reach assistant." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "30px auto" }}>
        <h2>💬 Ask AI about</h2>
        <h3 style={{ color: "#2e7d32" }}>{decodedRecipeName}</h3>

        {/* Chat box */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            height: "400px",
            overflowY: "auto",
            marginTop: "20px",
            background: "#fafafa"
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: "10px"
              }}
            >
              <div
                style={{
                  background:
                    msg.sender === "user" ? "#c8e6c9" : "#e3f2fd",
                  padding: "10px 14px",
                  borderRadius: "16px",
                  maxWidth: "70%"
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ color: "#666" }}>🤖 Thinking...</div>
          )}
        </div>

        {/* Input */}
        <div style={{ display: "flex", marginTop: "15px" }}>
          <input
  type="text"
  value={input}
  placeholder="Ask a question about this recipe..."
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  }}
  style={{
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  }}
/>

          <button
            onClick={sendMessage}
            style={{
              marginLeft: "10px",
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#1b5e20",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            Send →
          </button>
        </div>
      </div>
    </>
  );
};

export default RecipeChat;

import { useState } from "react";

export default function ChatComponent() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Save user input to chat history
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", text: input },
    ]);

    try {
      console.log("FETCHING..")
      const res = await fetch("/api/process-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      console.log("FETCH REQUEST dONE")

      if (!res.ok) {
        throw new Error('Server error: ${res.statusText}');
      }

      const data = await res.json();
      
      // Add AI response to chat history
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "model", text: data.message },
      ]);
    } catch (err) {
      console.error("Error fetching AI response:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
      setInput(""); // Reset input field after sending
    }
  };

  const formatAIResponse = (responseText) => {
    // Split the response into individual lines and return each as a bullet point
    return responseText
      .split("\n") // Split by new lines
      .map((line, index) =>
        line.trim() ? <li key={index}>{line.trim()}</li> : null
      ) // Only non-empty lines get a bullet point
      .filter(Boolean); // Remove any null/empty lines
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Finance Mastery AI Assistant</h1>
      <form 
        onSubmit={handleSubmit} 
        style={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "#f0f0f0",
          padding: "10px 20px",         // Adjusted padding for a cleaner look
          borderTop: "1px solid #ddd",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ 
          display: "flex", 
          gap: "10px",
          width: "100%",
          maxWidth: "800px",
          flex: 1,                     // Allow the input area to take available space
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            rows="1"                     // Keep the height reduced
            style={{ 
              flex: 1,
              padding: "10px",            // Increased padding for better usability
              borderRadius: "5px",
              border: "1px solid #ddd",
              backgroundColor: "white",
              resize: "none",
            }}
          />
          <button
            type="submit"
            style={{ 
              padding: "10px 15px",       // Adjusted padding for a better button size
              cursor: "pointer",
              borderRadius: "5px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              height: "fit-content",
              alignSelf: "flex-start",     // Align button to the top
              marginLeft: "5px",           // Added margin for spacing
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Send"}
          </button>
        </div>
      </form>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <div style={{ marginTop: "20px", height: "350px", overflowY: "scroll" }}>
        <h3>Chat:</h3>
        <div>
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              style={{
                backgroundColor: msg.role === "user" ? "#f0f0f0" : "#d0ffd0",
                margin: "10px 0",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <strong>{msg.role === "user" ? "You" : "AI"}:</strong>
              {msg.role === "model" ? (
                <ul style={{ paddingLeft: "20px" }}>
                  {formatAIResponse(msg.text)} {/* Display response as bullet points */}
                </ul>
              ) : (
                <p>{msg.text}</p> // User message is shown normally
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
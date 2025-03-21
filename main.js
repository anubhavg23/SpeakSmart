document.addEventListener("DOMContentLoaded", () => {
    const messagesContainer = document.getElementById("messages-container");
    const userInputField = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
  
    // Helper function to format text with asterisks
    const formatText = (text) => {
      let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
      formattedText = formattedText.replace(/\*(.*?)\*/g, "<i>$1</i>");
      return formattedText;
    };
  
    // Add a message to the chat
    const addMessage = (content, isUser = false) => {
      const messageElement = document.createElement("div");
      messageElement.className = `message ${isUser ? "user-message" : "bot-message"}`;
      messageElement.innerHTML = content; // Using innerHTML for formatted content
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll to bottom
    };
  
    // Handle user input
    const handleUserInput = async () => {
      const userInput = userInputField.value.trim();
      if (userInput) {
        addMessage(userInput, true); // Add user's message
        userInputField.value = ""; // Clear input field
  
        try {
          const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [{ parts: [{ text: userInput }] }],
              }),
              params: {
                key: "AIzaSyBPeTnlZx6ZvziRNKD6pkMANNv12DTm7iY",
              },
            }
          );
  
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
  
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            addMessage(formatText(reply)); // Add bot's formatted reply
          } else {
            throw new Error("Unexpected response structure");
          }
        } catch (error) {
          console.error("Error:", error);
          addMessage("Sorry, something went wrong. Please try again.", false);
        }
      }
    };
  
    // Event listeners
    sendButton.addEventListener("click", handleUserInput);
    userInputField.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        handleUserInput();
      }
    });
  
    // Initial greeting message
    addMessage("Hello! I'm your personal AI assistant. How can I help you today?");
  });
  
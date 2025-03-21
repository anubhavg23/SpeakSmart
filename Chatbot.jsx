import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import axios from 'axios';

// Helper function to format text with asterisks
const formatText = (text) => {
  // Replace **text** with bold
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  // Replace *text* with italic
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<i>$1</i>');
  return formattedText;
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Initial greeting message
    if (messages.length === 0) {
      setMessages([{ content: "Hello! I'm your personal AI assistant. How can I help you today?", isUser: false }]);
    }
  }, [messages]);

  const addMessage = (content, isUser = false) => {
    setMessages(prevMessages => [...prevMessages, { content, isUser }]);
  };

  const handleUserInput = async () => {
    if (userInput.trim()) {
      addMessage(userInput, true);
      setUserInput('');
      setIsSending(true);

      try {
        const response = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
          {
            contents: [{ parts: [{ text: userInput }] }],
          },
          {
            params: {
              key: "AIzaSyBPeTnlZx6ZvziRNKD6pkMANNv12DTm7iY"
            },
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        // Ensure response structure is correct
        const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          addMessage(formatText(reply));  // Format the reply text
        } else {
          throw new Error('Unexpected response structure');
        }
      } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, something went wrong. Please try again.', false);
      } finally {
        setIsSending(false);
      }
    }
  };

  const renderMessageContent = (content) => {
    return { __html: content };  // Use dangerouslySetInnerHTML for rendering HTML content
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - <HeaderHeight> - <SidebarWidth>)' }}>
      <Box sx={{ flex: 1, overflowY: 'scroll', p: 2 }}>
        {messages.map((msg, index) => (
          <Paper key={index} sx={{ p: 2, mb: 1, backgroundColor: msg.isUser ? 'lightblue' : 'lightgray' }}>
            <Typography dangerouslySetInnerHTML={renderMessageContent(msg.content)} />
          </Paper>
        ))}
      </Box>
      <Box sx={{ p: 2, height: 'calc(100vh - <HeaderHeight> - <SidebarWidth>)', // Adjust based on your header and sidebar height
            overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          placeholder="Type your message..."
          fullWidth
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !isSending) {
              handleUserInput();
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
          onClick={handleUserInput}
          disabled={isSending}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chatbot;

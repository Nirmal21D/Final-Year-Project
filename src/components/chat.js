import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Styles object
const styles = {
  chatContainer: {
    width: '100%',
    maxWidth: '800px',
    height: '600px',
    margin: '0 auto',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
  },
  chatHeader: {
    padding: '20px',
    background: '#2c3e50',
    color: 'white',
    borderRadius: '12px 12px 0 0',
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.5rem',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  message: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '12px',
    margin: '4px 0',
  },
  userMessage: {
    alignSelf: 'flex-end',
    background: '#2c3e50',
    color: 'white',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    background: '#f0f2f5',
    color: '#000',
  },
  errorMessage: {
    alignSelf: 'center',
    background: '#ffebee',
    color: '#c62828',
  },
  inputForm: {
    display: 'flex',
    padding: '20px',
    gap: '10px',
    borderTop: '1px solid #eee',
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
  },
  button: {
    padding: '12px 24px',
    background: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  buttonDisabled: {
    background: '#ccc',
    cursor: 'not-allowed',
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '8px 16px',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    background: '#90a4ae',
    borderRadius: '50%',
    animation: 'bounce 1.4s infinite ease-in-out',
  },
};

// Initialize Gemini AI
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Create a single chat session instance
let chatSession;

// Initialize the chat session
async function initializeChatSession() {
  if (!chatSession) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `You are Finance Mastery's AI Assistant...`, // your system instruction
      });
      
      chatSession = model.startChat({
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        },
        history: [],
      });
    } catch (error) {
      console.error("Error initializing chat session:", error);
      throw error;
    }
  }
  return chatSession;
}

// Chat Interface Component
const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { type: 'user', content: inputMessage.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const session = await initializeChatSession();
      const result = await session.sendMessage(inputMessage.trim());

      if (result?.response?.text) {
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: result.response.text()
        }]);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: `Error: ${error.message || 'There was an error processing your request.'}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageStyle = (type) => {
    switch(type) {
      case 'user':
        return { ...styles.message, ...styles.userMessage };
      case 'assistant':
        return { ...styles.message, ...styles.assistantMessage };
      case 'error':
        return { ...styles.message, ...styles.errorMessage };
      default:
        return styles.message;
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatHeader}>
        <h2 style={styles.headerTitle}>Finance Mastery Assistant</h2>
      </div>
      
      <div style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={getMessageStyle(message.type)}
          >
            <div>{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div style={getMessageStyle('assistant')}>
            <div style={styles.typingIndicator}>
              <span style={{...styles.typingDot, animationDelay: '-0.32s'}}></span>
              <span style={{...styles.typingDot, animationDelay: '-0.16s'}}></span>
              <span style={styles.typingDot}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={styles.inputForm}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your financial question..."
          disabled={isLoading}
          style={styles.input}
        />
        <button 
          type="submit" 
          disabled={isLoading || !inputMessage.trim()}
          style={{
            ...styles.button,
            ...(isLoading || !inputMessage.trim() ? styles.buttonDisabled : {})
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;

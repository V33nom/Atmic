import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Bot, User, MessageSquare } from 'lucide-react';
import './Chatbot.css';

// 🛑 IMPORTANT: Update this URL to match your running backend server
const API_URL = 'https://rigveda-api.onrender.com/api/chatbot/ask';

// Example questions to populate the welcome screen buttons
const EXAMPLE_QUESTIONS = [
  "What does the Rig Veda say about creation?",
  "Describe the role of Agni in the Vedic pantheon?",
  "Which hymns are dedicated to Ushas, the dawn goddess?",
  "Explain the concept of Rta (cosmic order)."
];

// Message types for state management
const MESSAGE_TYPE = {
  USER: 'user',
  BOT: 'bot',
};

// Helper: random pity of 2 or 3
const getPity = () => 2 + Math.floor(Math.random() * 2); // 2 or 3

// --- Helper Component: Example Question Button ---
const ExampleButton = ({ question, onClick }) => (
  <button onClick={() => onClick(question)} className="example-button">
    <MessageSquare className="example-button-icon" />
    {question}
  </button>
);

// --- Helper Component: Message Renderer ---
const Message = ({ message }) => {
  const isUser = message.type === MESSAGE_TYPE.USER;
  const wrapperClass = isUser ? 'message-wrapper message-wrapper--user' : 'message-wrapper';
  const iconClass = isUser ? 'message-icon message-icon--user' : 'message-icon message-icon--bot';
  const bubbleClass = isUser ? 'message-bubble message-bubble--user' : 'message-bubble message-bubble--bot';

  return (
    <div className={wrapperClass}>
      <div className={iconClass}>
        {isUser ? <User /> : <Bot />}
      </div>
      <div className={bubbleClass}>
        <div className="message-text">{message.text}</div>
        {message.sources && message.sources.length > 0 && (
          <div className="message-sources">
            <span>Sources:</span>
            <ul>
              {message.sources.map((src, index) => (
                <li key={index}>
                  <a
                    href={src.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    {src.title || `External Reference ${index + 1}`}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---
export default function Chatbot({ grantRandomCard }) {
  // State to manage conversation history (initiate with welcome message)
  const [messages, setMessages] = useState([
    {
      text: "Namaste! I am the Rigveda scholar. Please ask me any question about the Rigveda, its deities, hymns, or philosophy. I cannot discuss other topics.",
      type: MESSAGE_TYPE.BOT
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Ref for auto-scrolling the chat window
  const messagesEndRef = useRef(null);

  // Reward control (probability + pity)
  const replySinceLastDropRef = useRef(0);
  const pityRef = useRef(getPity());     // 2 or 3
  const REPLY_DROP_RATE = 0.18;          // 18% chance per successful bot reply

  // Auto-scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Function to handle clicking an example button
  const handleExampleQuestionClick = (question) => {
    handleSendMessage({ preventDefault: () => {} }, question);
  };

  // Function to handle the form submission and API call
  const handleSendMessage = async (e, examplePrompt = null) => {
    if (e) e.preventDefault();
    const userPrompt = (examplePrompt || input).trim();
    if (!userPrompt || isLoading) return;

    // 1. Add user message to state
    const newUserMessage = { text: userPrompt, type: MESSAGE_TYPE.USER };
    setMessages(prev => [...prev, newUserMessage]);
    setInput(''); // Clear input field if not using an example
    setIsLoading(true);

    try {
      // 2. Make the API call to your Node.js backend
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await response.json();

      let botResponseText;
      if (response.ok) {
        botResponseText = data.response;
      } else {
        botResponseText = `Error: ${data.error || 'Could not connect to the Rigveda AI service.'}`;
      }

      // 3. Add bot message to state
      const newBotMessage = {
        text: botResponseText,
        type: MESSAGE_TYPE.BOT,
        sources: data.sources
      };
      setMessages(prev => [...prev, newBotMessage]);

      // 4. Reward logic (only on successful bot reply content)
      if (response.ok && typeof botResponseText === 'string' && botResponseText.length > 0) {
        replySinceLastDropRef.current += 1;

        // Pity guarantee after 2–3 replies
        if (replySinceLastDropRef.current >= pityRef.current) {
          grantRandomCard?.();
          replySinceLastDropRef.current = 0;
          pityRef.current = getPity(); // reset pity to 2 or 3
        } else if (Math.random() < REPLY_DROP_RATE) {
          // Probabilistic drop
          grantRandomCard?.();
          replySinceLastDropRef.current = 0;
          pityRef.current = getPity(); // reset pity after drop
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      const errorMessage = {
        text: "Network error or server connection failed. Please ensure your backend is running on port 3000.",
        type: MESSAGE_TYPE.BOT
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const isIntroVisible = messages.length <= 1;

  // --- Render ---
  return (
    <div className="chatbot-container">
      {/* Main Content Area (Scrollable) */}
      <div className="chat-content-area">
        {/* Intro Header (Visible when chat history is empty or short) */}
        {isIntroVisible && (
          <div className="intro-header">
            <h1>Ask the Vedas</h1>
            <p>Converse with the ancient wisdom of the Rig Veda.</p>

            {/* Example Questions Grid */}
            <div className="example-questions-grid">
              {EXAMPLE_QUESTIONS.map((q, index) => (
                <ExampleButton
                  key={index}
                  question={q}
                  onClick={handleExampleQuestionClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Chat History (Appears after interaction) */}
        {!isIntroVisible && (
          <div className="chat-history">
            {messages.map((msg, index) => (
              <Message key={index} message={msg} />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="loading-indicator">
                <Bot />
                <p>
                  The Vedic scholar is thinking... <Loader2 />
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Persistent Input Bar (Fixed at the bottom) */}
      <div className="input-bar">
        <form onSubmit={handleSendMessage} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the Rig Veda..."
            className="input-field"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="loading-icon" /> : <Send />}
          </button>
        </form>
      </div>
    </div>
  );
}
               
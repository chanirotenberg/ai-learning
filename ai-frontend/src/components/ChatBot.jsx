import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function ChatBot() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingSession, setLoadingSession] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    async function createChatSession() {
      try {
        setLoadingSession(true);
        setError("");

        const response = await axios.post(
          "http://localhost:3003/api/chat/session",
          {
            title: "Frontend chat",
          }
        );

        setSessionId(response.data.session.id);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.details ||
            "Failed to create chat session."
        );
      } finally {
        setLoadingSession(false);
      }
    }

    createChatSession();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    setError("");

    if (!input.trim()) {
      setError("Please enter a message.");
      return;
    }

    if (!sessionId) {
      setError("Chat session is not ready yet.");
      return;
    }

    const userMessage = {
      role: "user",
      content: input.trim(),
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInput("");

    try {
      setSending(true);

      const response = await axios.post("http://localhost:3003/api/chat", {
        sessionId,
        message: userMessage.content,
      });

      setMessages(response.data.messages);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.details ||
          "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="page">
      <div className="chat-card">
        <h1>AI Chat With History</h1>
        <p className="subtitle">
          This chat creates a session, sends messages to your backend, and saves
          the conversation in PostgreSQL.
        </p>

        {loadingSession && <div className="info">Creating chat session...</div>}

        {sessionId && (
          <div className="session-box">Session ID: {sessionId}</div>
        )}

        <div className="messages-box">
          {messages.length === 0 && (
            <div className="empty-chat">
              No messages yet. Send your first message.
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className={`message-row ${
                message.role === "user" ? "user-message" : "assistant-message"
              }`}
            >
              <div className="message-bubble">
                <strong>{message.role}</strong>
                <p>{message.content}</p>
                {message.tokens_used && (
                  <span className="message-tokens">
                    Tokens: {message.tokens_used}
                  </span>
                )}
              </div>
            </div>
          ))}

          {sending && <div className="info">Assistant is typing...</div>}

          <div ref={bottomRef} />
        </div>

        {error && <div className="error">{error}</div>}

        <div className="chat-input-row">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your message..."
            rows={3}
          />

          <button onClick={sendMessage} disabled={sending || loadingSession}>
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
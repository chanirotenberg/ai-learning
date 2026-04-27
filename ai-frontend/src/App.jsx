import { useState } from "react";
import AISummarizer from "./components/AISummarizer";
import ChatBot from "./components/ChatBot";
import "./App.css";

function App() {
  const [page, setPage] = useState("summarizer");

  return (
    <>
      <nav className="nav">
        <button
          className={page === "summarizer" ? "nav-button active" : "nav-button"}
          onClick={() => setPage("summarizer")}
        >
          AI Analyzer
        </button>

        <button
          className={page === "chat" ? "nav-button active" : "nav-button"}
          onClick={() => setPage("chat")}
        >
          Chat With History
        </button>
      </nav>

      {page === "summarizer" && <AISummarizer />}
      {page === "chat" && <ChatBot />}
    </>
  );
}

export default App;
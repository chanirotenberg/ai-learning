import { useState } from "react";
import AISummarizer from "./components/AISummarizer";
import ChatBot from "./components/ChatBot";
import SummariesList from "./components/SummariesList";
import RagSearch from "./components/RagSearch";
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

        <button
          className={page === "summaries" ? "nav-button active" : "nav-button"}
          onClick={() => setPage("summaries")}
        >
          All Summaries
        </button>

        <button
          className={page === "rag" ? "nav-button active" : "nav-button"}
          onClick={() => setPage("rag")}
        >
          RAG Search
        </button>
      </nav>

      {page === "summarizer" && <AISummarizer />}
      {page === "chat" && <ChatBot />}
      {page === "summaries" && <SummariesList />}
      {page === "rag" && <RagSearch />}
    </>
  );
}

export default App;
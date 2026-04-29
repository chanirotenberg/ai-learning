import { useState } from "react";
import axios from "axios";

const RAG_API_BASE_URL = import.meta.env.VITE_RAG_API_BASE_URL;

function RagSearch() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [tokensUsed, setTokensUsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAskRag = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setError("Please enter a question.");
      setAnswer("");
      setSources([]);
      setTokensUsed(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnswer("");
      setSources([]);
      setTokensUsed(null);

      const response = await axios.post(`${RAG_API_BASE_URL}/api/rag-search`, {
        question: trimmedQuestion,
      });

      setAnswer(response.data.answer || "");
      setSources(response.data.sources || []);
      setTokensUsed(response.data.tokens_used ?? null);
    } catch (err) {
      console.error("RAG request failed:", err);
      setError(err.response?.data?.error || "Failed to get RAG answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rag-search">
      <h2>RAG Search</h2>

      <p className="section-description">
        Ask a question and get an AI answer based on documents stored in PostgreSQL with pgvector.
      </p>

      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="Ask something about AI, PostgreSQL, or React..."
        rows={5}
      />

      <button onClick={handleAskRag} disabled={loading}>
        {loading ? "Asking..." : "Ask RAG"}
      </button>

      {error && <p className="error-message">{error}</p>}

      {answer && (
        <div className="result-card">
          <h3>Answer</h3>
          <p>{answer}</p>

          {tokensUsed !== null && (
            <p className="tokens-used">Tokens used: {tokensUsed}</p>
          )}
        </div>
      )}

      {sources.length > 0 && (
        <div className="sources-card">
          <h3>Sources</h3>

          {sources.map((source, index) => (
            <div key={index} className="source-item">
              <strong>{source.title}</strong>
              <p>{source.content}</p>
              {source.distance !== undefined && (
                <small>Distance: {Number(source.distance).toFixed(4)}</small>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RagSearch;
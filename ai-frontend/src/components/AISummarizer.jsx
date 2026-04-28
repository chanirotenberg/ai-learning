import { useState } from "react";
import axios from "axios";

export default function AISummarizer() {
    const [text, setText] = useState("");
    const [result, setResult] = useState("");
    const [tokensUsed, setTokensUsed] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleAnalyze() {
        setError("");
        setResult("");
        setTokensUsed(null);

        if (!text.trim()) {
            setError("Please enter text before analyzing.");
            return;
        }

        try {
            setLoading(true);

            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

            const response = await axios.post(`${apiBaseUrl}/api/analyze`, {
                text,
            });

            setResult(response.data.result);
            setTokensUsed(response.data.tokens_used);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.details ||
                "Something went wrong while calling the server."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page">
            <div className="card">
                <h1>AI Text Analyzer</h1>
                <p className="subtitle">
                    Enter text, send it to your Express backend, and get an AI response.
                </p>

                <label className="label">Text to analyze</label>
                <textarea
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Write something here..."
                    rows={7}
                />

                <button onClick={handleAnalyze} disabled={loading}>
                    {loading ? "Analyzing..." : "Analyze"}
                </button>

                {error && <div className="error">{error}</div>}

                {result && (
                    <div className="result">
                        <h2>AI Response</h2>
                        <p>{result}</p>

                        <div className="tokens">
                            Tokens used: {tokensUsed ?? "Not available"}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
import { useEffect, useState } from "react";
import axios from "axios";

export default function SummariesList() {
    const [summaries, setSummaries] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function loadSummaries() {
        try {
            setLoading(true);
            setError("");

            const summariesApiBaseUrl = import.meta.env.VITE_SUMMARIES_API_BASE_URL;

            const response = await axios.get(`${summariesApiBaseUrl}/api/summaries`);
            setSummaries(response.data.summaries);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.details ||
                "Failed to load summaries."
            );
        } finally {
            setLoading(false);
        }
    }

    async function searchSummaries() {
        try {
            setLoading(true);
            setError("");

            if (!search.trim()) {
                await loadSummaries();
                return;
            }

            const summariesApiBaseUrl = import.meta.env.VITE_SUMMARIES_API_BASE_URL;
            const response = await axios.get(
                `${summariesApiBaseUrl}/api/summaries/search?q=${encodeURIComponent(
                    search.trim()
                )}`
            );

            setSummaries(response.data.summaries);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.details ||
                "Failed to search summaries."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSummaries();
    }, []);

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            searchSummaries();
        }
    }

    return (
        <div className="page">
            <div className="summaries-card">
                <h1>All AI Summaries</h1>
                <p className="subtitle">
                    View summaries saved in PostgreSQL and search by title, content, or
                    summary text.
                </p>

                <div className="search-row">
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search summaries..."
                    />

                    <button onClick={searchSummaries} disabled={loading}>
                        Search
                    </button>

                    <button
                        className="secondary-button"
                        onClick={() => {
                            setSearch("");
                            loadSummaries();
                        }}
                        disabled={loading}
                    >
                        Reset
                    </button>
                </div>

                {loading && <div className="info">Loading summaries...</div>}

                {error && <div className="error">{error}</div>}

                {!loading && summaries.length === 0 && (
                    <div className="empty-state">No summaries found.</div>
                )}

                <div className="summary-list">
                    {summaries.map((summary) => (
                        <article className="summary-card" key={summary.id}>
                            <div className="summary-header">
                                <div>
                                    <h2>{summary.title}</h2>
                                    <p className="summary-meta">
                                        Summary ID: {summary.id} | Document ID:{" "}
                                        {summary.document_id}
                                    </p>
                                </div>

                                <div className="tokens-pill">
                                    Tokens: {summary.tokens_used ?? "N/A"}
                                </div>
                            </div>

                            <p className="summary-text">{summary.summary}</p>

                            <p className="summary-date">
                                Created at: {new Date(summary.created_at).toLocaleString()}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
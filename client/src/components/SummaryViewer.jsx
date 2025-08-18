import React, { useState } from "react";

export default function SummaryViewer() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    setSummary("");

    const token = localStorage.getItem("spotify_token");
    if (!token) {
      setError("No Spotify token found.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/summaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spotifyAccessToken: token }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setSummary(data.summary || "No summary returned");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">AI Music Summary</h2>
      <button
        onClick={fetchSummary}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Summary"}
      </button>

      {error && (
        <p className="mt-4 text-red-600">
          Error: {error}
        </p>
      )}

      {summary && !error && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap">{summary}</pre>
        </div>
      )}
    </div>
  );
}

//page for user insights 
import { useState } from "react";

export default function Insights() {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);

    const topTracks = JSON.parse(localStorage.getItem("topTracks") || "[]");
    const ratings = JSON.parse(localStorage.getItem("ratings") || "{}");
    const audioFeatures = []; // TODO: fetch from backend if needed

    const res = await fetch("http://localhost:3001/api/insights/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topTracks, ratings, audioFeatures }),
    });

    const data = await res.json();
    setInsights(data.insights);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎵 AI-Powered Insights</h1>
      <button 
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={generateInsights}
        disabled={loading}
      >
        {loading ? "Generating..." : "Get My Insights"}
      </button>

      {insights && (
        <div className="mt-6 whitespace-pre-wrap border p-4 rounded bg-gray-100">
          {insights}
        </div>
      )}
    </div>
  );
}

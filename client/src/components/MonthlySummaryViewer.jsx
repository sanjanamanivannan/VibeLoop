import React, { useState } from "react";
import { sendAnalyticsEvent } from "../utils/analytics"; // adjust path

export default function MonthlySummaryViewer({ userId }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMonthlySummary = async () => {
    setLoading(true);
    setError("");
    setSummary("");

    try {
      // Track summary generation request
      await sendAnalyticsEvent({ event: "summary_generation_request", summaryType: "monthly", userId });

      const res = await fetch("http://localhost:3001/summaries/monthly", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);

        // Optionally track summary viewed event here
        await sendAnalyticsEvent({ event: "summary_view", summaryType: "monthly", userId });
      } else {
        setError(data.error || "Something went wrong.");
        await sendAnalyticsEvent({ event: "error", message: data.error || "Unknown error", context: "monthly_summary_fetch", userId });
      }
    } catch (err) {
      setError("Failed to fetch monthly summary.");
      await sendAnalyticsEvent({ event: "error", message: err.message, context: "monthly_summary_fetch", userId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-900 text-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Monthly Music Summary</h2>
      <button
        onClick={fetchMonthlySummary}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Generate Summary"}
      </button>

      {error && <p className="mt-4 text-red-400">{error}</p>}

      {summary && (
        <div className="mt-6 p-4 bg-gray-800 rounded">
          <pre className="whitespace-pre-wrap">{summary}</pre>
        </div>
      )}
    </div>
  );
}

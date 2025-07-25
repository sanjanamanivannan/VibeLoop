import React, { useEffect, useState } from "react";

export default function UserAnalyticsDashboard({ userId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetch(`http://localhost:3001/analytics/${userId}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Unknown error");
        }
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load analytics");
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p className="mt-2 text-sm text-gray-500">📊 Loading analytics...</p>;
  if (error) return <p className="text-red-500 mt-2">⚠️ {error}</p>;
  if (!stats) return <p className="mt-2">No analytics data found.</p>;

  return (
    <div className="bg-gray-100 p-4 mt-2 rounded shadow-md max-w-md">
      <h2 className="text-lg font-semibold mb-2">📈 Your Analytics (last 7 days)</h2>
      <ul className="list-disc list-inside text-sm">
        <li>🟢 Logins: <strong>{stats.loginCount}</strong></li>
        <li>🧠 Monthly Summary Requests: <strong>{stats.summaryRequests.monthly}</strong></li>
        <li>📄 Monthly Summary Views: <strong>{stats.summaryViews.monthly}</strong></li>
        <li>❌ Errors Logged: <strong>{stats.errorCount}</strong></li>
      </ul>
    </div>
  );
}

import React, { useState } from "react";
import UserAnalyticsDashboard from "./UserAnalyticsDashboard";

export default function AnalyticsButton({ userId }) {
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowAnalytics(!showAnalytics)}
        className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
      >
        {showAnalytics ? "Hide Analytics" : "View Analytics"}
      </button>

      {showAnalytics && <UserAnalyticsDashboard userId={userId} />}
    </div>
  );
}

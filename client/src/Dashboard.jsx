import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import processSpotifyTracks, { sendAnalyticsEvent } from "../utils/analytics";
import AnalyticsViewer from "./components/AnalyticsViewer";

export default function Dashboard({ userId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topTracks, setTopTracks] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopTracks = async () => {
      const token = localStorage.getItem("spotify_token");
      console.log("📦 Token from localStorage:", token);

      if (!token) {
        console.warn("❌ No token found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Spotify API error: ${errorText}`);
        }

        const data = await res.json();
        console.log("🎧 Spotify API response:", data);

        if (data.items && data.items.length > 0) {
          setTopTracks(data.items);

          // Store in localStorage for ListeningPatterns
          localStorage.setItem("topTracks", JSON.stringify(data.items));

          // Process and send analytics
          const processed = processSpotifyTracks(data.items);

          await sendAnalyticsEvent({
            event: "spotify_stats_processed",
            ...processed,
          });

          await fetch(`http://localhost:3001/analytics/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(processed),
          });
        } else {
          console.warn("⚠️ No tracks found in response");
        }
      } catch (err) {
        console.error("🚨 Error during analytics processing:", err);
        setError("Something went wrong while syncing Spotify data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopTracks();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("spotify_token");
    navigate("/");
  };

  if (loading) return <p>Loading your top tracks...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Your Top Tracks</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <Link to="/search">
          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            Search Songs
          </button>
        </Link>
        <Link to="/summary">
          <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
            View Listening Summary
          </button>
        </Link>
        <button
          onClick={() => navigate("/patterns")}
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
        >
          View Listening Patterns
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowAnalytics((prev) => !prev)}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          {showAnalytics ? "Hide Analytics" : "Show My Analytics"}
        </button>
      </div>

      {showAnalytics && <AnalyticsViewer userId={userId} />}

      {error && <p className="text-red-500">{error}</p>}

      {!error && (
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-2">🎧 Top 10 Tracks</h2>
          <ul className="list-disc list-inside text-sm">
            {topTracks.map((track, index) => (
              <li key={track.id || index}>
                {track.name} —{" "}
                <em>{track.artists.map((a) => a.name).join(", ")}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}



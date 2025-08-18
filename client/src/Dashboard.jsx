import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import processSpotifyTracks, { sendAnalyticsEvent } from "./utils/analytics";
import AnalyticsViewer from "./components/AnalyticsViewer"; // ✅ Ensure this path is correct

export default function Dashboard({ userId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topTracks, setTopTracks] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false); // ✅ New state for toggling
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    console.log("📦 Token from localStorage:", token);
  
    if (!token) {
      console.warn("❌ No token found in localStorage");
      setLoading(false);
      return;
    }
  
    fetch("https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Spotify API error: ${errorText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("🎧 Spotify API response:", data);
        if (data.items && data.items.length > 0) {
          setTracks(data.items);
        } else {
          console.warn("⚠️ No tracks found in response");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("🚨 Fetch error:", err);

        const data = await res.json();
        setTopTracks(data.items);

        // Send raw and processed data
        await fetch(`http://localhost:3001/analytics/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topArtists: ["Drake", "SZA", "Travis Scott"],
            topGenres: ["Hip-Hop", "R&B"],
            totalMinutes: 34,
          }),
        });

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
      } catch (err) {
        console.error("🚨 Error during analytics processing:", err);
        setError("Something went wrong while syncing Spotify data.");
      } finally {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("spotify_token"); // Clear token
    navigate("/"); // Go back to login
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

      {/* ✅ Button to toggle analytics */}
      <div className="mb-4">
        <button
          onClick={() => setShowAnalytics((prev) => !prev)}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          {showAnalytics ? "Hide Analytics" : "Show My Analytics"}
        </button>
      </div>

      {/* ✅ Render analytics viewer if toggled */}
      {showAnalytics && <AnalyticsViewer userId={userId} />}

      {loading && <p>🔄 Syncing with Spotify...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>

          {/* 🎧 Display Top 10 Tracks */}
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
        </>
      )}
    </div>
  );
}


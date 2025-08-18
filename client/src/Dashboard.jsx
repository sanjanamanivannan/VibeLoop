import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import processSpotifyTracks, { sendAnalyticsEvent } from "./utils/analytics";
import AnalyticsButton from "./components/AnalyticsButton";

export default function Dashboard({ userId }) {
  console.log("Sending analytics for userId:", userId);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topTracks, setTopTracks] = useState([]); // 🆕 Track state
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem("spotify_token");
    if (!token) {
      console.warn("❌ No token found in localStorage");
      setLoading(false);
      return;
    }

    const fetchTopTracks = async () => {
      try {
        const res = await fetch(
          "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("spotify_token");
            navigate("/");
          }
          const errorText = await res.text();
          throw new Error(`Spotify API error: ${errorText}`);
        }

        const data = await res.json();
        setTopTracks(data.items); // 🆕 Save tracks to state

        // ✅ 1. Send raw tracks
        console.log("🚀 Sending analytics for userId:", userId); 
        await fetch(`http://localhost:3001/analytics/${userId}`, {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
        },
          body: JSON.stringify({
          topArtists: ["Drake", "SZA", "Travis Scott"],
          topGenres: ["Hip-Hop", "R&B"],
          totalMinutes: 34,
        }),
      });


        // ✅ 2. Process locally
        const processed = processSpotifyTracks(data.items);

        // ✅ 3. Send analytics event (optional)
        await sendAnalyticsEvent({
          event: "spotify_stats_processed",
          ...processed,
        });

        // ✅ 4. Send processed stats
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
      }
    };

    fetchTopTracks();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("spotify_token");
    navigate("/");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Your Top Tracks</h1>
        <div>
          <button
            onClick={() => navigate("/summary")}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
          >
            Summary
          </button>
          <button
            onClick={() => navigate("/monthly-summary")}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
          >
            Monthly Summary
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
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


      {tracks.length === 0 ? (
        <p>😢 No tracks found.</p>
      ) : (
        <ul>
          {tracks.map((track) => (
            <li key={track.id}>
              {track.name} — {track.artists[0].name}
            </li>
          ))}
        </ul>
      <AnalyticsButton userId={userId} />

      {loading && <p>🔄 Syncing with Spotify...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <p className="text-green-600 mb-2">✅ Spotify data synced!</p>

          {/* 🎧 Display Top 10 Tracks */}
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-2">🎧 Top 10 Tracks</h2>
            <ul className="list-disc list-inside text-sm">
              {topTracks.map((track, index) => (
                <li key={track.id || index}>
                  {track.name} —{" "}
                  <em>
                    {track.artists.map((a) => a.name).join(", ")}
                  </em>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

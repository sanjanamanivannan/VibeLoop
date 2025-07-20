import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnalyticsButton from "./components/AnalyticsButton";

export default function Dashboard({ userId }) {  // <-- accept userId as a prop
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🆔 Current userId:", userId); // example usage

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
        setLoading(false);
      });
  }, [userId]); // add userId to dependency array if you want effect to run on userId change

  const handleLogout = () => {
    localStorage.removeItem("spotify_token"); // Clear token
    navigate("/"); // Go back to login
  };

  if (loading) return <p>Loading your top tracks...</p>;

  return (
    <div className="p-4">
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

      {/* Analytics button */}
      <div className="mb-4">
        <AnalyticsButton userId={userId} />
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
      )}
    </div>
  );
}

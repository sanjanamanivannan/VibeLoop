import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


export default function Dashboard() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
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


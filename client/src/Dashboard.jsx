import { useEffect, useState } from "react";

export default function Dashboard() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    console.log("📦 Retrieved token:", token);

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
      .then((res) => res.json())
      .then((data) => {
        console.log("🎧 Spotify response:", data);
        if (data.items) {
          setTracks(data.items);
        } else {
          console.warn("⚠️ No items found in Spotify response", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("🚨 Fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading your top tracks...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Top Tracks</h1>
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

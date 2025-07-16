import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import FirestoreRatingHandler, { getUserRatings } from "./FirestoreRatingHandler";

export default function SongSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [userRatings, setUserRatings] = useState({});
  const [currentUserId, setCurrentUserId] = useState("user123"); // Replace with actual user ID from auth

  const token = localStorage.getItem("spotify_token");

  // Load user's existing ratings when component mounts
  useEffect(() => {
    const loadUserRatings = async () => {
      if (currentUserId) {
        const ratings = await getUserRatings(currentUserId);
        setUserRatings(ratings);
      }
    };

    loadUserRatings();
  }, [currentUserId]);

  const handleSearch = async () => {
    const res = await fetch(`http://localhost:3001/api/spotify/search?q=${query}&token=${token}`);
    const data = await res.json();
    setResults(data);
  };

  const handleRatingClose = async () => {
    setSelectedSong(null);
    // Refresh ratings after closing popup
    if (currentUserId) {
      const ratings = await getUserRatings(currentUserId);
      setUserRatings(ratings);
    }
  };

  return (
    <div className="p-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a song..."
        className="border p-2 rounded"
      />
      <button onClick={handleSearch} className="ml-2 bg-green-500 text-white px-4 py-2 rounded">
        Search
      </button>

      <ul className="mt-4 space-y-3">
        {results.map((track) => (
          <li key={track.id} className="border p-3 rounded shadow flex justify-between items-center">
            <div>
              {track.name} by {track.artists.map((a) => a.name).join(", ")}
              {/* Show existing rating if available */}
              {userRatings[track.id] && (
                <div className="text-sm text-yellow-500 mt-1">
                  ⭐ {userRatings[track.id].rating}/5
                  {userRatings[track.id].feedback && (
                    <span className="text-gray-600 ml-2">
                      "{userRatings[track.id].feedback}"
                    </span>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setSelectedSong(track);
              }}
              className="hover:text-yellow-400 text-gray-500"
            >
              <Star size={24} />
            </button>
          </li>
        ))}
      </ul>

      {/* Firestore Rating popup */}
      {selectedSong && (
        <FirestoreRatingHandler
          song={selectedSong}
          onClose={handleRatingClose}
          userId={currentUserId}
          initialRating={userRatings[selectedSong.id]?.rating || 0}
          initialFeedback={userRatings[selectedSong.id]?.feedback || ""}
        />
      )}
    </div>
  );
}
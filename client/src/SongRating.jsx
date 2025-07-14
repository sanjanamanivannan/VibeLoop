import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function SongRating({ song, userId }) {
  const [rating, setRating] = useState(0);

  const handleRate = async (value) => {
    setRating(value);

    const ratingData = {
      userId,
      spotifyTrackId: song.id,
      trackName: song.name,
      artist: song.artists[0].name,
      rating: value,
      timestamp: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, "ratings", `${userId}_${song.id}`), ratingData);
      console.log("⭐ Rating saved:", ratingData);
    } catch (error) {
      console.error("❌ Failed to save rating:", error);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[...Array(10)].map((_, index) => (
        <button
          key={index}
          onClick={() => handleRate(index + 1)}
          className={`text-xl ${
            index < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

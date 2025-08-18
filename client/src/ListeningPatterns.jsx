import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ListeningPatterns() {
  const [patternData, setPatternData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatterns = async () => {
      const topTracks = JSON.parse(localStorage.getItem("topTracks") || "[]");

      const res = await fetch("http://localhost:3001/api/spotify/audio-features", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tracks: topTracks.map(track => track.id)
        })
      });

      const { audioFeatures } = await res.json();

      const moodBuckets = {
        chill: 0,
        energetic: 0,
        happy: 0,
        sad: 0,
      };

      for (let feature of audioFeatures) {
        if (!feature) continue;
        const { energy, valence } = feature;

        if (energy < 0.4 && valence < 0.4) moodBuckets.sad++;
        else if (energy < 0.5) moodBuckets.chill++;
        else if (valence > 0.6) moodBuckets.happy++;
        else moodBuckets.energetic++;
      }

      setPatternData(Object.entries(moodBuckets).map(([label, count]) => ({
        mood: label,
        count
      })));

      setLoading(false);
    };

    fetchPatterns();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🎧 Your Listening Mood Patterns</h2>
      {loading ? (
        <p>Analyzing your tracks...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={patternData}>
            <XAxis dataKey="mood" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

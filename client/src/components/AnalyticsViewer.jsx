// src/components/AnalyticsViewer.jsx
import React, { useEffect, useState } from "react";

export default function AnalyticsViewer({ userId }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`http://localhost:3001/analytics/${userId}`);
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [userId]);

  if (loading) return <p>Loading analytics...</p>;
  if (!analytics) return <p>No analytics data available.</p>;

  return (
    <div>
      <h2>🎧 Your Listening Analytics</h2>

      <h3>Top Artists</h3>
      <ul>
        {analytics.topArtists?.map((artist, index) => (
          <li key={index}>{artist.name} — {artist.count} plays</li>
        ))}
      </ul>

      <h3>Top Albums</h3>
      <ul>
        {analytics.topAlbums?.map((album, index) => (
          <li key={index}>{album.name} — {album.count} plays</li>
        ))}
      </ul>

      <h3>Top Genres</h3>
      <ul>
        {analytics.topGenres?.map((genre, index) => (
          <li key={index}>{genre.name} — {genre.count} plays</li>
        ))}
      </ul>
    </div>
  );
}

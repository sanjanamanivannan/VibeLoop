// utils/analytics.js

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function sendAnalyticsEvent(eventData) {
  try {
    const userId = localStorage.getItem("userId");
    await fetch(`${BACKEND_URL}/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        timestamp: new Date().toISOString(),
        ...eventData,
      }),
    });
  } catch (error) {
    console.error("Failed to send analytics event", error);
  }
}

export async function fetchUserAnalytics(userId) {
  try {
    const res = await fetch(`${BACKEND_URL}/analytics/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch analytics data");

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Analytics fetch error:", err);
    return { error: err.message };
  }
}

export default function processSpotifyTracks(tracks) {
  const artistCounts = {};
  const genreCounts = {};
  let totalDurationMs = 0;

  for (const track of tracks) {
    const artists = track.artists.map((a) => a.name);
    artists.forEach((name) => {
      artistCounts[name] = (artistCounts[name] || 0) + 1;
    });

    track.genres?.forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });

    totalDurationMs += track.duration_ms || 0;
  }

  const topArtists = Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((entry) => entry[0]);

  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((entry) => entry[0]);

  return {
    topArtists,
    topGenres,
    totalMinutes: Math.round(totalDurationMs / 60000),
  };
}

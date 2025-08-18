// controllers/analyticsController.js

import { getTrackMetadata } from "../utils/spotifyMetadata.js";
import { saveTrackToFirebase } from "../utils/Track.js";
import admin from "../firebase.js";
const db = admin.firestore();

export async function processSpotifyTracks(req, res) {
  const { topTracks, token, userId } = req.body;

  try {
    const enrichedTracks = await Promise.all(
      topTracks.map(track => getTrackMetadata(track, token))
    );

    for (const track of enrichedTracks) {
      await saveTrackToFirebase(userId, track);
    }

    res.status(200).json({ message: "Tracks saved successfully!" });
  } catch (error) {
    console.error("Error processing tracks:", error);
    res.status(500).json({ error: "Failed to process tracks" });
  }
}

export async function getUserAnalytics(req, res) {
  const { userId } = req.params;

  try {
    const snapshot = await db.collection("users").doc(userId).collection("tracks").get();

    const artistCounts = {};
    const genreCounts = {};
    const albumCounts = {};

    snapshot.forEach(doc => {
      const data = doc.data();

      // Count artists
      if (data.artist) {
        artistCounts[data.artist] = (artistCounts[data.artist] || 0) + 1;
      }

      // Count genres
      data.genres?.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });

      // Count albums
      if (data.album) {
        albumCounts[data.album] = (albumCounts[data.album] || 0) + 1;
      }
    });

    res.status(200).json({
      topArtists: sortByCount(artistCounts),
      topGenres: sortByCount(genreCounts),
      topAlbums: sortByCount(albumCounts),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
}

function sortByCount(obj) {
  return Object.entries(obj)
    .sort(([, a], [, b]) => b - a)
    .map(([key, count]) => ({ name: key, count }));
}

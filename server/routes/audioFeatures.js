import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/audio-features", async (req, res) => {
  const { tracks } = req.body;
  const token = req.query.token || req.headers.authorization?.split(" ")[1];

  // Basic validation
  if (!Array.isArray(tracks) || tracks.length === 0) {
    return res.json({ audioFeatures: [] }); // Always return an array
  }

  try {
    const trackIds = tracks.map((track) => track.id).join(",");
    const response = await axios.get(
      `https://api.spotify.com/v1/audio-features?ids=${trackIds}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Always return an array, even if Spotify sends null
    res.json({ audioFeatures: response.data.audio_features || [] });
  } catch (error) {
    console.error(
      "Failed to fetch audio features:",
      error.response?.data || error.message
    );
    res.json({ audioFeatures: [] }); // Prevent frontend crash
  }
});

export default router;

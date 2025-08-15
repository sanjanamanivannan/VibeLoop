import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/audio-features", async (req, res) => {
  const { tracks } = req.body;
  const token = req.query.token || req.headers.authorization?.split(" ")[1];

  try {
    const trackIds = tracks.map((track) => track.id).join(",");
    const response = await axios.get(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json({ audioFeatures: response.data.audio_features });
  } catch (error) {
    console.error("Failed to fetch audio features", error.message);
    res.status(500).json({ error: "Could not fetch audio features" });
  }
});

export default router;

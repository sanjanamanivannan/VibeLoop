import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

// Import generateMusicSummary from functions directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const functionsPath = path.resolve(__dirname, "../../functions/generateSummary.js");
const { generateMusicSummary } = await import(`file://${functionsPath}`);

const router = express.Router();

/**
 * POST /summaries
 * Body: { spotifyAccessToken: string }
 */
router.post("/", async (req, res) => {
  const { spotifyAccessToken } = req.body;

  if (!spotifyAccessToken) {
    return res.status(400).json({ error: "Missing spotifyAccessToken in request body." });
  }

  try {
    // Get top tracks from Spotify
    const spotifyRes = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=15", {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });

    if (!spotifyRes.ok) {
      const error = await spotifyRes.json();
      throw new Error(`Spotify API Error: ${error.error.message}`);
    }

    const data = await spotifyRes.json();
    const trackList = data.items
      .map(track => `${track.name} by ${track.artists.map(a => a.name).join(", ")}`)
      .join("\n");

    // Call your OpenAI summary function
    const summary = await generateMusicSummary(trackList);

    return res.status(200).json({ summary });
  } catch (error) {
    console.error("Summary generation failed:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

export default router;

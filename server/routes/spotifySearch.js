import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/search", async (req, res) => {
  const { q, token } = req.query;
  if (!q || !token) return res.status(400).json({ error: "Missing query or token" });

  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q,
        type: "track",
        limit: 10,
      },
    });

    res.json(response.data.tracks.items);
  } catch (err) {
    console.error("Search error:", err.response?.data || err.message);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;

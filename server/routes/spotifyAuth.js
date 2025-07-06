import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/getSpotifyToken", async (req, res) => {
  const code = req.body.code;

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", process.env.SPOTIFY_REDIRECT_URI);

    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
    };

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      headers
    );

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to get access token" });
  }
});

export default router;

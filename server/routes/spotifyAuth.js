import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { verifySpotifyToken, getOrCreateFirebaseUser } from "../utils/spotify.js";
import admin from "firebase-admin";

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

router.get("/callback/spotify", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Missing code");

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

    const access_token = response.data.access_token;
    const frontendRedirectUri = process.env.FRONTEND_REDIRECT_URI || "http://localhost:5173/callback";

    // ✅ Redirect to frontend and include access_token as a query param
    res.redirect(`${frontendRedirectUri}?access_token=${access_token}`);
  } catch (error) {
    console.error("Error exchanging code:", error);
    res.status(500).send("Authentication failed");
  }
});
router.post("/save-token", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "No token received" });
  }

  try {
    const spotifyUser = await verifySpotifyToken(token);
    const firebaseUser = await getOrCreateFirebaseUser(spotifyUser);

    const customToken = await admin.auth().createCustomToken(firebaseUser.uid);

    res.status(200).json({ message: "User authenticated", customToken });
  } catch (err) {
    console.error("❌ Auth error:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
});
export default router;

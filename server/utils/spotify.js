// utils/spotify.js
import fetch from "node-fetch";
import admin from "../firebase.js";
export async function verifySpotifyToken(token) {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Invalid Spotify token");
  }

  return await response.json(); // This is the Spotify user info
}

export async function getOrCreateFirebaseUser(spotifyUser) {
  const uid = `spotify:${spotifyUser.id}`;

  try {
    return await admin.auth().getUser(uid);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      // Check if email is already in use
      let emailAlreadyExists = false;
      if (spotifyUser.email) {
        try {
          await admin.auth().getUserByEmail(spotifyUser.email);
          emailAlreadyExists = true;
        } catch (err) {
          if (err.code !== "auth/user-not-found") throw err;
        }
      }

      return await admin.auth().createUser({
        uid,
        displayName: spotifyUser.display_name || "Spotify User",
        photoURL: spotifyUser.images?.[0]?.url || null,
        ...(emailAlreadyExists ? {} : { email: spotifyUser.email }),
      });
    } else {
      throw error;
    }
  }
}

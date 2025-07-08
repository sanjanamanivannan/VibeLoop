import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import spotifyAuth from "./routes/spotifyAuth.js"; 

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔗 Connect Spotify route
app.use("/api/auth", spotifyAuth);

// Test route (optional)
app.get("/", (req, res) => {
  res.send("VibeLoop backend running 🎧");
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

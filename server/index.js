import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin"; 
import { readFileSync } from 'fs';
const serviceAccount = JSON.parse(readFileSync(new URL('./serviceAccountKey.json', import.meta.url)));
import spotifyAuth from "./routes/spotifyAuth.js"; 
import OpenAI from "openai";
import summariesRouter from "./routes/summaries.js";
import groupRecommenderRouter from './routes/groupRecommender.js';
import spotifySearchRouter from "./routes/spotifySearch.js";
import insightsRouter from "./routes/insights.js";
import audioFeatureRoutes from "./routes/audioFeatures.js";



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();


// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use("/api/auth", spotifyAuth);
app.use("/summaries", summariesRouter);
app.use('/group-recommender', groupRecommenderRouter);
app.use("/api/spotify", spotifySearchRouter);
app.use("/api/insights", insightsRouter);
app.use("/api/spotify", audioFeatureRoutes);
app.use("/summaries/monthly", monthlySummariesRouter);  // <-- mount monthly summaries route here
app.use("/group-recommender", groupRecommenderRouter);
app.use("/analytics", analyticsRouter); 


// Root test route
app.get("/", (req, res) => {
  res.send("VibeLoop backend running 🎧");
});

// OpenAI test route
app.get("/test-openai", async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello! This is a test message." }],
      max_tokens: 50,
    });

    res.json({
      success: true,
      message: response.choices[0].message.content,
      tokens_used: response.usage.total_tokens,
    });
  } catch (error) {
    console.error("OpenAI test error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});



// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

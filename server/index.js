import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import spotifyAuth from "./routes/spotifyAuth.js"; 
import OpenAI from 'openai';
import summariesRouter from "./routes/summaries.js";
import groupRecommenderRouter from './routes/groupRecommender.js';
import spotifySearchRouter from "./routes/spotifySearch.js";
import insightsRouter from "./routes/insights.js";
import audioFeatureRoutes from "./routes/audioFeatures.js";

import analyticsRouter from "./routes/analytics.js";
import helmet from "helmet";


// Load env vars first
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



dotenv.config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// 🔗 Connect Spotify route
app.use("/api/auth", spotifyAuth);
app.use("/summaries", summariesRouter);
app.use('/group-recommender', groupRecommenderRouter);
app.use("/api/spotify", spotifySearchRouter);
app.use("/api/insights", insightsRouter);
app.use("/api/spotify", audioFeatureRoutes);
app.use("/analytics", analyticsRouter); 


// Test route (optional)
app.get("/", (req, res) => {
  res.send("VibeLoop backend running 🎧");
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Add this route to test your OpenAI integration
app.get('/test-openai', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello! This is a test message.' }],
      max_tokens: 50
    });
    
    res.json({ 
      success: true, 
      message: response.choices[0].message.content,
      tokens_used: response.usage.total_tokens
    });
  } catch (error) {
    console.error('OpenAI test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
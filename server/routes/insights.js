// routes/insights.js
import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/generate', async (req, res) => {
  const { topTracks, ratings, audioFeatures } = req.body;

  try {
    const messages = [
      {
        role: "system",
        content: "You are a music analyst assistant generating insights from a user's listening history.",
      },
      {
        role: "user",
        content: `
Here are the user's top tracks: ${JSON.stringify(topTracks, null, 2)}

Here are the user's ratings and comments: ${JSON.stringify(ratings, null, 2)}

Here are the audio features of some tracks: ${JSON.stringify(audioFeatures, null, 2)}

Generate a 3-paragraph summary of the user's listening trends and suggest a few new directions to explore.
        `,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      max_tokens: 500,
    });

    res.json({ insights: response.choices[0].message.content });
  } catch (error) {
    console.error("Insights generation error:", error);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

export default router;

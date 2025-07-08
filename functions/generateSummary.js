import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a friendly music summary from a list of tracks.
 * @param {Array} tracks - Array of track objects with name, artist, genres, mood, valence
 * @returns {string} GPT-generated summary text
 */
export async function generateMusicSummary(tracks) {
  const formattedTracks = tracks
    .map(
      (track, i) =>
        `${i + 1}. "${track.name}" by ${track.artist} — genres: ${track.genres.join(
          ", "
        )}, mood: ${track.mood}, valence: ${track.valence}`
    )
    .join("\n");

  const prompt = `
You are a friendly music assistant. Here's a list of songs a user listened to this week:

${formattedTracks}

Write a 3–4 sentence summary describing their overall music mood and patterns this week.
Keep it conversational, like a Spotify Wrapped blurb.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating summary:", error);
    return "We couldn't generate your music summary this week. Try again later!";
  }
}

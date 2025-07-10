import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Trims logs to last 7 by date or count.
 */
function trimLogs(logs, maxCount = 7) {
  return logs
    .filter(log => log.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // oldest to newest
    .slice(-maxCount);
}

/**
 * Generates a friendly music summary from a list of tracks.
 * @param {Array} logs - Array of user logs (each with name, artist, tags, note, date)
 * @returns {string} GPT-generated summary text
 */
export async function generateMusicSummary(logs) {
  const trimmedLogs = trimLogs(logs);

  const formattedTracks = trimmedLogs
    .map((track, i) => {
      const name = track.track || "Unknown Track";
      const artist = track.artist || "Unknown Artist";
      const tags = (track.tags || []).slice(0, 3).join(", ");
      const note = (track.note || "").slice(0, 100); // max 100 chars

      return `${i + 1}. "${name}" by ${artist} — tags: ${tags}${note ? `, note: ${note}` : ""}`;
    })
    .join("\n");

  const prompt = [
    {
      role: "system",
      content: "You are a friendly music assistant. Given a user's listening history, generate a fun and personalized weekly music summary.",
    },
    {
      role: "user",
      content: `Here's the list of songs the user listened to this week:\n\n${formattedTracks}\n\nWrite a 3–4 sentence conversational summary of their music mood and patterns this week.`,
    }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: prompt,
      max_tokens: 300, // stays under budget
      temperature: 0.7
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating summary:", error);
    return "We couldn't generate your music summary this week. Try again later!";
  }
}

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Trims logs per user for token efficiency
 */
function trimUserLogs(logs, maxPerUser = 5) {
  return logs
    .filter(log => log.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-maxPerUser);
}

/**
 * Formats logs per user into compact bullet points
 */
function formatGroupLogs(userLogsMap) {
  return Object.entries(userLogsMap)
    .map(([userName, logs]) => {
      const trimmed = trimUserLogs(logs);
      const entries = trimmed
        .map((log, i) => {
          const track = log.track || "Unknown Track";
          const artist = log.artist || "Unknown Artist";
          const tags = (log.tags || []).slice(0, 2).join(", ");
          return `  ${i + 1}. "${track}" by ${artist}${tags ? ` — tags: ${tags}` : ""}`;
        })
        .join("\n");

      return `👤 ${userName}:\n${entries}`;
    })
    .join("\n\n");
}

/**
 * Generates group music recommendation summary
 * @param {Object} userLogsMap - key: username, value: array of logs
 * @returns {string} GPT-generated group recommendation
 */
export async function generateGroupRecommendation(userLogsMap) {
  const formattedLogs = formatGroupLogs(userLogsMap);

  const prompt = [
    {
      role: "system",
      content: "You are a fun and smart music assistant that creates personalized group playlist suggestions based on listening history.",
    },
    {
      role: "user",
      content: `Here are music logs from each member of a group:\n\n${formattedLogs}\n\nBased on everyone's recent songs, suggest a shared music vibe or playlist idea that blends everyone's taste. Keep it under 4 sentences and make it feel like a music friend recommending a vibe.`,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: prompt,
      max_tokens: 250,
      temperature: 0.8
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating group recommendation:", error);
    return "We couldn't generate a group music suggestion this time. Try again later!";
  }
}

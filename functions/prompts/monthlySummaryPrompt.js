// prompts/monthlySummaryPrompt.js
export function createMonthlySummaryPrompt(userLogs) {
  const trimmedLogs = userLogs
    .filter(log => log.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-30); // limit to last 30 entries

  const formatted = trimmedLogs
    .map((log, i) => {
      const track = log.track || "Unknown";
      const artist = log.artist || "Unknown";
      const tags = (log.tags || []).join(", ");
      const note = log.note ? `Note: ${log.note.slice(0, 80)}` : "";

      return `${i + 1}. ${track} by ${artist} — Tags: ${tags}${note ? ` (${note})` : ""}`;
    })
    .join("\n");

  const prompt = [
    {
      role: "system",
      content: "You are a friendly music analyst. Your job is to summarize a user's monthly music habits and trends.",
    },
    {
      role: "user",
      content: `Here is a list of tracks the user has logged over the past month:\n\n${formatted}\n\nWrite a 5–6 sentence conversational summary highlighting mood shifts, favorite genres, artist patterns, or standout notes. End with an encouraging or nostalgic message.`,
    },
  ];

  return prompt;
}

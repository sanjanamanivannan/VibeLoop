// /functions/prompts/summaryPrompts.js

export function createSummaryPrompt(logs) {
  return [
    {
      role: "system",
      content: "You are a helpful assistant that summarizes music listening logs into a concise, engaging music summary."
    },
    {
      role: "user",
      content: `Given the following music listening logs, generate a weekly summary highlighting moods, artists, and listening patterns:

${logs.map(log => `- Track: ${log.track}, Artist: ${log.artist}, Tags: ${log.tags.join(", ")}, Note: ${log.note}, Date: ${log.date}`).join("\n")}
`
    }
  ];
}

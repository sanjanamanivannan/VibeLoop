// /functions/prompts/groupRecommendationPrompts.js

export function createGroupRecommendationPrompt(userLogsByMember) {
  return [
    {
      role: "system",
      content: "You are an assistant that recommends music tracks for a group based on the combined listening preferences of its members."
    },
    {
      role: "user",
      content: `Here are the listening logs for the group members:

${userLogsByMember.map(({ memberId, logs }) =>
  `Member ${memberId}:\n` + logs.map(log => `- ${log.track} by ${log.artist} (${log.tags.join(", ")})`).join("\n")
).join("\n\n")}

Please suggest 5 songs the group might enjoy together and explain why.`
    }
  ];
}

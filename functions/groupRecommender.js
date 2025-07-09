import OpenAI from "openai";
import { groupRecommendationPrompt } from "./promptTemplates.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateGroupRecommendation(groupData) {
  try {
    const prompt = groupRecommendationPrompt(groupData);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful AI music recommendation assistant." },
        { role: "user", content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const recommendationText = completion.choices[0].message.content;
    return recommendationText;
  } catch (error) {
    console.error("Error generating group recommendation:", error);
    throw error;
  }
}

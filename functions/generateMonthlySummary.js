import { createMonthlySummaryPrompt } from "./prompts/monthlySummaryPrompt.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateMonthlySummary(userLogs) {
  const prompt = createMonthlySummaryPrompt(userLogs);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error("Monthly summary error:", err.message);
    return "Sorry, we couldn't generate your monthly summary right now.";
  }
}
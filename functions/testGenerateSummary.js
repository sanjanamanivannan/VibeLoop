import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

import { generateMusicSummary } from './generateSummary.js';

const testTracks = [
  {
    name: "Motion Sickness",
    artist: "Phoebe Bridgers",
    genres: ["indie rock", "singer-songwriter"],
    mood: "melancholy",
    valence: 0.3,
  },
  {
    name: "Borderline",
    artist: "Tame Impala",
    genres: ["psych pop", "indie"],
    mood: "dreamy",
    valence: 0.6,
  },
  {
    name: "CUFF IT",
    artist: "Beyoncé",
    genres: ["pop", "funk", "dance"],
    mood: "energetic",
    valence: 0.8,
  },
];

(async () => {
  const summary = await generateMusicSummary(testTracks);
  console.log("🎧 Your AI-Generated Music Summary:\n", summary);
})();

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
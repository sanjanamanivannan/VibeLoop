import express from "express";
import { generateMonthlySummary } from "../../functions/generateMonthlySummary.js";
import { getUserLogs } from "../firestore/logHelpers.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const logs = await getUserLogs(userId);
    const summary = await generateMonthlySummary(logs);
    return res.json({ summary });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

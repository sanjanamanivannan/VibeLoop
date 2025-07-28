import express from "express";
import {
  postAnalyticsEvent,
  getStats,
  getUserAnalytics,
  saveUserAnalytics, // <-- You need this for POST /analytics/:userId
} from "../controllers/analyticsController.js";

const router = express.Router();
// ✅ Save analytics data for a specific user
router.post("/:userId", saveUserAnalytics);

// Log a general event
router.post("/", postAnalyticsEvent);

// Optional: precomputed global stats
router.get("/stats", getStats);

// ✅ Retrieve analytics summary for a specific user
router.get("/:userId", getUserAnalytics);

export default router;

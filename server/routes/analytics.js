import express from "express";
import { postAnalyticsEvent, getStats, getUserAnalytics} from "../controllers/analyticsController.js";
import { getFirestore } from "firebase-admin/firestore";

const router = express.Router();
const db = getFirestore();

// POST /analytics — log analytics event
router.post("/", postAnalyticsEvent);

// GET /analytics/stats — (optional) any preexisting stats
router.get("/stats", getStats);

// ✅ NEW: GET /analytics/:userId — get user analytics summary
router.get("/:userId", getUserAnalytics);

export default router;

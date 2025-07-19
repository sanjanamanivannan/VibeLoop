import express from "express";
import { postAnalyticsEvent, getStats } from "../controllers/analyticsController.js";

const router = express.Router();

router.post("/", postAnalyticsEvent);
router.get("/stats", getStats);

export default router;

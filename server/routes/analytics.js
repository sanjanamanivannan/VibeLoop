// routes/analytics.js

import express from "express";
import {
  processSpotifyTracks,
  getUserAnalytics,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.post("/:userId", processSpotifyTracks);
router.get("/:userId", getUserAnalytics);

export default router;

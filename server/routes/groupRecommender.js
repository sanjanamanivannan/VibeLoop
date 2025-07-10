import express from 'express';
import {
  addGroupRecommendation,
  getGroupRecommendations,
} from '../firestore/logHelpers.js'; // Firestore helpers

import { generateGroupRecommendation } from '../../functions/groupRecommender.js'; // AI function

const router = express.Router();

/**
 * POST /group-recommender/:groupId/recommendations
 * Adds a Firestore recommendation to a group
 */
router.post('/:groupId/recommendations', async (req, res) => {
  try {
    const { groupId } = req.params;
    const recommendationData = req.body;

    if (!recommendationData) {
      return res.status(400).json({ error: 'Recommendation data is required' });
    }

    const recId = await addGroupRecommendation(groupId, recommendationData);
    res.status(201).json({ success: true, id: recId });
  } catch (error) {
    console.error('Error adding group recommendation:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

/**
 * GET /group-recommender/:groupId/recommendations
 * Fetches all Firestore-stored group recommendations
 */
router.get('/:groupId/recommendations', async (req, res) => {
  try {
    const { groupId } = req.params;

    const recommendations = await getGroupRecommendations(groupId);
    res.json({ recommendations });
  } catch (error) {
    console.error('Error fetching group recommendations:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

/**
 * POST /group-recommender/generate
 * Calls OpenAI to generate a group summary from logs
 * Expects: { userLogs: { Megh: [log1, log2], Alex: [log3, log4] } }
 */
router.post('/generate', async (req, res) => {
  try {
    const { userLogs } = req.body;

    if (!userLogs || typeof userLogs !== 'object') {
      return res.status(400).json({ error: "Missing or invalid 'userLogs' in request body" });
    }

    const recommendation = await generateGroupRecommendation(userLogs);
    res.json({ recommendation });
  } catch (error) {
    console.error('Error generating group recommendation via OpenAI:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;

import express from 'express';
import {
  addGroupRecommendation,
  getGroupRecommendations,
} from '../firestore/logHelpers.js'; // your Firestore helper functions

const router = express.Router();

// POST /group-recommender/:groupId/recommendations
// Add a new recommendation to a group
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

// GET /group-recommender/:groupId/recommendations
// Get all recommendations for a group
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

export default router;

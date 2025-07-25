import admin from '../firebase.js';
const db = admin.firestore();

// Store a new analytics event
export const postAnalyticsEvent = async (req, res) => {
  try {
    const event = req.body;
    event.timestamp = event.timestamp || new Date().toISOString();

    await db.collection("analytics").add(event);
    res.status(201).json({ message: "Event stored" });
  } catch (err) {
    console.error("Failed to store analytics event:", err);
    res.status(500).json({ error: "Failed to store event" });
  }
};

// General stats for last 7 days
export const getStats = async (req, res) => {
  try {
    const analyticsRef = db.collection("analytics");

    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - 7);
    const sinceISO = sinceDate.toISOString();

    // Helper to count events by event name and optional key/value filter
    async function countEvents(eventName, key, value) {
      let query = analyticsRef
        .where("event", "==", eventName)
        .where("timestamp", ">=", sinceISO);

      if (key && value) {
        query = query.where(key, "==", value);
      }

      const snapshot = await query.get();
      return snapshot.size;
    }

    // Basic login count
    const loginCount = await countEvents("login");

    // Monthly summary stats
    const monthlySummaryRequests = await countEvents("summary_generation_request", "summaryType", "monthly");
    const monthlySummaryViews = await countEvents("summary_view", "summaryType", "monthly");

    // Error count
    const errorCount = await countEvents("error");

    res.json({
      loginCount,
      errorCount,
      summaryRequests: {
        monthly: monthlySummaryRequests,
      },
      summaryViews: {
        monthly: monthlySummaryViews,
      },
    });
  } catch (err) {
    console.error("Failed to get stats:", err);
    res.status(500).json({ error: "Failed to get stats" });
  }
};

// Get all analytics data for a specific user
export const getUserAnalytics = async (req, res) => {
  const { userId } = req.params;

  try {
    const snapshot = await db.collection("analytics").where("userId", "==", userId).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No analytics data found for this user." });
    }

    const events = [];
    snapshot.forEach(doc => events.push({ id: doc.id, ...doc.data() }));

    res.json({ userId, events });
  } catch (err) {
    console.error("Failed to get user analytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics data." });
  }
};

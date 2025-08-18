import admin from '../firebase.js';
const { Timestamp } = admin.firestore;
const db = admin.firestore();

// Store a new analytics event
export const postAnalyticsEvent = async (req, res) => {
  try {
    const event = req.body;

    event.timestamp = event.timestamp ? Timestamp.fromDate(new Date(event.timestamp)) : Timestamp.now();

    if (typeof event.timestamp === "string") {
      event.timestamp = Timestamp.fromDate(new Date(event.timestamp));
    } else if (!event.timestamp) {
      event.timestamp = Timestamp.now();
    }

    await db.collection("analytics").add(event);
    res.status(201).json({ message: "Event stored" });
  } catch (err) {
    console.error("Failed to store analytics event:", err);
    res.status(500).json({ error: "Failed to store event" });
  }
};

// General stats for last 7 days (not per-user)
export const getStats = async (req, res) => {
  try {
    const analyticsRef = db.collection("analytics");
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - 7);
    const sinceISO = sinceDate.toISOString();

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

    const loginCount = await countEvents("login");
    const monthlySummaryRequests = await countEvents("summary_generation_request", "summaryType", "monthly");
    const monthlySummaryViews = await countEvents("summary_view", "summaryType", "monthly");
    const errorCount = await countEvents("error");

    res.json({
      loginCount,
      errorCount,
      summaryRequests: { monthly: monthlySummaryRequests },
      summaryViews: { monthly: monthlySummaryViews },
    });
  } catch (err) {
    console.error("Failed to get stats:", err);
    res.status(500).json({ error: "Failed to get stats" });
  }
};

// Aggregated stats for specific user (last 7 days)
export const getUserAnalytics = async (req, res) => {
  const { userId } = req.params;

  try {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - 7);
    const sinceISO = sinceDate.toISOString();

    const snapshot = await db
      .collection("analytics")
      .where("userId", "==", userId)
      .where("timestamp", ">=", sinceISO)
      .get();

    if (snapshot.empty) {
      return res.json({
        loginCount: 0,
        summaryRequests: { monthly: 0 },
        summaryViews: { monthly: 0 },
        errorCount: 0,
        topArtists: [],
        topGenres: [],
        totalListeningMinutes: 0,
      });
    }

    let loginCount = 0;
    let summaryRequests = 0;
    let summaryViews = 0;
    let errorCount = 0;
    let artistMap = {};
    let genreMap = {};
    let totalMs = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const event = data.event;

      switch (event) {
        case "login":
          loginCount++;
          break;
        case "summary_generation_request":
          if (data.summaryType === "monthly") summaryRequests++;
          break;
        case "summary_view":
          if (data.summaryType === "monthly") summaryViews++;
          break;
        case "error":
          errorCount++;
          break;
        case "track_played":
          const track = data.track || {};
          if (track.artist) artistMap[track.artist] = (artistMap[track.artist] || 0) + 1;
          if (track.genre) genreMap[track.genre] = (genreMap[track.genre] || 0) + 1;
          if (track.duration_ms) totalMs += track.duration_ms;
          break;
        default:
          break;
      }
    });

    const topArtists = Object.entries(artistMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const topGenres = Object.entries(genreMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const totalListeningMinutes = Math.round(totalMs / 60000); // convert ms to minutes

    res.json({
      loginCount,
      summaryRequests: { monthly: summaryRequests },
      summaryViews: { monthly: summaryViews },
      errorCount,
      topArtists,
      topGenres,
      totalListeningMinutes,
    });
  } catch (err) {
    console.error("Failed to get user analytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics data." });
  }
};

// Save aggregated stats into userAnalytics collection
export const saveUserAnalytics = async (req, res) => {
  const { userId } = req.params;
  const data = req.body;

  console.log("👉 Received userId:", userId);
  console.log("👉 Received body:", data);

  if (!userId) {
    console.error("❌ No userId in request params");
    return res.status(400).send("Missing userId");
  }

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ error: "No analytics data provided." });
  }

  try {
    await db.collection("userAnalytics").doc(userId).set(data, { merge: true });
    res.status(200).json({ message: "User analytics saved successfully." });
  } catch (err) {
    console.error("Failed to save user analytics:", err);
    res.status(500).json({ error: "Failed to save analytics." });
  }
};

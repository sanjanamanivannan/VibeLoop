const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://7748ea21786c.ngrok-free.app/api/auth/callback/spotify";

export async function sendAnalyticsEvent(eventData) {
  try {
    const userId = localStorage.getItem("userId");
    await fetch(`${BACKEND_URL}/api/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        timestamp: new Date().toISOString(),
        ...eventData,
      }),
    });
  } catch (error) {
    console.error("Failed to send analytics event", error);
  }
}


export async function fetchUserAnalytics(userId) {
  try {
    const res = await fetch(`http://localhost:3001/analytics/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch analytics data");
    
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Analytics fetch error:", err);
    return { error: err.message };
  }
}
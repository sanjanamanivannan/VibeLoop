import React from "react";
import { analytics, db } from "../firebase";  // Adjust this path as needed
import { logEvent } from "firebase/analytics";
import { doc, setDoc, increment } from "firebase/firestore";

function AnalyticsButton({ userId }) {
  const handleClick = async () => {
    // Log global analytics event
    logEvent(analytics, "custom_button_click", {
      button_name: "AnalyticsTestButton",
      description: "User clicked analytics test button",
    });

    if (userId) {
      // Update per-user analytics data in Firestore
      const userAnalyticsRef = doc(db, "userAnalytics", userId);
      try {
        await setDoc(
          userAnalyticsRef,
          {
            buttonClickCount: increment(1),
            lastClickedAt: new Date(),
          },
          { merge: true } // Merge with existing document instead of overwriting
        );
        alert("Analytics event logged and user data updated!");
      } catch (error) {
        console.error("Error updating user analytics:", error);
        alert("Failed to update analytics data.");
      }
    } else {
      alert("User not signed in, analytics event only logged globally.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Send Analytics Event
    </button>
  );
}

export default AnalyticsButton;

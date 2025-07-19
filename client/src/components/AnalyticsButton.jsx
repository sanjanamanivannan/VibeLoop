import React from "react";
import { analytics } from "../firebase";
import { logEvent } from "firebase/analytics";

function AnalyticsButton() {
  const handleClick = () => {
    logEvent(analytics, 'custom_button_click', {
      button_name: 'AnalyticsTestButton',
      description: 'User clicked analytics test button',
    });
    alert("Analytics event logged!");
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

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { auth } from "./firebase";  // your firebase config file
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import LoginWithSpotify from "./LoginWithSpotify";
import Callback from "./Callback";
import Dashboard from "./Dashboard";
import SummaryViewer from './components/SummaryViewer';
import MonthlySummaryViewer from './components/MonthlySummaryViewer';

function SignInPrompt() {
  const signIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(console.error);
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <p>Please sign in to view your monthly summary.</p>
      <button
        onClick={signIn}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Sign In with Google
      </button>
    </div>
  );
}

function App() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginWithSpotify />} />
        <Route path="/callback/spotify" element={<Callback />} />
        {/* Pass userId as prop to Dashboard */}
        <Route path="/dashboard" element={<Dashboard userId={userId} />} />
        <Route path="/summary" element={<SummaryViewer />} />
        <Route
          path="/monthly-summary"
          element={userId ? <MonthlySummaryViewer userId={userId} /> : <SignInPrompt />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

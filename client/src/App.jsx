import { BrowserRouter, Routes, Route } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from "react";

import LoginWithSpotify from "./LoginWithSpotify";
import Callback from "./Callback";
import Dashboard from "./Dashboard";
import SummaryViewer from './components/SummaryViewer';
import SongSearch from "./SongSearch";
import ListeningPatterns from "./ListeningPatterns";

function App() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard userId={userId} />} />
        <Route path="/summary" element={<SummaryViewer />} />
        <Route path="/search" element={<SongSearch />} />
        <Route path="/patterns" element={<ListeningPatterns />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


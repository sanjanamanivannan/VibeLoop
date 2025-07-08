import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginWithSpotify from "./LoginWithSpotify";
import Callback from "./Callback";
import Dashboard from "./Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginWithSpotify />} />
        <Route path="/callback/spotify" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

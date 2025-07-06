import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginWithSpotify from "./LoginWithSpotify";
import Callback from "./Callback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginWithSpotify />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

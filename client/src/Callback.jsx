import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    const getToken = async () => {
      const res = await axios.post("http://localhost:3001/api/spotify/getSpotifyToken", {
        code,
      });

      console.log("Spotify access token:", res.data.access_token);
      // Save to localStorage or state
      navigate("/");
    };

    if (code) getToken();
  }, [navigate]);

  return <p>Logging in...</p>;
};

export default Callback;

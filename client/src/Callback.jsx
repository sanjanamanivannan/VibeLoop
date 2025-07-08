import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");

    if (token) {
      console.log("✅ Access token found:", token);
      localStorage.setItem("spotify_token", token);
      navigate("/dashboard");
    } else {
      console.error("❌ No access token found in URL");
    }
  }, [navigate]);

  return <p>Logging in...</p>;
};

export default Callback;

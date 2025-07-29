import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithCustomToken } from "firebase/auth";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");

    const handleToken = async () => {
      if (token) {
        console.log("✅ Access token found:", token);
        localStorage.setItem("spotify_token", token);

        try {
          const res = await fetch("http://localhost:3001/api/auth/save-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          if (!res.ok) {
            const error = await res.text();
            throw new Error(`Server error: ${error}`);
          }

          console.log("📦 Token successfully sent to backend");
          const { customToken } = await res.json();

          // ✅ This line is necessary
          const auth = getAuth();

          // Sign in with Firebase
          await signInWithCustomToken(auth, customToken);
          console.log("✅ Signed in with Firebase");

          navigate("/dashboard");
        } catch (err) {
          console.error("❌ Failed to send token to backend:", err);
        }
      } else {
        console.error("❌ No access token found in URL");
      }
    };

    handleToken();
  }, [navigate]);

  return <p>Logging in...</p>;
};

export default Callback;

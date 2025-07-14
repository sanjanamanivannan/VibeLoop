import { FaSpotify } from "react-icons/fa";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const SCOPES = ["user-read-private", "user-read-email", "user-top-read"];

const LoginWithSpotify = () => {
  const login = () => {
    const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(SCOPES.join(" "))}`;

    window.location.href = url;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
      <button
        onClick={login}
        className="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-full shadow-md hover:bg-[#1DB954]/90 transition duration-200 w-full max-w-xs"
      >
        <FaSpotify className="text-white text-2xl" />
        <span className="font-medium">Continue with Spotify</span>
      </button>
    </div>
    
  );
};

export default LoginWithSpotify;

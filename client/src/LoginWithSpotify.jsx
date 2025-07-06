const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = "http://localhost:5173/callback";
const SCOPES = ["user-read-private", "user-read-email", "user-top-read"];

const LoginWithSpotify = () => {
  const login = () => {
    const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(SCOPES.join(" "))}`;

    window.location.href = url;
  };

  return <button onClick={login}>Login with Spotify</button>;
};

export default LoginWithSpotify;

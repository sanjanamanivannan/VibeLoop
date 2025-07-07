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

  return <button onClick={login}>Login with Spotify</button>;
};

export default LoginWithSpotify;

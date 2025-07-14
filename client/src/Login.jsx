import LoginWithSpotify from "./LoginWithSpotify";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] px-4">
      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl shadow-lg p-10 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to <span className="text-green-400">VibeLoop</span></h1>
        <p className="text-sm text-gray-300 mb-8">Log in to see your top Spotify tracks and share the vibe</p>

        <LoginWithSpotify />
      </div>
    </div>
  );
}


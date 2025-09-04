VibeLoop 🎶
VibeLoop is a personal music journaling and insights app built on top of the Spotify API. It lets you log, rate, and reflect on songs — like a "Letterboxd for music" — while also surfacing AI-powered insights into your listening habits.
🚀 Features

Spotify OAuth Login – Secure authentication using Spotify accounts.

Song Search – Search tracks from Spotify's catalog.

Rating System – Rate songs from ★½ to ★★★★★ with optional comments.

Music Log – Keep a timeline of your ratings and notes.

AI Insights – Automatically generate summaries of listening patterns using OpenAI.

Analytics Dashboard – Visualize your top tracks, genres, and moods.

Secure Backend – Express.js server with Helmet for security hardening.

Firebase Integration – Store ratings, logs, and user data.

Ngrok Tunneling – Used during development to test Spotify OAuth callbacks locally.

🛠️ Tech Stack
Frontend

React + Vite
TailwindCSS (for styling)
React Router

Backend

Node.js + Express
Firebase (database + auth)
Spotify Web API
OpenAI API (for insights)
Helmet (security middleware)
Ngrok (for exposing local server to the web)

🔑 Authentication Flow
Spotify OAuth with Ngrok

Spotify requires a public redirect URI for OAuth.
During development, ngrok was used to expose the local backend (http://localhost:5000) to a temporary public HTTPS URL.
This URL was set as the Spotify Redirect URI in the Spotify Developer Dashboard, enabling local login without deploying.

Firebase Integration

Firebase Authentication manages user sessions.
After a successful Spotify OAuth login, tokens are securely stored and linked with the user's Firebase profile.
Firebase Firestore stores song ratings, notes, and analytics data.

This combination ensures that users log in with Spotify, while their personal data (ratings, notes, history) is managed safely via Firebase.
📂 Project Structure
VibeLoop/
├── client/               # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/        # Dashboard, Search, etc.
│   │   ├── components/   # Reusable UI components
│   │   └── utils/        # Helpers (e.g. insights.js)
│   └── package.json
│
├── server/               # Backend (Express)
│   ├── routes/           # API routes
│   ├── models/           # Firebase/DB models
│   ├── controllers/      # API controllers
│   └── server.js         # Entry point
│
└── README.md
⚡ Getting Started
Prerequisites

Node.js (v22+)
npm or yarn
Spotify Developer account + app (for API keys)
Firebase project (for database & auth)
OpenAI API key
Ngrok (for local OAuth testing)

Setup

Clone the repo:
bashgit clone https://github.com/sanjanamanivannan/VibeLoop.git
cd VibeLoop

Install dependencies:
bashcd server && npm install
cd ../client && npm install

Create .env files in both server and client:
server/.env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
FIREBASE_API_KEY=your_firebase_key
OPENAI_API_KEY=your_openai_key
client/.env
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
VITE_API_URL=http://localhost:5000

Start backend:
bashcd server
npm run dev

Start frontend:
bashcd client
npm run dev

Run ngrok (to test Spotify OAuth locally):
bashngrok http 5000
Copy the generated HTTPS URL into your Spotify Developer Dashboard → Redirect URIs.
Visit app:
http://localhost:5173


🔒 Security Notes

Helmet is enabled on the backend to protect against common web vulnerabilities.
Tokens are securely stored and refreshed for Spotify OAuth.
Firebase provides session security and real-time database syncing.

📈 Roadmap

 Collaborative playlists with friends
 Mood-based recommendations
 Mobile-friendly PWA version

👥 Contributors

Sanjana Manivannan
Meghana Reddy

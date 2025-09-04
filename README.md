# VibeLoop 🎶  
*Where music, moods, and friendships sync.*

VibeLoop is a personal music journaling + insights app built on top of the **Spotify API**. Log and rate songs, add notes/tags, and see AI-powered summaries of your listening patterns.

---

## 🚀 Features
- **Spotify OAuth** login (with **ngrok** for local callback testing)
- **Song search** (Spotify API)
- **Ratings + notes** (½-star increments, optional comments)
- **Music log** (stored in **Firebase Firestore**)
- **Listening patterns & AI insights** (OpenAI + audio features)
- **Dashboard** with top tracks and quick links
- Secure **Express** backend (with **helmet**, **CORS**)

---

## 🛠️ Tech Stack
**Frontend**
- React + Vite + React Router
- Tailwind (utility styles)
  
**Backend**
- Node.js + Express
- Helmet, CORS, Axios

**Data & AI**
- Firebase Firestore
- Spotify Web API
- OpenAI API

**Dev Utilities**
- Ngrok (public HTTPS tunnel for OAuth during development)

---

## 📂 Project Structure

```

VibeLoop/
├── client/                     # React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── LoginWithSpotify.jsx
│   │   ├── Callback.jsx
│   │   ├── Dashboard.jsx
│   │   ├── SongSearch.jsx
│   │   ├── ListeningPatterns.jsx
│   │   ├── components/
│   │   │   ├── RatingModel.jsx
│   │   │   └── AnalyticsViewer.jsx
│   │   └── utils/
│   │       └── insights.js
│   └── index.html
│
├── server/                     # Express API
│   ├── index.js
│   ├── routes/
│   │   ├── spotifyAuth.js      # /api/auth/\*
│   │   ├── spotifySearch.js    # /api/spotify/search
│   │   └── audioFeatures.js    # /api/spotify/audio-features
│   └── controllers/
│
└── README.md

```

---

## 🔑 How Auth Works (Spotify + ngrok + Firebase)

### 1) Spotify OAuth
- Spotify requires a **public HTTPS redirect URI**.
- In development we use **ngrok** to expose the local server (e.g., `http://localhost:3001`) to a temporary **https** URL.
- The server handles the Spotify OAuth callback at:
```

https\://<your-ngrok-subdomain>.ngrok-free.app/api/auth/callback/spotify

```
- After exchanging the `code` for an access token, the backend redirects to the frontend:
```

[http://localhost:5173/callback/spotify?access\_token=](http://localhost:5173/callback/spotify?access_token=)...

```
- The frontend stores the token in `localStorage` and uses it to call Spotify APIs.

### 2) Firebase (Firestore)
- Ratings and notes are saved in Firestore under a `ratings` collection:
```

ratings/{songId} => {
userId: string,
songId: string,
rating: number,           // e.g. 3.5
feedback: string,         // optional comment
timestamp: number         // Date.now()
}

````
- You don’t need to create the collection manually — Firestore will create it on first write.

---

## ⚙️ Setup

### Prerequisites
- Node.js 18+ (22 recommended)
- Spotify Developer account + app
- Firebase project (Firestore enabled)
- OpenAI API key (for insights)
- ngrok

### 1) Clone & Install
```bash
git clone <your-repo-url>
cd VibeLoop

# server deps
cd server && npm install

# client deps
cd ../client && npm install
````

### 2) Environment Variables

**server/.env**

```
# Spotify
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://<your-ngrok>.ngrok-free.app/api/auth/callback/spotify
FRONTEND_REDIRECT_URI=http://localhost:5173/callback/spotify

# OpenAI
OPENAI_API_KEY=your_openai_key
```

**client/.env**

```
VITE_API_URL=http://localhost:3001
# If you also read Firebase config from env:
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=xxxx
```

> You can also hardcode the Firebase config in `client/src/firebase.js` if you prefer, but env variables are recommended.

### 3) Start Backend

```bash
cd server
npm run dev
# server runs on http://localhost:3001
```

### 4) Start ngrok (for Spotify callback)

```bash
ngrok http 3001
```

* Copy the `https://<something>.ngrok-free.app` URL.
* Add it to **Spotify Developer Dashboard → Your App → Redirect URIs** as:

  ```
  https://<your-ngrok>.ngrok-free.app/api/auth/callback/spotify
  ```
* Ensure the **same** URL is in `server/.env` as `SPOTIFY_REDIRECT_URI`.

### 5) Start Frontend

```bash
cd client
npm run dev
# opens http://localhost:5173
```

---

## ▶️ Usage Flow

1. Go to `http://localhost:5173` and click **Login with Spotify**.
2. After login, you’ll land on `/dashboard` with your **Top Tracks**.
3. Navigate to **Search** to find songs. Click the ⭐ to open the **rating popup** (supports 0.5 increments + comments).
4. Ratings/notes are saved to **Firestore**.
5. See **Listening Patterns** for energy/valence mood buckets (uses audio features).

---

## 🔍 Key API Endpoints (server)

* `POST /api/auth/getSpotifyToken` – (optional) manual token exchange
* `GET  /api/auth/callback/spotify` – OAuth callback (used by Spotify)
* `GET  /api/spotify/search?q=<query>&token=<accessToken>` – search tracks
* `POST /api/spotify/audio-features?token=<accessToken>` – audio features for tracks

---

## 🔒 Security Notes

* **helmet** is used server-side for HTTP headers hardening.
* **CORS** configured for `http://localhost:5173` during dev.
* Never commit real secrets. Use `.env` files.

---

## 🧰 Troubleshooting

**Blank callback / 404 on callback**

* Make sure your **ngrok URL** in `SPOTIFY_REDIRECT_URI` matches the one in the **Spotify dashboard**.
* Your server must mount the router: `app.use("/api/auth", spotifyAuth);`
* Callback route should be `/api/auth/callback/spotify`.

**CORS errors**

* Allow `http://localhost:5173` in server CORS.
* If using a public tunnel for the client, add that origin too.

**Vite allowedHosts (ngrok)**

```js
// vite.config.js
export default defineConfig({
  server: { allowedHosts: ['<your-ngrok-subdomain>.ngrok-free.app'] }
});
```

**Firestore writes not appearing**

* Confirm Firebase config matches your project.
* Check browser console for permission errors; update **Firestore Security Rules** accordingly.

---

## 🗺️ Roadmap

* Friend feeds + vibe matches
* Group recommender (AI)
* Public profiles + shareable logs
* Better visualizations

---

## 👥 Contributors

* **Sanjana Manivannan**
* **Meghana Reddy**







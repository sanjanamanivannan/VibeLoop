import { useState } from "react";

export default function SongSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const token = localStorage.getItem("spotify_token");

  const handleSearch = async () => {
    const res = await fetch(`http://localhost:3001/api/spotify/search?q=${query}&token=${token}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="p-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a song..."
        className="border p-2 rounded"
      />
      <button onClick={handleSearch} className="ml-2 bg-green-500 text-white px-4 py-2 rounded">
        Search
      </button>

      <ul className="mt-4">
        {results.map((track) => (
          <li key={track.id}>
            {track.name} by {track.artists.map((a) => a.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

// utils/spotifyMetadata.js

export async function getTrackMetadata(track, token) {
  const trackId = track.id;

  const trackResponse = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const trackData = await trackResponse.json();
  const artistId = trackData.artists?.[0]?.id;

  const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const artistData = await artistResponse.json();

  return {
    id: trackId,
    name: track.name,
    artist: artistData.name,
    genres: artistData.genres || [],
    album: track.album?.name || "Unknown Album",
    image: track.album?.images?.[0]?.url || null,
  };
}

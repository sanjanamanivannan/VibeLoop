export async function generateMonthlySummary(userData) {
  // This could pull from Firestore listening history or Spotify
  const { listeningHistory } = userData;
  if (!listeningHistory) throw new Error("No listening history");

  // Example analysis
  const topGenres = countTop(listeningHistory.map(t => t.genre));
  const topArtists = countTop(listeningHistory.map(t => t.artist));

  return {
    month: "July 2025",
    topGenres,
    topArtists,
    totalTracks: listeningHistory.length,
  };
}

function countTop(array, topN = 5) {
  const countMap = {};
  array.forEach(item => countMap[item] = (countMap[item] || 0) + 1);
  return Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name, count]) => ({ name, count }));
}

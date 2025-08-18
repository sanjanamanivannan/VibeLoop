// utils/Track.js

import admin from "../firebase.js"; // your Firebase Admin SDK
const db = admin.firestore();

export async function saveTrackToFirebase(userId, trackData) {
  const trackRef = db.collection("users").doc(userId).collection("tracks").doc(trackData.id);
  await trackRef.set(trackData, { merge: true });
}

// server/firestore/logHelpers.js
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

// Firebase config - make sure these are in your .env file
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  // add other config fields here if you have them
};

// Initialize Firebase app if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

// Add a log for a user
export async function addUserLog(userId, logData) {
  const logsCol = collection(db, "users", userId, "logs");
  const docRef = await addDoc(logsCol, { ...logData, createdAt: serverTimestamp() });
  return docRef.id;
}

// Get all logs for a user (optionally filter by date)
export async function getUserLogs(userId, startDate, endDate) {
  const logsCol = collection(db, "users", userId, "logs");
  let q = query(logsCol);

  if (startDate && endDate) {
    q = query(
      logsCol,
      where("date", ">=", startDate),
      where("date", "<=", endDate)
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Add a summary for a user
export async function addUserSummary(userId, summaryData) {
  const summariesCol = collection(db, "users", userId, "summaries");
  const docRef = await addDoc(summariesCol, { ...summaryData, createdAt: serverTimestamp() });
  return docRef.id;
}

// Get latest summary for a user
export async function getLatestUserSummary(userId) {
  const summariesCol = collection(db, "users", userId, "summaries");
  const q = query(summariesCol, orderBy("createdAt", "desc"), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
}

// Add a group recommendation
export async function addGroupRecommendation(groupId, recommendationData) {
  const recCol = collection(db, "groups", groupId, "recommendations");
  const docRef = await addDoc(recCol, { ...recommendationData, createdAt: serverTimestamp() });
  return docRef.id;
}

// Get recommendations for a group
export async function getGroupRecommendations(groupId) {
  const recCol = collection(db, "groups", groupId, "recommendations");
  const snapshot = await getDocs(recCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

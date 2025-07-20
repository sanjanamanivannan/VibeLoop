// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDO74IaAkkf9-IP0nvFXWPsCOpZqMvryM8",
  authDomain: "vibeloop-22298.firebaseapp.com",
  projectId: "vibeloop-22298",
  storageBucket: "vibeloop-22298.firebasestorage.app",
  messagingSenderId: "495653509981",
  appId: "1:495653509981:web:b30f5e05da97a69072a6b4",
  measurementId: "G-NRHPEHXT27"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, auth, analytics, db };
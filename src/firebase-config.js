import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration using credentials from touareg-e514f project
const firebaseConfig = {
  apiKey: "AIzaSyBdgyuT8kBinhR_yryf5FT2ctQrel_6sUA",
  authDomain: "touareg-e514f.firebaseapp.com",
  projectId: "touareg-e514f",
  storageBucket: "touareg-e514f.firebasestorage.app",
  messagingSenderId: "295094947348",
  appId: "1:295094947348:web:ac916cce9c3d0dcc4e6101",
  measurementId: "G-817YVT4P6X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore Database
const db = getFirestore(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
// Request profiles and email addresses
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { app, auth, googleProvider, db };

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration from environment variable (stored as JSON string)
const firebaseConfig = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG || '{}'
);

console.log('Firebase Config Loaded:', firebaseConfig); // Debug log to verify config loading

// Initialize Firebase
const app = initializeApp(firebaseConfig); 
const auth = getAuth(app);

export { app, auth };

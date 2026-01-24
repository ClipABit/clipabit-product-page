import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration from environment variable (stored as JSON string)
const firebaseConfig = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG || '{}'
);

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };

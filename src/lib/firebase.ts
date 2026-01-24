import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

// Firebase configuration
// These are client-side keys and are safe to be public
// Security is enforced through Firebase Security Rules
const firebaseConfig = {
  apiKey: "AIzaSyDKgay8H4RnFyIvTzQLSAMrbXKs_aU0as0",
  authDomain: "clipabit.firebaseapp.com",
  projectId: "clipabit",
  storageBucket: "clipabit.firebasestorage.app",
  messagingSenderId: "749495106862",
  appId: "1:749495106862:web:8ed418cd7c7a17c5194ebf",
};

// Initialize Firebase only on client side
let app: FirebaseApp | undefined;
let auth: Auth | undefined;

if (typeof window !== 'undefined') {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
}

export { app, auth };

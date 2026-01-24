import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBSwD2cSMbtvt_qMBCfqGpEUSPIpfC45po",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "doom-978f6.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "doom-978f6",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "doom-978f6.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "279305449225",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:279305449225:web:9cb4fb281179dfa7a96dd8",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-YXWZGVC3XW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics
export const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
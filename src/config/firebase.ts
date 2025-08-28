import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { 
  getAuth, 
  GoogleAuthProvider, 
  RecaptchaVerifier,
  signInWithPopup,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
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

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configure auth settings for better user experience
auth.languageCode = 'es'; // Set to Spanish for Mexico
auth.settings.appVerificationDisabledForTesting = false; // Enable in production

// Helper functions for auth
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error('Error during Google sign-in:', error);
    throw error;
  }
};

// Setup reCAPTCHA verifier for phone auth
export const setupRecaptcha = (buttonId: string): RecaptchaVerifier => {
  const recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
    'size': 'invisible',
    'callback': (response: any) => {
      console.log('reCAPTCHA verified');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
    }
  });
  return recaptchaVerifier;
};

// Phone authentication function
export const signInWithPhone = async (phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    console.error('Error during phone sign-in:', error);
    throw error;
  }
};

export default app;
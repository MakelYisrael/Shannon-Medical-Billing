import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, disableNetwork, enableNetwork } from 'firebase/firestore';

// TODO: Replace with your Firebase config
// Get your config from Firebase Console: https://console.firebase.google.com/
// Project Settings → Your Apps → Copy the config object
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore offline persistence: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore offline persistence: Not supported in this browser');
  }
});

// Handle network connectivity
if (typeof window !== 'undefined') {
  let isOnline = navigator.onLine;

  const handleOnline = async () => {
    isOnline = true;
    try {
      await enableNetwork(db);
      console.debug('Firestore network enabled');
    } catch (error) {
      console.debug('Error enabling Firestore network:', error);
    }
  };

  const handleOffline = async () => {
    isOnline = false;
    try {
      await disableNetwork(db);
      console.debug('Firestore network disabled (offline mode)');
    } catch (error) {
      console.debug('Error disabling Firestore network:', error);
    }
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
}

export default app;

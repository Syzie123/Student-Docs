import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBoaTJ2tEhECQPTyZq3KgS9S0Udfy3_lYM",
  authDomain: "swift-e-commerce-a7703.firebaseapp.com",
  databaseURL: "https://swift-e-commerce-a7703-default-rtdb.firebaseio.com",
  projectId: "swift-e-commerce-a7703",
  storageBucket: "swift-e-commerce-a7703.firebasestorage.app",
  messagingSenderId: "750412529960",
  appId: "1:750412529960:web:a0a4c0760339266e38101d"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
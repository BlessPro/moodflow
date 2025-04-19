// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAG05d7RKTC3PlhZNKwD3HthFTfnpnSUbw",
  authDomain: "moodflow-426ee.firebaseapp.com",
  projectId: "moodflow-426ee",
  storageBucket: "moodflow-426ee.firebasestorage.app",
  messagingSenderId: "577008266663",
  appId: "1:577008266663:web:93200c6c9cf08cce3fda82",
  measurementId: "G-5CPTS3SL1B"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
export default app;
export { analytics };
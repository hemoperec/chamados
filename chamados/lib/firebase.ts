import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCW_EuCIDzY3m69Lg4PynzLAtxCpav9vKM",
  authDomain: "chamados-hemope.firebaseapp.com",
  projectId: "chamados-hemope",
  storageBucket: "chamados-hemope.firebasestorage.app",
  messagingSenderId: "91005038813",
  appId: "1:91005038813:web:bca2184756ddafc6282b34",
  measurementId: "G-0DP29KCF9J"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics (only on client side)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };

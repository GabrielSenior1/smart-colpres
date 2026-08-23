import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDi6WyzKQLXxmxUZ4AI6SQedkU7bO4jju4",
  authDomain: "smart-colpres.firebaseapp.com",
  projectId: "smart-colpres",
  storageBucket: "smart-colpres.firebasestorage.app",
  messagingSenderId: "209617156156",
  appId: "1:209617156156:web:168d9a98dffbe76659ab39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

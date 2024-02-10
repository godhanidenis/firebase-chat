import { getFirestore } from "firebase/firestore/lite";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD7eO6faxqE-YIf2oO77JVQANU8VMlqOhs",
  authDomain: "scaleplus-dda3e.firebaseapp.com",
  projectId: "scaleplus-dda3e",
  storageBucket: "scaleplus-dda3e.appspot.com",
  messagingSenderId: "384477868567",
  appId: "1:384477868567:web:55c060f3c656cc0e952252",
  measurementId: "G-2FZ7GJZ2V2",
};

// Create a Firestore instance

const app = initializeApp(firebaseConfig);
const db = getFirestore();

export { db };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_UcZuSbXC6UuTxajBQjwMLuExttq1Wos",
  authDomain: "chat-app-57147.firebaseapp.com",
  projectId: "chat-app-57147",
  storageBucket: "chat-app-57147.appspot.com",
  messagingSenderId: "290718097532",
  appId: "1:290718097532:web:f2b2023f1815b09f69a9f9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export { db };

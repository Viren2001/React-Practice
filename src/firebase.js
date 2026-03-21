import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVZMZ7Y0hKJRlx2-nyfNKWWyjWYhJ5ixw",
  authDomain: "smart-expense-tracker-a75a5.firebaseapp.com",
  projectId: "smart-expense-tracker-a75a5",
  storageBucket: "smart-expense-tracker-a75a5.firebasestorage.app",
  messagingSenderId: "960430951902",
  appId: "1:960430951902:web:70dfe899d39fd20a26614f",
  measurementId: "G-KS56P7YTYW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

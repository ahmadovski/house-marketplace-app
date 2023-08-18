// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8sHUyZO6XY-SJuPj-KFiKC00_elwQAcg",
  authDomain: "house-marketing-app-af6a8.firebaseapp.com",
  projectId: "house-marketing-app-af6a8",
  storageBucket: "house-marketing-app-af6a8.appspot.com",
  messagingSenderId: "574331094405",
  appId: "1:574331094405:web:ddff1c0e1f6052b228b0ec",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();

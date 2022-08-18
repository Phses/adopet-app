
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyChTsbRAY41sfMA6QiuT9FsDHsrXyobVWc",
  authDomain: "adopet-app.firebaseapp.com",
  projectId: "adopet-app",
  storageBucket: "adopet-app.appspot.com",
  messagingSenderId: "35031026775",
  appId: "1:35031026775:web:3fd1131e76e57141466712"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore()
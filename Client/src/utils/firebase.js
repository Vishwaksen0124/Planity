// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "taskmanager-b926e.firebaseapp.com",
  projectId: "taskmanager-b926e",
  storageBucket: "taskmanager-b926e.firebasestorage.app",
  messagingSenderId: "614137313530",
  appId: "1:614137313530:web:729a9734f595e4bfeef143"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
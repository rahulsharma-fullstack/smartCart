// Suggested code may be subject to a license. Learn more: ~LicenseLog:2469011189.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:389706684.
// In a separate file (e.g., firebase.js)
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyApS6ndXrWB910hYRXI4tGwCEkOg4225vM",
    authDomain: "smartcart-3bb9f.firebaseapp.com",
    projectId: "smartcart-3bb9f",
    storageBucket: "smartcart-3bb9f.firebasestorage.app",
    messagingSenderId: "545554798361",
    appId: "1:545554798361:web:014f3044d5ffd174e39788",
    measurementId: "G-VD9GCBQD31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

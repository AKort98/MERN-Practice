// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-estate-914d0.firebaseapp.com",
    projectId: "mern-estate-914d0",
    storageBucket: "mern-estate-914d0.appspot.com",
    messagingSenderId: "507772911250",
    appId: "1:507772911250:web:d7c5fcb9f0438533c5b04b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAl49ukbygyk1g2O-QcWrpo9fAk88quK0o",
  authDomain: "procrastimate.firebaseapp.com",
  projectId: "procrastimate",
  storageBucket: "procrastimate.appspot.com",
  messagingSenderId: "704851451266",
  appId: "1:704851451266:web:ec2db1f29cea3aba74c39b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
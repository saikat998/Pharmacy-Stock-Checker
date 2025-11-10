import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration (provided)
const firebaseConfig = {
  apiKey: "AIzaSyB15gDDC4955coQ-5vr64jkWdSmrFnbWW4",
  authDomain: "health-management-11951.firebaseapp.com",
  projectId: "health-management-11951",
  storageBucket: "health-management-11951.firebasestorage.app",
  messagingSenderId: "322257893094",
  appId: "1:322257893094:web:ebcf81b3d4de0affec2d27",
  measurementId: "G-3VFVF8B4CX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

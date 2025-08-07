import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBC14mbp6jEM3rfzpLA7DPET_W4i57yGuY",
  authDomain: "pharmacy-9be9e.firebaseapp.com",
  projectId: "pharmacy-9be9e",
  storageBucket: "pharmacy-9be9e.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

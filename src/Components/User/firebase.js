// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCI3LERd3vwRVmiV3PcDbL4KotX9LqHefs",
  authDomain: "novibiz-f3ca7.firebaseapp.com",
  projectId: "novibiz-f3ca7",
  appId: "1:215637555666:web:aad6c137d9ea6fb692b00b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

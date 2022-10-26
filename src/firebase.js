import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxJiXgx4PV1ZcNnKB-zkjqFD7_4TRtwC0",
  authDomain: "lenacs-3063e.firebaseapp.com",
  projectId: "lenacs-3063e",
  storageBucket: "lenacs-3063e.appspot.com",
  messagingSenderId: "279061531795",
  appId: "1:279061531795:web:97dd6cf967ebcd8d7b9166",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;

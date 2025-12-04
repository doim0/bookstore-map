import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase 설정
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyB1gh0YJDISj5u79YWpGbFIf5io2Fz6WCY",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "bookstore-map-a88bc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bookstore-map-a88bc",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "bookstore-map-a88bc.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "350103866288",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:350103866288:web:09cc18d2664381420f6475",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 인증과 Firestore 인스턴스
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

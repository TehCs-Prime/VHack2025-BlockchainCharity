import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAe8lI5htH-gFjKHHFO8GX-3UQLN1w5LBs",
    authDomain: "lacial-aa409.firebaseapp.com",
    projectId: "lacial-aa409",
    storageBucket: "lacial-aa409.firebasestorage.app",
    messagingSenderId: "428319341770",
    appId: "1:428319341770:web:ce3123a741ab9a72564833",
    measurementId: "G-LPY66Q38DP"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
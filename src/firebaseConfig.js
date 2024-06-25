// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKhPJHQlh0cpGHFh6EGOBtcp4eMBFrros",
  authDomain: "weatherapp-4ec64.firebaseapp.com",
  projectId: "weatherapp-4ec64",
  storageBucket: "weatherapp-4ec64.appspot.com",
  messagingSenderId: "1093852282329",
  appId: "1:1093852282329:web:a34806bec290c2e8bd6dc8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

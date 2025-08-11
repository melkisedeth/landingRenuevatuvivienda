import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Configuración de Firebase para CotizNow
const firebaseConfig = {
  apiKey: "AIzaSyCLuBRtfAiFraO3SRUWwIE2KoPBNZHy1ik",
  authDomain: "cotiznow-a609d.firebaseapp.com",
  projectId: "cotiznow-a609d",
  storageBucket: "cotiznow-a609d.appspot.com",
  messagingSenderId: "688465903436",
  appId: "1:688465903436:web:b66132ecf04fe3e6a9d9e9" // Reemplaza con tu App ID real
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { 
  db, 
  auth,
  collection, 
  doc, 
  setDoc, 
  getDoc,
  signInWithEmailAndPassword 
};

// Opcional: Exporta tipos útiles si los necesitas
export type DocumentReference = ReturnType<typeof doc>;
export type CollectionReference = ReturnType<typeof collection>;
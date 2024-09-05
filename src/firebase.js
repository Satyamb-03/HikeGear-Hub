import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore'; // Import setDoc
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCTMEsOrcW_6nxQp2Bl4-BU-VHNkIuxLwA",
    authDomain: "hikegear-hub.firebaseapp.com",
    projectId: "hikegear-hub",
    storageBucket: "hikegear-hub.appspot.com",
    messagingSenderId: "629117582441",
    appId: "1:629117582441:web:a8fd96b24506054370f6f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services and functions
export { auth, db, collection, getDocs, addDoc, doc, deleteDoc, setDoc, storage, ref, uploadBytes, getDownloadURL };
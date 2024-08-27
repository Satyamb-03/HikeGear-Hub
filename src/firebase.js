// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import necessary functions

const firebaseConfig = {
    apiKey: "AIzaSyCTMEsOrcW_6nxQp2Bl4-BU-VHNkIuxLwA",
    authDomain: "hikegear-hub.firebaseapp.com",
    projectId: "hikegear-hub",
    storageBucket: "hikegear-hub.appspot.com",
    messagingSenderId: "629117582441",
    appId: "1:629117582441:web:a8fd96b24506054370f6f8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, collection, getDocs, addDoc, storage, ref, uploadBytes, getDownloadURL };

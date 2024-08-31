
import { doc, setDoc } from "firebase/firestore";
import { auth, db, collection, getDocs, addDoc, storage, ref, uploadBytes, getDownloadURL } from './firebase'; 
const collectionName = "users";

class UserDataService {
  addUser = (uid, newUser) => {
    const userDocRef = doc(db, collectionName, uid); // Use UID as document ID
    return setDoc(userDocRef, newUser);
  };
}

export default new UserDataService();

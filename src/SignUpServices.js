import { db } from "../firebase";
import {
    collection,
    addDoc,
  } from "firebase/firestore";
  
  const collectionName = "users";
  const userCollectionRef = collection(db, collectionName);
  class UserDataService {
    addUser = (newUser) => {
      return addDoc(userCollectionRef, newUser);
    };
  }
  
  export default new UserDataService();
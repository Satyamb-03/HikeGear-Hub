import React, { createContext, useContext } from 'react';
import { auth } from './firebase'; // Adjust path if needed
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { db } from './firebase'; // Adjust path if needed
import { collection, addDoc } from 'firebase/firestore';

const UserAuthContext = createContext();

export const UserAuthContextProvider = ({ children }) => {
  const signUp = async (email, password, name, age, mobile) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user details to Firestore
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email,
        name,
        age,
        mobile
      });
      
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const onAuthStateChangedListener = (callback) => {
    return onAuthStateChanged(auth, callback);
  };

  return (
    <UserAuthContext.Provider value={{ signUp, logIn, signOutUser, googleSignIn, onAuthStateChangedListener }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);

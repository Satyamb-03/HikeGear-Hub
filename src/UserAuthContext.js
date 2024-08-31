import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';


const UserAuthContext = createContext();


export const UserAuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signUp = async (email, password, name, age, mobile) => {
    try {
 
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      await setDoc(doc(db, 'users', user.uid), {
        email,
        name,
        age,
        mobile,
      });

      setUser(user); 
      return user;
    } catch (error) {
      console.error('Sign Up Error:', error.message);
      throw new Error(error.message); 
    }
  };


  const logIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); 
      return userCredential.user;
    } catch (error) {
      console.error('Log In Error:', error.message);
      throw new Error(error.message); 
    }
  };

  // Sign Out function
  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null); 
    } catch (error) {
      console.error('Sign Out Error:', error.message);
      throw new Error(error.message);
    }
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); 
      return result.user;
    } catch (error) {
      console.error('Google Sign In Error:', error.message);
      throw new Error(error.message); 
    }
  };

 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, signUp, logIn, signOutUser, googleSignIn }}>
      {children}
    </UserAuthContext.Provider>
  );
};


export const useUserAuth = () => {
  return useContext(UserAuthContext);
};

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

// Create context
const UserAuthContext = createContext();

// Create provider component
export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Sign up function
  const signUp = async (email, password, name, age, mobile) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to Firestore with user.uid as document ID
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

  // Log in function
  const logIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Log In User Credential:', userCredential); // Log userCredential
      return userCredential;
    } catch (error) {
      console.error('Log In Error:', error.message);
      throw new Error(error.message);
    }
  };

  // Sign out function
  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Sign Out Error:', error.message);
      throw new Error(error.message);
    }
  };

  // Google sign-in function
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Google Sign In Result:', result); // Log result
      return result;
    } catch (error) {
      console.error('Google Sign In Error:', error.message);
      throw new Error(error.message);
    }
  };
  // Set user state on auth state change
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

// Custom hook to use the UserAuthContext
export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

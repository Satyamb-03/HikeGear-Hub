import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase'; // Import your Firebase configuration
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import ProductService from '../Services/ProductService';
// Import ProductService for fetching products

// Create the context
const UserAuthContext = createContext();

// Create provider component
export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Manage loading state
  const [products, setProducts] = useState([]); // Store fetched products

  // Sign up function with user data
  const signUp = async (email, password, name, age, mobile) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to Firestore with empty product list
      await setDoc(doc(db, 'users', user.uid), {
        email,
        name,
        age,
        mobile,
        addedProducts: [], // Initialize empty product list
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
      setUser(userCredential.user);
      await fetchProducts(); // Fetch products on login
      return userCredential;
    } catch (error) {
      console.error('Log In Error:', error.message);
      handleAuthError(error); // Handle errors gracefully
    }
  };

  // Sign out function
  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProducts([]); // Clear products on sign out
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
      const user = result.user;

      // Check if the user already exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      // If user doesn't exist, create a new document
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          name: user.displayName,
          mobile: '', // Mobile number not provided by Google, so it's empty for now
          addedProducts: [], // Initialize empty product list
        });
      }

      setUser(user);
      await fetchProducts(); // Fetch products on login
      return result;
    } catch (error) {
      console.error('Google Sign In Error:', error.message);
      handleAuthError(error); // Handle errors
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const productList = await ProductService.getAllProducts();
      const productsArray = productList.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsArray); // Store products in state
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Handle common authentication errors
  const handleAuthError = (error) => {
    const errorCode = error.code;
    let errorMessage = 'Authentication failed. Please try again.';

    switch (errorCode) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already in use.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email.';
        break;
      default:
        errorMessage = error.message;
    }
    throw new Error(errorMessage);
  };

  // Set user state on authentication state change and fetch products
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProducts(); // Fetch products on auth state change
      }
      setLoading(false); // Stop loading once auth state is resolved
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, products, loading, signUp, logIn, signOutUser, googleSignIn }}>
      {!loading && children} {/* Render children only after loading completes */}
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

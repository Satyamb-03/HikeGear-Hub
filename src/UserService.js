import { collection, addDoc, getDocs, doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';  // Ensure you're using db, not firestore

// Function to add a new user to Firestore
export const addUser = async (userData) => {
  try {
    const userRef = await addDoc(collection(db, 'users'), userData);
    console.log('User added with ID: ', userRef.id);
  } catch (e) {
    console.error('Error adding user: ', e);
  }
};

// Function to get all users from Firestore
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return users;
  } catch (e) {
    console.error('Error getting users: ', e);
    return [];
  }
};

// Function to delete a user from Firestore
export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, 'users', userId));
    console.log('User deleted with ID: ', userId);
  } catch (e) {
    console.error('Error deleting user: ', e);
  }
};

// Function to update a user document in Firestore
export const updateUser = async (userId, updatedData) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, updatedData, { merge: true });
    console.log('User updated with ID: ', userId);
  } catch (e) {
    console.error('Error updating user: ', e);
  }
};

// Function to approve a supplier request and move user to suppliers collection
export const approveSupplierRequest = async (requestId) => {
  try {
    const requestDocRef = doc(db, 'supplierRequests', requestId);
    const requestSnap = await getDoc(requestDocRef);

    if (requestSnap.exists()) {
      const userId = requestSnap.data().userId;

      // Move user to suppliers collection
      await setDoc(doc(db, 'suppliers', userId), { approved: true });

      // Remove the supplier request
      await deleteDoc(requestDocRef);

      console.log("Supplier request approved and user added to suppliers.");
    } else {
      console.log("No such request.");
    }
  } catch (e) {
    console.error('Error approving supplier request: ', e);
  }
};

// Function to handle applying to become a supplier
export const applyToBecomeSupplier = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    // Check if the supplierRequest field already exists
    const userDocSnap = await getDoc(userDocRef);
    const userData = userDocSnap.data();
    
    if (userData && !userData.supplierRequest) {
      // Add supplier request field
      await setDoc(userDocRef, { supplierRequest: true }, { merge: true });
      console.log('Supplier request added to user with ID: ', userId);
    } else {
      console.log('Supplier request already exists or user not found.');
    }
  } catch (e) {
    console.error('Error applying to become supplier: ', e);
  }
};

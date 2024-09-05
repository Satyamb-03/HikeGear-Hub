import { collection, addDoc, getDocs, doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';  // Ensure you're using db, not firestore

const addUser = async (userData) => {
  try {
    const userRef = await addDoc(collection(db, 'users'), userData);
    console.log('User added with ID: ', userRef.id);
  } catch (e) {
    console.error('Error adding user: ', e);
  }
};

const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return users;
  } catch (e) {
    console.error('Error getting users: ', e);
    return [];
  }
};

const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, 'users', userId));
    console.log('User deleted with ID: ', userId);
  } catch (e) {
    console.error('Error deleting user: ', e);
  }
};

const updateUser = async (userId, updatedData) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, updatedData, { merge: true });
    console.log('User updated with ID: ', userId);
  } catch (e) {
    console.error('Error updating user: ', e);
  }
};

const approveSupplierRequest = async (requestId) => {
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

const applyToBecomeSupplier = async (userId) => {
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
// Add this to UserServices.js
const getUserData = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      return userDocSnap;
    } else {
      throw new Error("User data not found");
    }
  } catch (e) {
    console.error('Error fetching user data: ', e);
    throw new Error(e.message);
  }
};

// Update UserServices export
const UserServices = {
  addUser,
  getAllUsers,
  deleteUser,
  updateUser,
  approveSupplierRequest,
  applyToBecomeSupplier,
  getUserData // Add this line
};

export default UserServices;

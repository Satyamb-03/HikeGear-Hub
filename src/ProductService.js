import { db } from "./firebase";
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { storage } from 'firebase/storage';

// Collection name
const collectionName = "products";
const productCollectionRef = collection(db, collectionName);

class ProductService {
  // Add a new product
  addProduct(newProduct) {
    return addDoc(productCollectionRef, newProduct);
  }

  // Update an existing product
  updateProduct(id, updatedProduct) {
    const productDoc = doc(db, collectionName, id);
    return updateDoc(productDoc, updatedProduct);
  }

  // Delete a product
  deleteProduct(id) {
    const productDoc = doc(db, collectionName, id);
    return deleteDoc(productDoc);
  }

  // Get all products
  getAllProducts() {
    return getDocs(productCollectionRef);
  }

  // Get a single product by ID
  getProduct(id) {
    const productDoc = doc(db, collectionName, id);
    return getDoc(productDoc);
  }

  // Update product quantity
  async updateProductQuantity(productId, newQuantity) {
    const productRef = doc(db, collectionName, productId);
    await updateDoc(productRef, { quantity: newQuantity });
  }
}

export default new ProductService();

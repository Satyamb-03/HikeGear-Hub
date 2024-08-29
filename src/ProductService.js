import { db, storage } from "./firebase";
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const collectionName = "products";
const productCollectionRef = collection(db, collectionName);

class ProductService {
  // Add a new product
  async addProduct(newProduct, mainImageFile, additionalImageFiles) {
    let mainImageURL = '';
    let additionalImagesURLs = [];

    // Upload main image if provided
    if (mainImageFile) {
      const mainImageRef = ref(storage, `images/${mainImageFile.name}`);
      await uploadBytes(mainImageRef, mainImageFile);
      mainImageURL = await getDownloadURL(mainImageRef);
    }

    // Upload additional images if provided
    if (additionalImageFiles.length > 0) {
      const uploadPromises = Array.from(additionalImageFiles).map(async (file) => {
        const fileRef = ref(storage, `images/${file.name}`);
        await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      });
      additionalImagesURLs = await Promise.all(uploadPromises);
    }

    // Save product data with URLs
    const productData = {
      ...newProduct,
      mainImage: mainImageURL,
      additionalImages: additionalImagesURLs,
    };

    return addDoc(productCollectionRef, productData);
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

  // Get products by category and subcategory
  getProductsByCategoryAndSubcategory(category, subcategory) {
    const productQuery = query(
      productCollectionRef,
      where("category", "==", category),
      where("subcategory", "==", subcategory)
    );
    return getDocs(productQuery);
  }
}

export default new ProductService();

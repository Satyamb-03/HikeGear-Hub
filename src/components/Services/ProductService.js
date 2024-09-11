import { db, storage } from "../Context/firebase";
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const collectionName = "products";
const productCollectionRef = collection(db, collectionName);

class ProductService {
  // Add a new product
  async addProduct(newProduct, mainImageFile, additionalImageFiles) {
    let mainImageURL = '';
    let additionalImagesURLs = [];

    try {
      // Upload main image if provided
      if (mainImageFile) {
        const mainImageRef = ref(storage, `images/${Date.now()}_${mainImageFile.name}`);
        await uploadBytes(mainImageRef, mainImageFile);
        mainImageURL = await getDownloadURL(mainImageRef);
        console.log("Main image URL:", mainImageURL);
      }

      // Upload additional images if provided
      if (additionalImageFiles.length > 0) {
        const uploadPromises = Array.from(additionalImageFiles).map(async (file) => {
          const fileRef = ref(storage, `images/${Date.now()}_${file.name}`);
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);
          console.log("Additional image URL:", url);
          return url;
        });
        additionalImagesURLs = await Promise.all(uploadPromises);
      }

      // Construct product data
      const productData = {
        ...newProduct,
        mainImage: mainImageURL,
        additionalImages: additionalImagesURLs,
        createdAt: new Date().toISOString(), // Add timestamp for tracking
        supplierId: newProduct.supplierId // Ensure supplierId is included
      };

      console.log("Product data to be saved:", productData);
      await addDoc(productCollectionRef, productData);
      console.log("Product successfully added!");

    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  }

  // Update an existing product
  async updateProduct(id, updatedProduct) {
    try {
      const productDoc = doc(db, collectionName, id);
      updatedProduct.updatedAt = new Date().toISOString(); // Add updated timestamp
      await updateDoc(productDoc, updatedProduct);
      console.log(`Product with ID ${id} successfully updated.`);
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete a product
  async deleteProduct(id) {
    try {
      const productDoc = doc(db, collectionName, id);
      await deleteDoc(productDoc);
      console.log(`Product with ID ${id} successfully deleted.`);
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  }

  // Get all products
  async getAllProducts() {
    try {
      const querySnapshot = await getDocs(productCollectionRef);
      return querySnapshot;
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  }

  // Get a single product by ID
  async getProduct(id) {
    try {
      const productDoc = doc(db, collectionName, id);
      const docSnap = await getDoc(productDoc);
      return docSnap;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }

  // Update product quantity (if applicable)
  async updateProductQuantity(productId, newQuantity) {
    try {
      const productRef = doc(db, collectionName, productId);
      await updateDoc(productRef, { quantity: newQuantity, updatedAt: new Date().toISOString() });
      console.log(`Product quantity for ID ${productId} updated to ${newQuantity}.`);
    } catch (error) {
      console.error(`Error updating quantity for product ID ${productId}:`, error);
      throw error;
    }
  }

  // Get products by category and subcategory
  async getProductsByCategoryAndSubcategory(category, subcategory) {
    try {
      const productQuery = query(
        productCollectionRef,
        where("category", "==", category),
        where("subcategory", "==", subcategory)
      );
      const querySnapshot = await getDocs(productQuery);
      return querySnapshot;
    } catch (error) {
      console.error(`Error fetching products by category ${category} and subcategory ${subcategory}:`, error);
      throw error;
    }
  }

  // Get products by supplier
  async getProductsBySupplier(supplierId) {
    try {
      const productQuery = query(productCollectionRef, where("supplierId", "==", supplierId));
      const querySnapshot = await getDocs(productQuery);
      return querySnapshot;
    } catch (error) {
      console.error(`Error fetching products by supplier ID ${supplierId}:`, error);
      throw error;
    }
  }
}

export default new ProductService();

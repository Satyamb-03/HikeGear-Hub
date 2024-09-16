import React, { useState, useEffect } from 'react';
import ProductService from '../Services/ProductService';
import { useUserAuth } from '../Context/UserAuth'; // Assuming you have this hook for authentication
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import './SupplierDashboard.css';

const SupplierDashboard = () => {
  const { user } = useUserAuth(); // Get the currently authenticated user
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [category, setCategory] = useState('Clothing');
  const [subcategory, setSubcategory] = useState('Men');
  const [showProductForm, setShowProductForm] = useState(false);
  const [products, setProducts] = useState(null); // null indicates loading state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showProductHistory, setShowProductHistory] = useState(false); // State for product history visibility
  const [totalEarnings, setTotalEarnings] = useState(0); // State for total earnings

  // Initialize Firestore
  const db = getFirestore();

  // Define subcategories for each category
  const subcategoriesByCategory = {
    Clothing: ['Men', 'Women', 'Kids'],
    Footwear: ['Men', 'Women', 'Kids'],
    Gear: ['Camp Kitchen', 'Packs', 'Sleep Systems', 'Tents & Bivvies', 'Additional Gear'],
    Accessories: ['Clothing Accessories', 'Footwear Accessories', 'Bagpack Accessories']
  };

  // Fetch products and earnings on component mount and user change
  useEffect(() => {
    const fetchProducts = async () => {
      if (user) {
        try {
          // Fetch products by supplier
          const productsSnapshot = await ProductService.getProductsBySupplier(user.uid);
          if (!productsSnapshot.empty) {
            const productList = productsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            productList.sort((a, b) => a.id.localeCompare(b.id));
            setProducts(productList);
          } else {
            setProducts([]); // No products found
          }

          // Fetch earnings for the supplier
          const earningsQuery = query(
            collection(db, 'checkout'),
            where('supplierIds', 'array-contains', user.uid) // Adjust the query based on your data structure
          );
          const earningsSnapshot = await getDocs(earningsQuery);
          const earnings = earningsSnapshot.docs.reduce((acc, doc) => {
            const data = doc.data();
            return (  data.finalTotal -acc  || 0);
          }, 0);
          setTotalEarnings(earnings);

        } catch (error) {
          console.error("Error fetching products or earnings:", error);
          setProducts([]);
          setTotalEarnings(0); // In case of error, set earnings to 0
        }
      }
    };
    fetchProducts();
  }, [user, db]);

  // Handle additional images change
  const handleAdditionalImagesChange = (e) => {
    setAdditionalImageFiles(e.target.files);
  };

  // Handle product form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      name,
      description,
      pricePerDay: parseFloat(pricePerDay), // Ensure price is a number
      category,
      subcategory,
      supplierId: user.uid
    };

    try {
      await ProductService.addProduct(newProduct, mainImageFile, additionalImageFiles);

      // Refresh the product list and earnings
      const productsSnapshot = await ProductService.getProductsBySupplier(user.uid);
      const productList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      productList.sort((a, b) => a.id.localeCompare(b.id));
      setProducts(productList);

      // Refresh total earnings
      const earningsQuery = query(
        collection(db, 'checkout'),
        where('supplierIds', 'array-contains', user.uid) // Adjust the query based on your data structure
      );
      const earningsSnapshot = await getDocs(earningsQuery);
      const earnings = earningsSnapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        return  (data.finalTotal - acc || 0);
      }, 0);
      setTotalEarnings(earnings);

      // Show success popup
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);

      // Reset form fields
      setName('');
      setDescription('');
      setPricePerDay('');
      setMainImageFile(null);
      setAdditionalImageFiles([]);
      setShowProductForm(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    try {
      await ProductService.deleteProduct(productId);

      // Refresh the product list
      const productsSnapshot = await ProductService.getProductsBySupplier(user.uid);
      const productList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      productList.sort((a, b) => a.id.localeCompare(b.id));
      setProducts(productList);

      // Refresh total earnings
      const earningsQuery = query(
        collection(db, 'checkout'),
        where('supplierIds', 'array-contains', user.uid) // Adjust the query based on your data structure
      );
      const earningsSnapshot = await getDocs(earningsQuery);
      const earnings = earningsSnapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        return acc + (data.finalTotal || 0);
      }, 0);
      setTotalEarnings(earnings);

      console.log("Product successfully deleted!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="supplier-dashboard">
      <div className="content">
        <h1>Supplier Dashboard</h1>

        {/* Display total earnings */}
        <div className="total-earnings">
          <h2>Total Earnings: ${totalEarnings.toFixed(2)}</h2>
        </div>

        {showSuccessPopup && (
          <div className="success-popup">
            <p>Your product has been successfully added!</p>
          </div>
        )}

        <div className="add-product-section">
          <button className="open-form-button" onClick={() => setShowProductForm(true)}>
            Add Product
          </button>

          {showProductForm && (
            <div className="form-popup">
              <div className="form-container">
                <form onSubmit={handleSubmit} className="add-product-form">
                  <label>
                    Name:
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Description:
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Price per Day:
                    <input
                      type="number"
                      value={pricePerDay}
                      onChange={(e) => setPricePerDay(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Main Image:
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setMainImageFile(e.target.files[0])}
                      required
                    />
                  </label>
                  <label>
                    Additional Images:
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesChange}
                    />
                  </label>
                  <label>
                    Category:
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setSubcategory(subcategoriesByCategory[e.target.value][0]); // Reset subcategory
                      }}
                    >
                      {Object.keys(subcategoriesByCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Subcategory:
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                    >
                      {subcategoriesByCategory[category].map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </label>

                  <button type="submit" className="add-product-button">
                    Add Product
                  </button>
                  <button className="close-form-button" onClick={() => setShowProductForm(false)}>
                    Close
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Toggle button for Product History */}
        <button 
          className="toggle-product-history-button"
          onClick={() => setShowProductHistory(!showProductHistory)}
        >
          {showProductHistory ? 'Hide Product History' : 'Show Product History'}
        </button>

        {/* Product History Section */}
        {showProductHistory && (
          <div className="product-history">
            <h2>Product History</h2>

            {/* Display loading message while fetching products */}
            {products === null ? (
              <p>Loading product history...</p>
            ) : products.length > 0 ? (
              <table className="product-history-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Subcategory</th>
                    <th>Price per Day</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.subcategory}</td>
                      <td>${product.pricePerDay.toFixed(2)}</td>
                      <td>
                        <button 
                          className="delete-button" 
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No products added yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;

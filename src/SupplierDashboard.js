import React, { useState, useEffect } from 'react';
import ProductService from './ProductService';
import EarningsService from './EarningServices'; // Assuming you have this service for fetching earnings data
import { useUserAuth } from './UserAuth'; // Assuming you have this hook for authentication
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
  const [showProductHistory, setShowProductHistory] = useState(false); // State to toggle product history visibility
  const [showEarnings, setShowEarnings] = useState(false); // State to toggle earnings visibility
  const [totalCheckoutEarnings, setTotalCheckoutEarnings] = useState(0);
  const [checkoutEarnings, setCheckoutEarnings] = useState([]);

  // Fetch products and earnings on component mount and user change
  useEffect(() => {
    const fetchProducts = async () => {
      if (user) {
        try {
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
        } catch (error) {
          console.error("Error fetching products:", error);
          setProducts([]); // In case of error, set products to empty
        }
      }
    };

    const fetchEarnings = async () => {
      if (user) {
        try {
          const totalEarnings = await EarningsService.getTotalEarningsBySupplier(user.uid);
          const earningsByCheckout = await EarningsService.getEarningsByCheckout(user.uid);
          setTotalCheckoutEarnings(totalEarnings);
          setCheckoutEarnings(earningsByCheckout);
        } catch (error) {
          console.error("Error fetching earnings:", error);
        }
      }
    };

    fetchProducts();
    fetchEarnings();
  }, [user]);

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

      // Refresh the product list
      const productsSnapshot = await ProductService.getProductsBySupplier(user.uid);
      const productList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      productList.sort((a, b) => a.id.localeCompare(b.id));
      setProducts(productList);

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

      console.log("Product successfully deleted!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="supplier-dashboard">
      <div className="content">
        <h1>Supplier Dashboard</h1>

        {showSuccessPopup && (
          <div className="success-popup">
            <p>Your product has been successfully added!</p>
          </div>
        )}

        <div className="add-product-section">
          <button className="open-form-button" onClick={() => setShowProductForm(true)}>
            Add Product
          </button>

          {/* New View Product History Button */}
          <button
            className="view-history-button"
            onClick={() => setShowProductHistory(!showProductHistory)}
          >
            {showProductHistory ? 'Hide Product History' : 'View Product History'}
          </button>

          {/* New Toggle Earnings Button */}
          <button
            className="toggle-earnings-button"
            onClick={() => setShowEarnings(!showEarnings)}
          >
            {showEarnings ? 'Hide Earnings' : 'View Earnings'}
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
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Clothing">Clothing</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Gear">Gear</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </label>
                  <label>
                    Subcategory:
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                    >
                      {category === 'Clothing' && (
                        <>
                          <option value="Men">Men's Clothing</option>
                          <option value="Women">Women's Clothing</option>
                          <option value="Kids">Kids' Clothing</option>
                        </>
                      )}
                      {category === 'Footwear' && (
                        <>
                          <option value="Men">Men's Footwear</option>
                          <option value="Women">Women's Footwear</option>
                          <option value="Kids">Kids' Footwear</option>
                        </>
                      )}
                      {category === 'Gear' && (
                        <>
                          <option value="Camp Kitchen">Camp Kitchen</option>
                          <option value="Packs">Packs</option>
                          <option value="Sleep Systems">Sleep Systems</option>
                          <option value="Tents & Bivvies">Tents & Bivvies</option>
                        </>
                      )}
                      {category === 'Accessories' && (
                        <>
                          <option value="Clothing Accessories">Clothing Accessories</option>
                          <option value="Footwear Accessories">Footwear Accessories</option>
                        </>
                      )}
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
        
        {/* Conditionally display Product History Section */}
        {showProductHistory && (
          <div className="product-history">
            <h2>Product History</h2>
            {products === null ? (
              <p>Loading product history...</p>
            ) : products.length > 0 ? (
              <ul>
                {products.map((product) => (
                  <li key={product.id} className="product-item">
                    <h3>{product.name}</h3>
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Price per Day:</strong> ${product.pricePerDay.toFixed(2)}</p>
                    <button 
                      className="delete-button" 
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No products added yet.</p>
            )}
            <div className="total-checkout-earnings">
              <h2>Total Earnings</h2>
              <p>${totalCheckoutEarnings.toFixed(2)}</p>
            </div>
          </div>
        )}
        
        {/* Conditionally display Earnings Section */}
        {showEarnings && (
          <div className="earnings-section">
            <h2>Earnings Overview</h2>
            <table className="earnings-table">
              <thead>
                <tr>
                  <th>Checkout ID</th>
                  <th>Earnings ($)</th>
                </tr>
              </thead>
              <tbody>
                {checkoutEarnings.map(checkout => (
                  <tr key={checkout.id}>
                    <td>{checkout.id}</td>
                    <td>${checkout.totalEarnings.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;

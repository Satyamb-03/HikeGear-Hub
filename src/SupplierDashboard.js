import React, { useState, useEffect } from 'react';
import ProductService from './ProductService';
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
  const [products, setProducts] = useState([]); // State to hold the products list

  useEffect(() => {
    const fetchProducts = async () => {
      if (user) {
        try {
          console.log("Fetching products for user:", user.uid);
          const productsSnapshot = await ProductService.getProductsBySupplier(user.uid);
          console.log("Products snapshot:", productsSnapshot.docs.map(doc => doc.data())); // Debugging line
          
          if (!productsSnapshot.empty) {
            const productList = productsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

            console.log("Fetched products:", productList); // Debugging line

            productList.sort((a, b) => a.id.localeCompare(b.id));
            setProducts(productList);
          } else {
            console.log("No products found for this supplier.");
            setProducts([]);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };

    fetchProducts();
  }, [user]);

  const handleAdditionalImagesChange = (e) => {
    setAdditionalImageFiles(e.target.files);
  };

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
      console.log("Submitting product:", newProduct);
      await ProductService.addProduct(newProduct, mainImageFile, additionalImageFiles);

      // Refresh the product list
      const productsSnapshot = await ProductService.getProductsBySupplier(user.uid);
      const productList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      productList.sort((a, b) => a.id.localeCompare(b.id));
      setProducts(productList);

      // Reset form fields
      setName('');
      setDescription('');
      setPricePerDay('');
      setMainImageFile(null);
      setAdditionalImageFiles([]);
      setShowProductForm(false);
      console.log("Product successfully submitted!");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

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
                    {additionalImageFiles.length > 0 && (
                      <div className="image-preview">
                        {Array.from(additionalImageFiles).map((file, index) => (
                          <img key={index} src={URL.createObjectURL(file)} alt={`Additional ${index + 1}`} />
                        ))}
                      </div>
                    )}
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
                          <option value="Camp Ktchen">Camp Kitchen</option>
                          <option value="Packs">Packs</option>
                          <option value="Sleep Systems">Sleep Systems</option>
                          <option value="Tents & Bivvies">Tents & Bivvies</option>
                          <option value="Additional Gear">Additional Gear</option>
                        </>
                      )}
                      {category === 'Accessories' && (
                        <>
                          <option value="Clothing Accessories">Clothing Accessories</option>
                          <option value="Footwear Accessories">Footwear Accessories</option>
                          <option value="Additional Accessories">Additional Accessories</option>
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
      
        <div className="product-history">
          <h2>Product History</h2>
          {products.length > 0 ? (
            <ul>
              {products.map((product) => (
                <li key={product.id} className="product-item">
                  <h3>{product.name}</h3>
                  <p>Category: {product.category}</p>
                  <p>Price per Day: ${product.pricePerDay.toFixed(2)}</p>
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
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;

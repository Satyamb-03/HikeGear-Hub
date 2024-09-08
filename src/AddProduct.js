import React, { useState, useEffect } from 'react';
import ProductService from './ProductService';
import './AddProduct.css';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [category, setCategory] = useState('Clothing');
  const [subcategory, setSubcategory] = useState('Men');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  const handleAdditionalImagesChange = (e) => {
    setAdditionalImageFiles(e.target.files);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubcategory(''); // Reset subcategory when category changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newProduct = {
      name,
      description,
      pricePerDay: parseInt(pricePerDay),
      category,
      subcategory
    };

    try {
      await ProductService.addProduct(newProduct, mainImageFile, additionalImageFiles);
      setName('');
      setDescription('');
      setPricePerDay('');
      setMainImageFile(null);
      setAdditionalImageFiles([]);
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const productsData = await ProductService.getAllProducts();
      console.log('Fetched products:', productsData); // Debugging line
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit} className="add-product-form">
        {/* Form fields */}
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
            onChange={handleCategoryChange}
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
            {/* Subcategory options */}
          </select>
        </label>
        <button type="submit">Add Product</button>
      </form>

      {/* Product List */}
      <div className="product-list">
        {error && <p>{error}</p>}
        {products.length ? (
          products.map((product) => (
            <div key={product.id} className="product-item">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price per Day: ${product.pricePerDay}</p>
              {product.mainImage && <img src={product.mainImage} alt={product.name} />}
              {product.additionalImages && product.additionalImages.length > 0 && (
                <div className="additional-images">
                  {product.additionalImages.map((url, index) => (
                    <img key={index} src={url} alt={`Additional ${index + 1}`} />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default AddProduct;

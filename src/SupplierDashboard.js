import React, { useState } from 'react';
import ProductService from './ProductService';
import './SupplierDashboard.css';

const SupplierDashboard = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [category, setCategory] = useState('Clothing');
  const [subcategory, setSubcategory] = useState('Men');

  const handleAdditionalImagesChange = (e) => {
    setAdditionalImageFiles(e.target.files);
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
      // Clear the form or provide feedback
      setName('');
      setDescription('');
      setPricePerDay('');
      setMainImageFile(null);
      setAdditionalImageFiles([]);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="supplier-dashboard">
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
                  <option value="Furniture">Camp Furniture</option>
                  <option value="Kitchen">Camp Kitchen</option>
                  <option value="Packs">Packs</option>
                  <option value="Sleep">Sleep Systems</option>
                  <option value="Tents">Tents & Bivvies</option>
                  <option value="Additional">Additional Gear</option>
                </>
              )}
              {category === 'Accessories' && (
                <>
                  <option value="Headwear">Headwear</option>
                  <option value="Clothing">Clothing Accessories</option>
                  <option value="Footwear">Footwear Accessories</option>
                  <option value="Backpack">Backpack Accessories</option>
                </>
              )}
            </select>
          </label>
          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default SupplierDashboard;

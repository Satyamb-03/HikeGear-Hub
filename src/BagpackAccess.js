
import React, { useState, useEffect, useContext } from 'react';
import './Accessories.css'; // Ensure this file has the correct styles for Accessories
import { useCart } from './CartContext';
import ProductService from './ProductService';

function BackpackAccess() {
  const [backpackItems, setBackpackItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // Use useCart hook

  useEffect(() => {
    const fetchBackpackItems = async () => {
      try {
        const productSnapshot = await ProductService.getAllProducts();
        const backpackList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).filter(item => item.category === 'Accessories' && item.subcategory === 'Backpack');
        setBackpackItems(backpackList);
      } catch (error) {
        console.error("Error fetching backpack items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBackpackItems();
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item, 1, 1); // Default quantity and days
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  if (loading) {
    return <p>Loading backpack items...</p>;
  }

  return (
    <div className="Accessories">  

      <h2>Backpack Accessories</h2>
      <p>Discover essential backpack accessories to enhance your hiking experience.</p>

      <div className="accessories-list">  
        {backpackItems.map((item) => (
          <div key={item.id} className={`accessories-item ${item.newArrival ? 'new-arrival' : ''}`}> {/* Match class names */}
            {item.newArrival && <span className="new-badge">New Arrival</span>}
            <img src={item.mainImage} alt={item.name} /> {/* Ensure the image field matches */}
            <h3 onClick={() => handleItemClick(item)} className="item-name-clickable">
              {item.name}
            </h3>
            <p className="description-preview">
              {item.description.split('. ')[0] + '...'}
            </p> {/* Match class name */}
            <p className="price">${item.pricePerDay}/day</p> {/* Ensure the price field matches */}
            <button className="confirm-btn" onClick={() => handleAddToCart(item)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="popup" onClick={handleClosePopup}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <span className="close-btn" onClick={handleClosePopup}>
              &times;
            </span>
            <h2>{selectedItem.name}</h2>
            <p>{selectedItem.fullDescription || selectedItem.description}</p>
            <div className="popup-images">
              {selectedItem.additionalImages && selectedItem.additionalImages.length > 0 ? (
                selectedItem.additionalImages.map((image, index) => (
                  <img key={index} src={image} alt={`${selectedItem.name} - ${index + 1}`} />
                ))
              ) : (
                <p>No additional images available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BackpackAccess;

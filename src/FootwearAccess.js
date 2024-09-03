import React, { useState, useEffect, useContext } from 'react';
import './Accessories.css'; // Ensure this file has the correct styles for Accessories
import { CartContext } from './CartContext';
import ProductService from './ProductService';

function FootwearAccess() {
  const [footwearItems, setFootwearItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchFootwearItems = async () => {
      try {
        const productSnapshot = await ProductService.getAllProducts();
        const footwearList = productSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(
            item => item.category === 'Accessories' && item.subcategory === 'Footwear'
          );
        setFootwearItems(footwearList);
      } catch (error) {
        console.error('Error fetching footwear items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFootwearItems();
  }, []);

  const handleAddToCart = item => {
    addToCart(item, 1, 1); // Default quantity and days
  };

  const handleItemClick = item => {
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  if (loading) {
    return <p>Loading footwear accessories...</p>;
  }

  return (
    <div className="Accessories">
      <h2>Footwear Accessories</h2>
      <p>Discover essential footwear accessories to enhance your hiking experience.</p>

      <div className="clothing-list">
        {footwearItems.map(item => (
          <div
            key={item.id}
            className={`clothing-item ${item.newArrival ? 'new-arrival' : ''}`}
          >
            {item.newArrival && <span className="new-badge">New Arrival</span>}
            <img src={item.mainImage} alt={item.name} />
            <h3 onClick={() => handleItemClick(item)} className="item-name-clickable">
              {item.name}
            </h3>
            <p className="description-preview">{item.description.split('. ')[0] + '...'}</p>
            <p className="price">${item.pricePerDay}/day</p>
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
            {/* Display full description */}
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

export default FootwearAccess;

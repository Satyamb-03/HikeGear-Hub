import React, { useState, useEffect, useContext } from 'react';
import './Clothing.css';
import { CartContext } from './CartContext';
import ProductService from './ProductService';

function Clothing() {
  const [clothingItems, setClothingItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchClothingItems = async () => {
      try {
        const clothingSnapshot = await ProductService.getAllProducts();
        const clothingList = clothingSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClothingItems(clothingList);

        // Initialize quantities for each item
        const initialQuantities = {};
        clothingList.forEach(item => {
          initialQuantities[item.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching clothing items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClothingItems();
  }, []);

  const handleQuantityChange = (id, value) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [id]: value
    }));
  };

  const handleAddToCart = (item) => {
    addToCart(item, quantities[item.id], days);
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [item.id]: 1
    }));
    setDays(1);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  if (loading) {
    return <p>Loading clothing items...</p>;
  }

  return (
    <div className="Clothing">
      <h2>Clothing</h2>
      <p>Explore our wide range of outdoor clothing suitable for all weather conditions.</p>
      <div className="clothing-list">
        {clothingItems.map((item) => (
          <div key={item.id} className={`clothing-item ${item.newArrival ? 'new-arrival' : ''}`}>
            {item.newArrival && <span className="new-badge">New Arrival</span>}
            <img src={item.image} alt={item.name} />
            <h3 onClick={() => handleItemClick(item)} className="item-name-clickable">{item.name}</h3>
            <p>{item.description}</p>
            <p className="price">${item.pricePerDay}/day</p>
            <label>
              Quantity:
              <input
                type="number"
                value={quantities[item.id]}
                min="1"
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
              />
            </label>
            <label>
              Days:
              <input
                type="number"
                value={days}
                min="1"
                onChange={(e) => setDays(parseInt(e.target.value, 10))}
              />
            </label>
            <button
              className="confirm-btn"
              onClick={() => handleAddToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="popup" onClick={handleClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={handleClosePopup}>&times;</span>
            <h2>{selectedItem.name}</h2>
            <p>{selectedItem.fullDescription}</p>
            <div className="popup-images">
              {selectedItem.moreImages && selectedItem.moreImages.length > 0 ? (
                selectedItem.moreImages.map((image, index) => (
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

export default Clothing;

import React, { useState, useEffect, useContext } from 'react';
import './Gear.css'; // Ensure this CSS file contains styles for the Gear category
import { CartContext } from './CartContext';
import ProductService from './ProductService';

function CampFurniture() {
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [days, setDays] = useState({});
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchFurnitureItems = async () => {
      try {
        // Fetch all products and filter by 'Gear' and 'Furniture'
        const gearSnapshot = await ProductService.getAllProducts();
        const FurnitureList = gearSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).filter(item => item.category === 'Gear' && item.subcategory === 'Furniture');
        setFurnitureItems(FurnitureList);

        // Initialize quantities and days for each item
        const initialQuantities = {};
        const initialDays = {};
        FurnitureList.forEach(item => {
          initialQuantities[item.id] = 1;
          initialDays[item.id] = 1;
        });
        setQuantities(initialQuantities);
        setDays(initialDays);
      } catch (error) {
        console.error("Error fetching camp furniture items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFurnitureItems();
  }, []);

  const handleQuantityChange = (id, value) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [id]: value
    }));
  };

  const handleDaysChange = (id, value) => {
    setDays(prevDays => ({
      ...prevDays,
      [id]: value
    }));
  };

  const handleAddToCart = (item) => {
    addToCart(item, quantities[item.id], days[item.id]);
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [item.id]: 1
    }));
    setDays(prevDays => ({
      ...prevDays,
      [item.id]: 1
    }));
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  if (loading) {
    return <p>Loading camp furniture items...</p>;
  }

  return (
    <div className="Gear">
      <h2>Camp Furniture</h2>
      <p>Find the perfect furniture for your camping trips and outdoor adventures.</p>

      <div className="gear-list">
        {furnitureItems.map((item) => (
          <div key={item.id} className={`gear-item ${item.newArrival ? 'new-arrival' : ''}`}>
            {item.newArrival && <span className="new-badge">New Arrival</span>}
            {/* Display main image */}
            <img src={item.mainImage} alt={item.name} className="gear-item-image" />
            <h3 onClick={() => handleItemClick(item)} className="item-name-clickable">{item.name}</h3>
            <p>{item.description}</p>
            <p className="price">{item.pricePerDay}/day</p>
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
                value={days[item.id]}
                min="1"
                onChange={(e) => handleDaysChange(item.id, parseInt(e.target.value, 10))}
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
              {selectedItem.additionalImages && selectedItem.additionalImages.length > 0 ? (
                selectedItem.additionalImages.map((image, index) => (
                  <img key={index} src={image} alt={`${selectedItem.name} - ${index + 1}`} className="popup-image" />
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

export default CampFurniture;

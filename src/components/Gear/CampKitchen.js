import React, { useState, useEffect } from 'react';
import './Gear.css'; 
import { useCart } from '../Context/CartContext';
import ProductService from '../Services/ProductService';  

import { useUserAuth } from '../Context/UserAuth'; 

function CampKitchen() {
  const [kitchenItems, setKitchenItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const { addToCart } = useCart(); 
  const { user } = useUserAuth();

  useEffect(() => {
    const fetchKitchenItems = async () => {
      try {
  
        const gearSnapshot = await ProductService.getAllProducts();
        const kitchenList = gearSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).filter(item => item.category === 'Gear' && item.subcategory === 'Camp Kitchen');
        setKitchenItems(kitchenList);

        
        const initialQuantities = {};
        kitchenList.forEach(item => {
          initialQuantities[item.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching kitchen items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKitchenItems();
  }, []);

  const handleQuantityChange = (id, value) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [id]: value
    }));
  };

  const handleAddToCart = (item) => {
    addToCart(item, quantities[item.id], days);
    setNotification(`Added ${item.name} to cart!`);
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [item.id]: 1
    }));
    setDays(1);
    
   
    setTimeout(() => setNotification(''), 3000);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  if (loading) {
    return <p>Loading camp kitchen items...</p>;
  }

  return (
    <div className="Gear">
      <h2>Camp Kitchen</h2>
      <p>Explore our camp kitchen gear to make your outdoor cooking experience easier and more enjoyable.</p>

      <div className="gear-list">
        {kitchenItems.map((item) => (
          <div key={item.id} className={`gear-item ${item.newArrival ? 'new-arrival' : ''}`}>
            {item.newArrival && <span className="new-badge">New Arrival</span>}
            <img src={item.mainImage} alt={item.name} />
            <h3 onClick={() => handleItemClick(item)} className="item-name-clickable">{item.name}</h3>
            <p>{item.description.split('. ')[0] + '...'}</p> 
            <p className="price">{item.pricePerDay}/day</p>
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
            <p>{selectedItem.description}</p>
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

      {notification && (
        <div className="cart-message">
          {notification}
        </div>
      )}
    </div>
  );
}

export default CampKitchen;

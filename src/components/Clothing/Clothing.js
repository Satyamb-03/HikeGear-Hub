import React, { useState, useEffect } from 'react';
import './Clothing.css';
import { useCart } from '../Context/CartContext';
import ProductService from '../Services/ProductService';
import { useUserAuth } from '../Context/UserAuth'; // Import user authentication context

function Clothing() {
  const [clothingItems, setClothingItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(''); 
  const { addToCart } = useCart();
  const { user } = useUserAuth(); // Get the user from authentication context

  useEffect(() => {
    const fetchClothingItems = async () => {
      try {
        const clothingSnapshot = await ProductService.getAllProducts();
        const clothingList = clothingSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(item => item.category === 'Clothing'); 
        setClothingItems(clothingList);
      } catch (error) {
        console.error("Error fetching clothing items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClothingItems();
  }, []);

  const handleAddToCart = (item) => {
    if (user) {
      addToCart(item, 1, 1); 
      setNotification(`Added ${item.name} to cart!`);
      setTimeout(() => setNotification(''), 3000); 
    } else {
      setNotification("You need to sign in to add items to the cart.");
      setTimeout(() => setNotification(''), 3000); 
    }
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

      {notification && <div className="notification">{notification}</div>} {/* Notification message */}

      <div className="clothing-list">
        {clothingItems.map((item) => (
          <div key={item.id} className={`clothing-item ${item.newArrival ? 'new-arrival' : ''}`}>
            {item.newArrival && <span className="new-badge">New Arrival</span>}
            <img src={item.mainImage} alt={item.name} />
            <h3 onClick={() => handleItemClick(item)} className="item-name-clickable">
              {item.name}
            </h3>
            <p className="description-preview">
              {item.description.split('. ')[0] + '...'}
            </p>
            <p className="price">${item.pricePerDay}/day</p>
            <button className="confirm-btn" onClick={() => handleAddToCart(item)}>
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

export default Clothing;

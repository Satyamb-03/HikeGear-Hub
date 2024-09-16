import React, { useState, useEffect } from 'react';
import './Accessories.css'; 
import { useCart } from '../Context/CartContext';
import ProductService from '../Services/ProductService';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

function Accessories() {
  const [accessoriesItems, setAccessoriesItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(''); 
  const { addToCart } = useCart();
  
  const auth = getAuth(); // Initialize Firebase Auth

  useEffect(() => {
    const fetchAccessoriesItems = async () => {
      try {
        const productSnapshot = await ProductService.getAllProducts();
        const accessoriesList = productSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(item => item.category === 'Accessories');
        setAccessoriesItems(accessoriesList);
      } catch (error) {
        console.error("Error fetching accessories items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessoriesItems();
  }, []);

  const handleAddToCart = (item) => {
    const user = auth.currentUser; 

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
    return <p>Loading accessories items...</p>;
  }

  return (
    <div className="Accessories">
      <h2>Accessories</h2>
      <p>Discover essential accessories to make your hike comfortable and safe.</p>

      {notification && <div className="notification">{notification}</div>} {/* Notification message */}

      <div className="accessories-list">
        {accessoriesItems.map((item) => (
          <div key={item.id} className={`accessories-item ${item.newArrival ? 'new-arrival' : ''}`}>
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

export default Accessories;

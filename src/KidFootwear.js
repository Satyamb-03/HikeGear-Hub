import React, { useState, useEffect, useContext } from 'react';
import './footwear.css';
import { useCart } from './CartContext';
import ProductService from './ProductService';
 

function KidFootwear() {
  const [footwearItems, setFootwearItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // Use useCart hook

  useEffect(() => {
    const fetchFootwearItems = async () => {
      try {
        // Fetch all products and filter by 'Footwear' and 'Kids'
        const footwearSnapshot = await ProductService.getAllProducts();
        const footwearList = footwearSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).filter(item => item.category === 'Footwear' && item.subcategory === 'Kids'); // Filter by 'Footwear' and 'Kids'
        setFootwearItems(footwearList);

        // Initialize quantities for each item
        const initialQuantities = {};
        footwearList.forEach(item => {
          initialQuantities[item.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching kids' footwear items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFootwearItems();
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
    return <p>Loading kids' footwear items...</p>;
  }

  return (
    <div className="Footwear">
 
      <h2>Kids' Footwear</h2>
      <p>Discover the best footwear for your young adventurers.</p>

      <div className="footwear-list">
        {footwearItems.map((item) => (
          <div key={item.id} className={`footwear-item ${item.newArrival ? 'new-arrival' : ''}`}>
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
    </div>
  );
}

export default KidFootwear;

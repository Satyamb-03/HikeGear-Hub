import React, { useState, useEffect } from 'react';
import './Gear.css'; // Assuming this is the same CSS file used for `Gear`
import ProductService from './ProductService';
import { useCart } from './CartContext';
import { useUserAuth } from './UserAuth';
import Header from "./Header";
import NavBar from "./NavBar";

function Additional() {
  const [tentItems, setTentItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // Use useCart hook
  const { user } = useUserAuth();

  useEffect(() => {
    const fetchTentItems = async () => {
      try {
        // Fetch all products and filter by 'Gear' and 'Additional'
        const gearSnapshot = await ProductService.getAllProducts();
        const tentList = gearSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).filter(item => item.category === 'Gear' && item.subcategory === 'Additional');
        setTentItems(tentList);

        // Initialize quantities for each item
        const initialQuantities = {};
        tentList.forEach(item => {
          initialQuantities[item.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching tent items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTentItems();
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
    return <p>Loading additional gear...</p>;
  }

  return (
    <div className="Gear">
      <Header/>
      <NavBar/>
      <h2>Additional Gear</h2>
      <p>Explore a variety of additional gear for your outdoor adventures.</p>

      <div className="gear-list">
        {tentItems.map((item) => (
          <div key={item.id} className={`gear-item ${item.newArrival ? 'new-arrival' : ''}`}>
            {item.newArrival && <span className="new-badge">New Arrival</span>}
            <img src={item.mainImage} alt={item.name} />
            <h3 onClick={() => handleItemClick(item)} className="item-name-clickable">{item.name}</h3>
            {/* Display short description */}
            <p>{item.description.split('. ')[0] + (item.description.split('. ')[0].endsWith('.') ? '' : '...') }</p>
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
            {/* Display full description in popup */}
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

export default Additional;

import React, { useState, useEffect } from 'react';
import './Accessories.css'; 
import { useCart } from './CartContext';
import ProductService from './ProductService';

function Accessories() {
  // State to hold the list of accessories, the currently selected item, and loading status
  const [accessoriesItems, setAccessoriesItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartMessage, setCartMessage] = useState(''); // State to show a message when an item is added to the cart
  const { addToCart } = useCart(); // Access cart functionality from context

  useEffect(() => {
    // Fetch accessories items from the service when the component mounts
    const fetchAccessoriesItems = async () => {
      try {
        // Get all products and filter out accessories
        const productSnapshot = await ProductService.getAllProducts();
        const accessoriesList = productSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(item => item.category === 'Accessories');
        setAccessoriesItems(accessoriesList); // Update state with the fetched items
      } catch (error) {
        console.error("Error fetching accessories items:", error); // Log any errors
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchAccessoriesItems();
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to handle adding an item to the cart
  const handleAddToCart = (item) => {
    addToCart(item, 1, 1); // Add item to the cart
    setCartMessage('Item added to cart'); // Show confirmation message
    setTimeout(() => setCartMessage(''), 3000); // Hide message after 3 seconds
  };

  // Function to handle clicking on an item
  const handleItemClick = (item) => {
    setSelectedItem(item); // Set the selected item for the popup
  };

  // Function to close the popup
  const handleClosePopup = () => {
    setSelectedItem(null); // Clear the selected item
  };

  // Show loading message while fetching data
  if (loading) {
    return <p>Loading accessories items...</p>;
  }

  return (
    <div className="Accessories">
      <h2>Accessories</h2>
      <p>Discover essential accessories to make your hike comfortable and safe.</p>

      {cartMessage && <div className="cart-message">{cartMessage}</div>} {/* Show message if there's any */}

      <div className="accessories-list">
        {accessoriesItems.map((item) => (
          <div key={item.id} className={`accessories-item ${item.newArrival ? 'new-arrival' : ''}`}>
            {item.newArrival && <span className="new-badge">New Arrival</span>}
            <img src={item.mainImage} alt={item.name} />
            <h3 onClick={() => handleItemClick(item)} className="item-name-clickable">
              {item.name}
            </h3>
            <p className="description-preview">
              {item.description.split('. ')[0] + '...'} {/* Show a preview of the description */}
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

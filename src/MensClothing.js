import React, { useState, useEffect, useContext } from 'react';
import './Clothing.css';
import { useCart } from './CartContext'; // Use useCart hook
import ProductService from './ProductService';
import Header from "./Header";
import NavBar from "./NavBar";

function MensClothing() {
  const [clothingItems, setClothingItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // Use useCart hook


  useEffect(() => {
    const fetchClothingItems = async () => {
      try {
        const clothingSnapshot = await ProductService.getProductsByCategoryAndSubcategory('Clothing', 'Men');
        const clothingList = clothingSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClothingItems(clothingList);
      } catch (error) {
        console.error("Error fetching men's clothing items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClothingItems();
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
    return <p>Loading men's clothing items...</p>;
  }

  return (
    <div className="Clothing">
      <Header/>
      <NavBar/>
      <h2>Men's Clothing</h2>
      <p>Discover a variety of clothing options for men, perfect for any outdoor adventure.</p>
      <div className="clothing-list">
        {clothingItems.map((item) => (
          <div key={item.id} className={`clothing-item ${item.newArrival ? 'new-arrival' : ''}`}>
            {item.newArrival && <span className="new-badge">New Arrival</span>}
            <img src={item.mainImage} alt={item.name} />
            <h3 onClick={() => handleItemClick(item)} className="item-name-clickable">{item.name}</h3>
            <p>{item.description}</p>
            <p className="price">${item.pricePerDay}/day</p>
            <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
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

export default MensClothing;

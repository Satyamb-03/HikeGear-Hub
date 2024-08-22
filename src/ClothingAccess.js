import React, { useState } from 'react';
import './ClothingAccess.css';

const clothingAccessItems = [
  {
    id: 1,
    name: 'Thermal Gloves',
    description: 'Keep your hands warm during winter hikes.',
    fullDescription: 'These thermal gloves are designed to provide insulation and comfort in cold weather, made from high-quality materials.',
    price: '$6/day',
    image: '/Accessories/thermalGloves.jpg',
    moreImages: ['/Accessories/ThermalGloves.p.jpg', '/Accessories/ThermalGloves.b.jpg'],
    newArrival: true,
  },
  {
    id: 2,
    name: 'Gaiters',
    description: 'Protect your lower legs from mud and snow.',
    fullDescription: 'These gaiters are waterproof and durable, perfect for trekking through challenging terrains.',
    price: '$7/day',
    image: '/Accessories/Gaiters.jpg',
    moreImages: ['/Accessories/Gaiters.p.jpg', '/Accessories/Gaiters.b.jpg'],
    newArrival: true,
  },
  {
    id: 3,
    name: 'Neck Warmer',
    description: 'Soft and warm neck warmer for cold hikes.',
    fullDescription: 'This neck warmer provides excellent insulation and can be adjusted for a snug fit, keeping you warm and comfortable.',
    price: '$4/day',
    image: '/Accessories/NeckWarmer.jpg',
    moreImages: ['/Accessories/NeckWarmer.p.jpg', '/Accessories/NeckWarmer.b.jpg'],
  },
  {
    id: 4,
    name: 'Balaclava',
    description: 'Full head and neck protection.',
    fullDescription: 'This balaclava offers full coverage, protecting you from harsh winds and cold temperatures while being breathable and comfortable.',
    price: '$5/day',
    image: '/Accessories/Balaclava.jpg',
    moreImages: ['/Accessories/Balaclava.p.jpg', '/Accessories/Balaclava.b.jpg'],
  },
];

function ClothingAccess() {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddToCart = (item) => {
    console.log(`${item.name} added to cart!`);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  return (
    <div className="clothingaccess">
      <h2>Clothing Accessories</h2>
      <p>Browse our range of clothing accessories to stay warm and comfortable during your hikes.</p>

      <div className="clothingaccess-list">
        {clothingAccessItems.map((item) => (
          <div key={item.id} className={`clothingaccess-item ${item.newArrival ? 'new-arrival' : ''}`}>
            {item.newArrival && <span className="new-badge">New Arrival</span>}
            <img src={item.image} alt={item.name} />
            <h3 onClick={() => handleItemClick(item)} className="item-name-clickable">{item.name}</h3>
            <p>{item.description}</p>
            <p className="price">{item.price}</p>
            <button
              className="add-to-cart-btn"
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
              {selectedItem.moreImages.length > 0
                ? selectedItem.moreImages.map((image, index) => (
                    <img key={index} src={image} alt={`${selectedItem.name} - ${index + 1}`} />
                  ))
                : <p>No additional images available.</p>}
            </div>
            <p className="price">{selectedItem.price}</p>
            <button
              className="add-to-cart-btn"
              onClick={() => handleAddToCart(selectedItem)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClothingAccess;

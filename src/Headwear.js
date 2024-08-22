import React, { useState } from 'react';
import './Headwear.css';

const headwearItems = [
  {
    id: 1,
    name: 'Sun Hat',
    description: 'Wide-brimmed hat to protect you from the sun.',
    fullDescription: 'This sun hat is perfect for sunny days, made from breathable material and includes UV protection.',
    price: '$5/day',
    image: '/Accessories/Sunhat.jpg.jpg',
    moreImages: ['/Accessories/Sunhat.p.png', 'Accessories/Sunhat.b.png'],
    newArrival: true,
  },
  {
    id: 2,
    name: 'Helmet',
    description: 'Protect your head during adventurous hikes.',
    fullDescription: 'This helmet offers superior protection with a lightweight design, perfect for climbing or biking.',
    price: '$8/day',
    image: '/Accessories/Helmet.jpg',
    moreImages: ['/Accessories/Helmet.p.jpg', 'Accessories/Helmet.b.jpg'],
    newArrival: true,
  },
  {
    id: 3,
    name: 'Beanie',
    description: 'Warm and cozy beanie for cold weather.',
    fullDescription: 'This beanie is made from soft, insulating material to keep your head warm during chilly hikes.',
    price: '$4/day',
    image: '/Accessories/Beanie.jpg',
    moreImages: ['/Accessories/Beanie.p.jpg'],
  },
  {
    id: 4,
    name: 'Visor Cap',
    description: 'Lightweight visor to keep the sun out of your eyes.',
    fullDescription: 'This visor cap is perfect for sunny hikes, providing shade while keeping your head cool.',
    price: '$3/day',
    image: '/Accessories/VisorCap.jpg',
    moreImages: ['/Accessories/VisorCap.p.jpg'],
  },
];

function Headwear() {
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
    <div className="Headwear">
      <h2>Headwear</h2>
      <p>Explore our range of headwear to keep you protected and comfortable on your hikes.</p>

      <div className="headwear-list">
        {headwearItems.map((item) => (
          <div key={item.id} className={`headwear-item ${item.newArrival ? 'new-arrival' : ''}`}>
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

export default Headwear;

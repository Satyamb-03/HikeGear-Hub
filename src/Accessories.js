import React, { useState } from 'react';
import './Accessories.css';

const accessoriesItems = [
  {
    id: 1,
    name: 'Outdoor Research  Sun Runner Cap',
    description: 'Wide-brimmed hat to protect you from the sun.',
    fullDescription: 'Wide-brimmed hat to protect you from the sun. This sun hat is perfect for sunny days, made from breathable material and includes UV protection.',
    price: '$5/day',
    image: '/Accessories/Sunhat.jpg.jpg',
    moreImages: ['/Accessories/Sunhat.p.png', 'Accessories/Sunhat.b.png'],
    newArrival: true,
  },
  {
    id: 2,
    name: 'Icebreaker 260 Tech Glove Liners',
    description: 'Keep your hands warm during winter hikes.',
    fullDescription: 'These thermal gloves are designed to provide insulation and comfort in cold weather, made from high-quality materials.',
    price: '$6/day',
    image: '/Accessories/thermalGloves.jpg',
    moreImages: ['/Accessories/ThermalGloves.p.jpg', '/Accessories/ThermalGloves.b.jpg'],
    newArrival: true,
  },
  {
    id: 3,
    name: 'Sea to Summit Alpine Gaiters',
    description: 'Protective gaiters to keep debris out of your boots.',
    fullDescription: 'Protective gaiters to keep debris out of your boots. These gaiters provide excellent protection from mud, rain, and snow, ensuring your feet stay dry and comfortable.',
    price: '$7/day',
    image: '/Accessories/Gaiters.jpg',
    moreImages: ['/Accessories/Gaiter.p.png', 'Accessories/Gaiter.b.png'],
  },
  {
    id: 4,
    name: 'Black Diamond Vapor Helmet',
    description: 'Protect your head during adventurous hikes.',
    fullDescription: 'Protect your head during adventurous hikes. This helmet offers superior protection with a lightweight design, perfect for climbing or biking.',
    price: '$8/day',
    image: '/Accessories/Helmet.jpg',
    moreImages: ['/Accessories/Helmet.p.jpg', 'Accessories/Helmet.b.jpg'],
    newArrival: true,
  },
  {
    id: 5,
    name: 'LOWA Trekking Laces',
    description: 'Durable and high-quality replacement laces designed specifically for...',
    fullDescription: 'Durable and high-quality replacement laces designed specifically for trekking boots. Ideal for outdoor enthusiasts who need reliable and sturdy laces for their hiking adventures.',
    price: '$3/day',
    image: '/Accessories/Socks.jpg',
    moreImages: ['/Accessories/Socks.b.jpg'],
  },
  {
    id: 6,
    name: 'Headlamp',
    description: 'Bright LED headlamp for night hikes.',
    fullDescription: 'This rechargeable headlamp provides up to 440 lumens of light, perfect for late-night or early-morning hikes.',
    price: '$12/day',
    image: '/Accessories/Headlamp.jpg',
    moreImages: ['/Accessories/Headlamp.p.jpg', 'Accessories/Headlamp.b.jpg','Accessories/Headlamp.f.jpg'],
    newArrival: true,
  },
];

function Accessories() {
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
    <div className="Accessories">
      <h2>Accessories</h2>
      <p>Discover essential accessories to make your hike comfortable and safe.</p>

      <div className="accessories-list">
        {accessoriesItems.map((item) => (
          <div key={item.id} className={`accessories-item ${item.newArrival ? 'new-arrival' : ''}`}>
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

export default Accessories;

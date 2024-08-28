import React, { useState } from 'react';
import './Accessories.css';
const footwearAccessItems = [

  {
    id: 1,
    name: 'Sea to Summit Alpine Gaiters',
    description: 'Protect your lower legs from mud and snow.',
    fullDescription: 'Protect your lower legs from mud and snow. These gaiters are waterproof and durable, perfect for trekking through challenging terrains.',
    price: '$7/day',
    image: '/Accessories/Gaiters.jpg',
    moreImages: ['/Accessories/Gaiters.p.jpg', '/Accessories/Gaiters.b.jpg'],
    newArrival: true,
  },
  {
    id: 2,
    name: 'LOWA Trekking Laces',
    description: 'Durable and high-quality replacement laces designed specifically for... .',
    fullDescription: 'Durable and high-quality replacement laces designed specifically for trekking boots. Ideal for outdoor enthusiasts who need reliable and sturdy laces for their hiking adventures.',
    price: '$3/day',
    image: '/Accessories/Lace.jpg',
    moreImages: ['/Accessories/Lace.b.jpg'],
  },
  {
    id: 3,
    name: 'Waterproof Shoe Covers',
    description: 'Keep your shoes dry in wet conditions.',
    fullDescription: 'Keep your shoes dry in wet conditions. These waterproof shoe covers are lightweight and easy to pack, perfect for unexpected rain or wet terrain.',
    price: '$4/day',
    image: '/Accessories/ShoeCover.jpg',
    moreImages: ['/Accessories/ShoeCover.p.jpg', '/Accessories/ShoeCover.b.jpg'],
  },
  {
  id: 4,
  name: 'Crampons',
  description: 'Essential for icy and snowy terrains.',
  fullDescription: 'Essential for icy and snowy terrains. These crampons provide excellent traction on ice and snow, perfect for winter hikes or mountaineering.',
  price: '$10/day',
  image: '/Accessories/Crampons.jpg',
  moreImages: ['/Accessories/Crampons.p.jpg', '/Accessories/Crampons.b.jpg'],
  newArrival: true,
  }
];

function FootwearAccess() {
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
    <div className="footwearaccess">
      <h2>Footwear Accessories</h2>
      <p>Explore our collection of footwear accessories to ensure your feet stay comfortable and protected during hikes.</p>

      <div className="footwearaccess-list">
        {footwearAccessItems.map((item) => (
          <div key={item.id} className={`footwearaccess-item ${item.newArrival ? 'new-arrival' : ''}`}>
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

export default FootwearAccess;

import React, { useState } from 'react';
import './Accessories.css';
const backpackAccessItems = [
  {
    id: 1,
    name: 'Osprey Hydraulics LT Reservoirs',
    description: 'Stay hydrated with this easy-to-fill reservoir.',
    fullDescription: 'This hydration reservoir fits most backpacks and includes a wide-mouth opening for easy filling and cleaning.',
    price: '$15/day',
    image: '/Accessories/HydrationReservoir.jpg',
    moreImages: ['/Accessories/HydrationReservoir.p.jpg', '/Accessories/HydrationReservoir.b.jpg'],
    newArrival: true,
  },
  {
    id: 2,
    name: 'Patagonia Friction Beltc',
    description: 'Enhance comfort with this adjustable waist belt.',
    fullDescription: 'This backpack waist belt provides additional support and stability, reducing strain on your shoulders during long hikes.',
    price: '$12/day',
    image: '/Accessories/WaistBelt.jpg',
    moreImages: ['/Accessories/WaistBelt.p.jpg', '/Accessories/WaistBelt.b.jpg'],
    newArrival: false,
  },
  {
    id: 3,
    name: 'Companion Family First Aid Kit',
    description: 'Compact and essential first aid kit for hiking emergencies.',
    fullDescription: 'This first aid kit includes basic supplies for treating minor injuries and handling emergencies on the trail.',
    price: '$20/day',
    image: '/Accessories/FirstAidKit.jpg',
    moreImages: ['/Accessories/FirstAidKit.p.jpg', '/Accessories/FirstAidKit.b.jpg'],
  },
  {
    id: 4,
    name: 'Sea to Summit Ultra-Sil Compression Sack',
    description: 'Compress your gear to save space in your backpack.',
    fullDescription: 'This compression sack helps you pack more efficiently by reducing the volume of your gear, ideal for sleeping bags and clothing.',
    price: '$8/day',
    image: '/Accessories/CompressionSack.jpg',
    moreImages: ['/Accessories/CompressionSack.p.jpg', '/Accessories/CompressionSack.b.jpg'],
    newArrival: true,
  },
];

function BackpackAccess() {
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
    <div className="backpackaccess">
      <h2>Backpack Accessories</h2>
      <p>Explore our collection of backpack accessories to enhance your hiking experience and stay prepared.</p>

      <div className="backpackaccess-list">
        {backpackAccessItems.map((item) => (
          <div key={item.id} className={`backpackaccess-item ${item.newArrival ? 'new-arrival' : ''}`}>
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

export default BackpackAccess;

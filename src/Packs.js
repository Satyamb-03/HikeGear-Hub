import React, { useState } from 'react';
import './Gear.css';

const gearItems = [
  {
    id: 1,
    name: 'Osprey Ultralight Stuff Waist Pack',
    description: 'The Ultralight Stuff Waist Pack is an ideal accessory on your adventures....',
    fullDescription: 'The Ultralight Stuff Waist Pack is an ideal accessory on your adventures to expand your carrying capacity or keep essentials close. It weighs pretty much nothing, has two compartments to keep your essentials organised and stuffs into its own pocket when not in use.',
    price: '$10/day',
    image: '/gear/pa.1.jpg',
    moreImages: ['/gear/pa1.jpg','/gear/pa1.1.jpg'],
    newArrival: true,
  },
  {
    id: 2,
    name: 'Osprey Tempest Velocity 20 Multisport Pack',
    description: 'The women-specific Tempest Velocity 20 combines the multi-sport features of the Talon family....',
    fullDescription: 'The women-specific Tempest Velocity 20 combines the multi-sport features of the Talon family with a soft-flask compatible, running-inspired harness and flexible back panel for added efficiency and versatility on your light-and-fast adventures, whether you are setting new personal bests, bagging peaks or linking quick laps on the snow. Other features include an adjustable torso for a custom fit, harness and hip belt pockets, a shove-it pocket that can stow a helmet, Stow-on-the-Go™ pole attachment and ice tool attachments.',
    price: '$20/day',
    image: '/gear/bag.jpg',
    moreImages: ['/gear/bag.jpg','/gear/bg1.jpg','/gear/bg2.jpg'],
  },
  {
    id: 3,
    name: 'Osprey Arcane Roll Top Daypack',
    description: 'The 22-litre Arcane Roll Top Daypack is built with clean lines and durable recycled fabric ...',
    fullDescription: 'The 22-litre Arcane Roll Top Daypack is built with clean lines and durable recycled fabric to create a pack that withstands the demands of daily use. It features a breathable harness and back panel for a comfortable carry, a roll-top opening and a self-locking security hook that allows you to wrap the harness around a pole, table leg or similar. Other features include a padded laptop sleeve and other internal organisation, a stretch-mesh shoulder strap pocket for handy access to small items and a low-profile, stretchy pocket to keep your water bottle to hand.',
    price: '$25/day',
    image: '/gear/pa2.jpg',
    moreImages: ['/gear/pa2.jpg','/gear/pa.2.2.jpg','/gear/pa.2.1.jpg'],
    newArrival: true,
  },
  {
    id: 4,
    name: 'Osprey 50th Anniversary Arcane Large Day',
    description: 'The 20-litre 50th Anniversary Arcane Large Day is a limited edition pack built...',
    fullDescription: 'The 20-litre 50th Anniversary Arcane Large Day is a limited edition pack built with 100%-recycled durable fabrics and clean lines to create a pack for your big everyday adventures. It features an anniversary logo patch, a breathable harness and back panel to keep you comfortable and a self-locking security hook that allows you to wrap the harness around a pole, table leg or similar. A large J-zip front panel opening gives you access to the main compartment, the front panel has a handy scratch-free pocket and the side has a low-profile, stretchy pocket to keep your water bottle to hand.',
    price: '$30/day',
    image: '/gear/pa3.jpg',
    moreImages: ['/gear/pa3.jpg','/gear/ppa3.1.jpg','/gear/pa3.2.jpg'],
    newArrival: true,
  },
 
];

function Gear() {
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
    <div className="Gear">
      <h2>Gear</h2>
      <p>Get top-notch hiking gear, from tents to backpacks.</p>

      <div className="gear-list">
        {gearItems.map((item) => (
          <div 
            key={item.id} 
            className={`gear-item ${item.newArrival ? 'new-arrival' : ''}`}
          >
            {item.newArrival && <span className="new-badge">New Arrival</span>}
            <img src={item.image} alt={item.name} />
            <h3 onClick={() => handleItemClick(item)} className="item-name-clickable">
              {item.name}
            </h3>
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
            <p>{selectedItem.fullDescription || selectedItem.description}</p>
            <div className="popup-images">
              {selectedItem.moreImages && selectedItem.moreImages.length > 0 ? (
                selectedItem.moreImages.map((image, index) => (
                  <img key={index} src={image} alt={`${selectedItem.name} - ${index + 1}`} />
                ))
              ) : (
                <p>No additional images available.</p>
              )}
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

export default Gear;

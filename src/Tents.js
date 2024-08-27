import React, { useState } from 'react';
import './Gear.css';

const gearItems = [
  {
    id: 1,
    name: 'Sea to Summit Ikos TR3 Three-Person Tent',
    description: 'The 3-season, freestanding Ikos TR3 Tent is designed for comfort-oriented backpacking ....',
    fullDescription: 'The 3-season, freestanding Ikos TR3 Tent is designed for comfort-oriented backpacking and vehicle-supported camping. It features durable materials, Tension Ridge™ poles that maximise the living space inside the tent so you can move around in relative comfort, machined-aluminium pole feet/rainfly C-clips for easy pitching and a variety of set-up modes, including fly only options and stargazing modes. Comes complete with two gear lofts and a compression storage bag.',
    price: '$30/day',
    image: '/gear/t3.jpg',
    moreImages: ['/gear/t3.jpg','/gear/t3.1.jpg','/gear/t3.2.jpg'],
  },
  {
    id: 2,
    name: 'Coleman Weathermaster Air XL 4-Person Tent',
    description: 'The generously sized, tunnel-shaped, inflatable Weathermaster Air XL 4-Person Tent...',
    fullDescription: 'The generously sized, tunnel-shaped, inflatable Weathermaster Air XL 4-Person Tent has a large living space, two sleeping rooms with BlackOut Bedroom® technology for a more restful sleep, an extended front porch and full head height throughout. FastPitch™ Air technology make it fast to pitch and can be handled by a single person, with a supplied Manometer displaying the optimum air pressure. The air poles, adjustable storm straps, fully taped and waterproofed fabrics keep you dry and safe inside during stormy conditions. For easy handling when packed, it comes with a sturdy wheeled storage bag.',
    price: '40/day',
    image: '/gear/t4.jpg',
    moreImages: ['/gear/t4.jpg','/gear/t4.1.jpg','/gear/t4.2.jpg'],
    newArrival: true,
  },
  {
    id: 3,
    name: 'The North Face VE 25 Tent',
    description: 'The VE 25 is a three-person expedition tent designed for extreme durability',
    fullDescription: 'The VE 25 is a three-person expedition tent designed for extreme durability and protection against the sort of intense weather you can experience on alpine adventures. DAC poles and stakes, welded reinforcements on the fly plus high-strength guylines with equalisers keep the tent grounded in snow and strong winds and a port window lets you check out the conditions before opening doors. Other features include high-low venting to minimise condensation, dual doors into the front vestibule and plenty of pockets and hanging loops for your gear.',
    price: '$20/day',
    image: '/gear/tent1.jpg',
    moreImages: [,'/gear/tent1.jpg','/gear/t1.jpg','/gear/t2.jpg'],
  },
  {
    id: 4,
    name: 'Sea to Summit Alto TR2 PLUS Ultralight Backpacking Tent',
    description: 'The Alto TR2 PLUS is a two-person, semi-freestanding tent with a full fabric inner...',
    fullDescription: 'The Alto TR2 PLUS is a two-person, semi-freestanding tent with a full fabric inner for adventuring into cold winds and cold temperatures. It has lots of space due to a tension ridge creating near vertical walls, superior adjustable ventilation with vents at the top and down low to control airflow, is easy to set up and has unmatched versatility with five set-up options. Other details include a FairShare Storage System for easy packing and a Lightbar System that uses the tent pole storage sack and your headlamp to provide soft, even illumination.',
    price: '$25/day',
    image: '/gear/t5.jpg',
    moreImages: ['/gear/t5.jpg','/gear/t5.1.jpg','/gear/t5.2.jpg'],
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

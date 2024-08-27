import React, { useState } from 'react';
import './Gear.css';

const gearItems = [
  {
    id: 1,
    name: 'OZtrail Deluxe Kitchen with Sink',
    description: 'The Deluxe Kitchen with Sink is a compact all-in-one camp kitchen solution...',
    fullDescription: 'The Deluxe Kitchen with Sink is a compact all-in-one camp kitchen solution. It has a built-in sink, paper towel holder, lantern pole for hanging your light and cooking after the sun goes down, a double cupboard with MDF shelves for storing food and kitchen items and a generous bench top that can take a large format stove. A great choice when you want it all but dont have a lot of space at camp..',
    price: '$10/day',
    image: '/gear/sink.jpg',
    moreImages: ['/gear/sink.jpg','/gear/sink1.jpg','/gear/sink2.jpg'],
    newArrival: true,
  },
  {
    id: 2,
    name: 'Coleman Folding Card Table',
    description: 'If you are looking for a lightweight, portable table for your campsite or an extra...',
    fullDescription: 'If you are looking for a lightweight, portable table for your campsite or an extra table for your card games at home, this Folding Card Table is just the thing. It has a steel frame, a vacuum-moulded top, a safety lock so it wont collapse on you and is rated to carry weight up to 180kg.',
    price: '$80/day',
    image: '/gear/table.jpg',
    moreImages: ['/gear/table.jpg'],
  },
  {
    id: 3,
    name: 'Helinox Personal Shade Chair Attachment',
    description: 'The Personal Shade attaches to most Helinox chairs to provide a shady...',
    fullDescription: 'The Personal Shade attaches to most Helinox chairs to provide a shady, sun-protected spot to rest in on your adventures. Each side can move independently so you can adjust it according to where the sun is in the sky.',
    price: '$10/day',
    image: '/gear/cc.jpg',
    moreImages: ['/gear/cc.jpg','/gear/cc1.jpg','/gear/cc2.jpg'],
    newArrival: true,
  },
  {
    id: 4,
    name: 'OZtrail Velour Air Mattress Queen Bed',
    description: 'With a nice fat air mat like this Queen-sized mattress from OZtrail....',
    fullDescription: 'With a nice fat air mat like this Queen-sized mattress from OZtrail means you dont have to rough out the night when you’re out camping or when an unexpected visitor stays the night. It features air support coil construction for excellent comfort, a dual-lock push valve for easy inflation and deflation and a velour top that is luxurious to the touch. Comes with a handy storage bag and a repair kit should the worst happe.',
    price: '$10/day',
    image: '/gear/bed.jpg',
    moreImages: ['/gear/bed.jpg','/gear/b1.jpg'],
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

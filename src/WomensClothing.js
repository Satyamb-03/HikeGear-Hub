import React, { useState } from 'react';
import './Clothing.css';

const womensClothingItems = [
  {
    id: 1,
    name: "The North Face Women's ThermoBall Eco 2.0 Vest",
    description: "The ThermoBall Eco Vest is lightweight and provides warmth...",
    fullDescription: "The ThermoBall Eco Vest is lightweight and provides warmth in wet conditions. It's made from 100% recycled fabric and insulation, keeping you comfortable while reducing your environmental footprint. Perfect for layering, it has a slim fit and stows into its own hand pocket for easy packing.",
    price: '$5/day',
    image: 'TNF Thermoball.jpg',
    moreImages: ['TNF Thermoball 1.jpg'],
    newArrival: true,
  },
  {
    id: 2,
    name: 'Outdoor Research Women\'s Echo LS Tee',
    description:'The Echo LS Tee has excellent stretch, a durable and soft...',
    fullDescription: 'The Echo LS Tee has excellent stretch, a durable and soft hand feel for comfort and longevity and an eco-friendly mesh fabric featuring AirVent™ moisture management to keep you dry. Other features include odour control technology and a UPF 15/20 sun protection rating a for extra protection. Designed to tackle adventures in hot conditions.',
    price: '$4/day',
    image: 'OR Echotee.jpg',
    moreImages:['OR Echotee 1.jpg'],
  },
  {
    id: 3,
    name: "Patagonia Women's Capilene Cool Trail Shirt",
    description: "The Capilene Cool Trail Shirt is lightweight and moisture-wicking...",
    fullDescription: "The Capilene Cool Trail Shirt is lightweight and moisture-wicking, perfect for high-output activities. It features HeiQ® Fresh durable odor control and a comfortable fit that moves with you. Made from 50-100% recycled polyester, it's also Fair Trade Certified™ sewn.",
    price: '$3/day',
    image: 'Patagonia_Capilene.jpg',
    moreImages: ['Patagonia_Capilene1.jpg'],
  },
  {
    id: 4,
    name: "Outdoor Research Women's Ferrosi Pants",
    description: "The Ferrosi Pants are durable, stretchy, and breathable...",
    fullDescription: "The Ferrosi Pants are durable, stretchy, and breathable, offering excellent performance on the trail. With wind and water resistance, they provide protection in variable conditions. The fabric is also lightweight and quick-drying, making these pants ideal for hiking and climbing.",
    price: '$6/day',
    image: 'OR_Ferrosi.jpg',
    moreImages: ['OR_Ferrosi1.jpg', 'OR_Ferrosi2.jpg'],
  },
  {
    id: 5,
    name: 'Rab Women\'s Microlight Alpine Down Jacket',
    description: 'The Microlight Alpine Jacket offers warmth in a lightweight package...',
    fullDescription: 'The Microlight Alpine Jacket offers warmth in a lightweight package, featuring ethically sourced down insulation and Pertex® Quantum fabric for windproof and water-resistant performance. Ideal for fast-paced outdoor activities.',
    price: '$10/day',
    image: 'Rab_Microlight_Alpine.jpg',
    moreImages: ['Rab_Microlight_Alpine_1.jpg', 'Rab_Microlight_Alpine_2.jpg'],
  }
];

function WomensClothing() {
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
    <div className="Clothing">
      <h2>Women's Clothing</h2>
      <p>Discover our selection of women's outdoor clothing, designed for comfort and performance.</p>

      <div className="clothing-list">
        {womensClothingItems.map((item) => (
          <div key={item.id} className={`clothing-item ${item.newArrival ? 'new-arrival' : ''}`}>
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
              {selectedItem.moreImages.map((image, index) => (
                <img key={index} src={image} alt={`${selectedItem.name} - ${index + 1}`} />
              ))}
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

export default WomensClothing;

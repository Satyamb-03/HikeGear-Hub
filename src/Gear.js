
import React, { useState } from 'react';
import './Gear.css';


const gearitems = [
  {
    id: 1,
    name: 'Camping Chair',
    description: 'A lightweight, durable chair with a padded seat, cup holders, and storage pocket, perfect for outdoor relaxation.',
    price: '$80/day',
    image: 'campFurniture.jpeg',
  },
  {
    id: 2,
    name: 'Camp Kitchen',
    description: 'A compact, portable setup featuring essential cooking equipment and storage for outdoor meal preparation.',
    price: '$90/day',
    image: 'Kitchen.jpg',
  },
  {
    id: 3,
    name: 'Tent',
    description: 'Spacious and weather-resistant tents designed for a comfortable and secure camping experience, with easy setup and excellent ventilation',
    price: '$75/day',
    image: 'tent.jpeg',
  },
];

function Gear() {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (item) => {
    setCartItems([...cartItems, item]);
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="Gear">
      <h2>Gear</h2>
      <p>Get top-notch hiking gear, from tents to backpacks.</p>
     
      <div className="gear-list">
        {gearitems.map((item) => (
          <div key={item.id} className="gear-item">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p className="price">{item.price}</p>
            <button 
              className="add-to-cart-btn" 
              onClick={() => handleAddToCart(item)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gear;


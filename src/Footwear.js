import React from 'react';
import './footwear.css';

const footwearItems = [
  {
    id: 1,
    name: 'Mountain Hiker Boots',
    description: 'Durable boots with excellent grip for rocky terrain.',
    price: '$80/day',
    image: 'MountainHikerShoe.jpg',
  },
  {
    id: 2,
    name: 'Trail Running Shoes',
    description: 'Lightweight shoes for faster trails and comfort.',
    price: '$50/day',
    image: 'TrailRunningShoe.jpeg',
  },
  {
    id: 3,
    name: 'Waterproof Hiking Boots',
    description: 'Perfect for wet conditions with full waterproof protection.',
    price: '$75/day',
    image: 'WaterProof.jpeg',
  },
];

function Footwear() {
  const handleAddToCart = (item) => {
    // Logic to handle adding the item to the cart can go here
    console.log(`${item.name} added to cart!`);
  };
  
  return (
    <div className="Footwear">
      <h2>Footwear</h2>
      <p>Find the best hiking boots and shoes for your next adventure.</p>

      <div className="footwear-list">
        {footwearItems.map((item) => (
          <div key={item.id} className="footwear-item">
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

export default Footwear;

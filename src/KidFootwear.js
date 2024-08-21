import React from 'react';
import './footwear.css';

const footwearItems = [
  
  {
    id: 1,
    name: 'Keen Junior Kanyon Sport Sandal',
    description:'A smaller version of the Men Kanyon, this sandal is ideal for your younger...',
    fullDescription: 'A smaller version of the Men Kanyon, this sandal is ideal for your younger counterparts for around town, park and trails and, because they are in all black, can be worn in most New Zealand schools.',
    price: '$15/day',
    image: '/footwear/kidshoe.jpg',
    moreImages:['/footwear/kidshoe.jpg','/footwear/6.1.jpg','/footwear/6.2.jpg'],
    newArrival: true,
   
  },
  {
    id: 2,
  name: 'Hi-Tec Kids Altitude VI Lite WP Hiking Boots',
  description:'Perfect for adventurous kids, these waterproof synthetic...',
  fullDescription: 'Perfect for adventurous kids, these waterproof synthetic boots are comfortable and supportive with a volume adjuster insole for growing feet.',
  price: '$25/day',
  image: '/footwear/k2.jpg',
  moreImages:['/footwear/k2.jpg','/footwear/k2.1.jpg','/footwear/k2.2.jpg']
  },
  {
    id: 3,
  name: 'Targhee IV Low Waterproof Hiking Shoes',
  description:'Updated to fit better, last longer and go farther than before....',
  fullDescription: 'Updated to fit better, last longer and go farther than before, the KEEN Targhee IV Low Waterproof hiking shoes for little kids offer the comfort, protection and durability that young explorers need.',
  price: '$25/day',
  image: '/footwear/k3.jpeg',
  moreImages:['/footwear/k3.jpeg','/footwear/k3.1.jpeg','/footwear/k3.2.jpeg']
  },
 
];

function KidFootwear() {
  const handleAddToCart = (item) => {
    // Logic to handle adding the item to the cart can go here
    console.log(`${item.name} added to cart!`);
  };
  
  return (
    <div className="Footwear">
      <h2>Women's Footwear</h2>
      <p>Find the best hiking boots and shoes for your next adventure.</p>

      <div className="footwear-list">
        {footwearItems.map((item) => (
          <div key={item.id} className={`footwear-item ${item.newArrival ? 'new-arrival' : ''}`}>
            {item.newArrival && <span className="new-badge">New Arrival</span>}
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

export default KidFootwear;

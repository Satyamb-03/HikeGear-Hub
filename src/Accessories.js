import React from 'react';
import './Accessories.css'; 

const accessoriesItems = [
  {
    id: 1,
    name: 'Sun Hat',
    description: 'Wide-brimmed hat to protect you from the sun.',
    price: '$5/day',
    image: 'Sunhat.jpg.jpg',
  },
  {
    id: 2,
    name: 'Thermal Gloves',
    description: 'Warm gloves for cold weather conditions.',
    price: '$10/day',
    image: 'thermalGloves.jpg',
  },
  {
    id: 3,
    name: 'Gaiters',
    description: 'Protective gaiters to keep debris out of your boots.',
    price: '$7/day',
    image: 'Gaiters.jpg',
  },
  {
    id: 4,
    name: 'Helmet',
    description: 'Keeps your drinks cold for hours.',
    price: '$8/day',
    image: 'Helmet.jpg',
    newArrival: true,
  },
  {
    id: 5,
    name: 'Hiking Socks',
    description: 'Comfortable and breathable socks for long hikes.',
    price: '$3/day',
    image: 'Socks.jpg',
    newArrival: true,
  },
  {
    id: 6,
    name: 'Headlamp',
    description: 'Ditac H1 Rechargeable LED Headlamp 440lm',
    price: '$12/day',
    image: 'Headlamp.jpg',
    newArrival: true,
  },
];

function Accessories() {
  const handleAddToCart = (item) => {
    console.log(`${item.name} added to cart!`);
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
            <h3>{item.name}</h3>
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
    </div>
  );
}

export default Accessories;

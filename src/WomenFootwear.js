import React from 'react';
import './footwear.css';

const footwearItems = [
  
  {
    id: 1,
    name: 'SCARPA Womens Moraine Mid GTX',
    description: 'The 4-Quattro XT is a light, stiff hybrid ski boot featuring...',
    fullDescription: 'The 4-Quattro XT is a light, stiff hybrid ski boot featuring a GripWalk sole and compatible with GripWalk bindings for both downhill skiing and touring. It features a plant-based Grilamid® shell and cuff to maintain performance with a reduction in CO2 emissions during production, four buckles and a Booster strap for reliable, progressive flex in any conditions comfortable and thermoformable Intuition Foam liners for a custom fit and warmth. It works with a wide range of ski setups, letting you choose your adventure for the day without needing to swap boots.',
    price: '$40/day',
    image: '/footwear/scarpa.jpg',
    moreImages: ['/footwear/scarpa.jpg','/footwear/1.1.jpg','/footwear/1.2.jpg'],
  },
  {
    id: 2,
    name: 'SCARPA Women Rush Trek GTX',
    description:'The Rush Trek GTX balances the light weight and agility of a trail... ',
    fullDescription: 'The Rush Trek GTX balances the light weight and agility of a trail running shoe with the support and protection of a hiking boot to ensure long-lasting support and protection on your outdoor adventures. Features include suede uppers, a waterproof/breathable GORE-TEX® lining, progressive impact absorption and excellent traction, including on downhill and uphill terrain.',
    price: '$45/day',
    image: '/footwear/women.jpg',
    moreImages:['/footwear/women.jpg','/footwear/w1.1.jpg','/footwear/w1.2.jpg'],
    newArrival: true,
  },
  {
    id: 3,
    name: 'Altra Women Lone Peak 8 Trail Running Shoe',
    description:'The women specific Lone Peak 8 is Altra newest version of their best...',
    fullDescription: 'The women specific Lone Peak 8 is Altra newest version of their best-selling trail shoe. It has a more refined, more durable seamless upper, fewer overlays for a streamlined, clean look and StoneGuard™ rock plates for extra protection underfoot. Version 8 retains its responsive and comfortable Altra EGO™ midsole with a 0mm heel-to-toe drop, reliable MaxTrac™ sole for a sticky grip and the original FootShape™ fit that allows your feet to move naturally.',
    price: '$15/day',
    image: '/footwear/w2.jpg',
    moreImages:['/footwear/w2.jpg','/footwear/w2.1.jpg','/footwear/w2.2.jpg'],
    newArrival: true,
  },
  {
  id: 4,
  name: 'Teva Women Tirra Sandal',
  description:'Tackle your summer adventure in style and comfort with the women-specific,...',
  fullDescription: 'Tackle your summer adventure in style and comfort with the women-specific, multi-purpose Tirra Sandal. Adjustable straps enable a custom fit while the Spider Rubber outsole is grippy, especially on wet surfaces, and the EVA midsole, shank and Shoc Pad in the heel give you a stable, secure and comfy ride.',
  price: '$25/day',
  image: '/footwear/sandal.jpg',
  moreImages:['/footwear/sandal.jpg','/footwear/5.1.jpg','/footwear/5.2.jpg']
  }
];

function WomenFootwear() {
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

export default WomenFootwear;

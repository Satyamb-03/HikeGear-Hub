import React from 'react';
import './footwear.css';

const footwearItems = [
  
  {
    id:1,
    name: 'SCARPA Mens Ribelle Run',
    description:'The Ribelle Run is a highly-durable and technically precise trail...',
    fullDescription: 'The Ribelle Run is a highly-durable and technically precise trail running shoe ideal for short to medium distance running and racing in rugged, rocky terrain.',
    price: '$35/day',
    image: '/footwear/scarpaMen.jpg',
    moreImages:['/footwear/scarpaMen.jpg','/footwear/4.1.jpg','/footwear/4.2.jpg']
  },
  {
    id: 2,
    name: 'Keen Men Targhee IV Mid Waterproof Hiking Boot',
    description:'The fourth-generation Targhee Waterproof Mid is the most durable...',
    fullDescription: 'The fourth-generation Targhee Waterproof Mid is the most durable yet with its glue-free fused construction that will not delaminate and plush LuftCore technology cushioning that resists compression.',
    price: '$25/day',
    image: '/footwear/waterproofshoe.jpg',
    moreImages:['/footwear/waterproofshoe.jpg','/footwear/3.1.jpg','/footwear/3.2.jpg'],
    newArrival: true,
  },
  {
  id:3,
  name: 'Anatom Q2 Trail Wide-Fit Light Hiking Boots',
  description:'The versatile Q2 Trail Wide-Fit Hiking Boot is a true high-quality...',
  fullDescription: 'The versatile Q2 Trail Wide-Fit Hiking Boot is a true high-quality, all-rounder and made for adventures from hiking, trekking and backpacking to travelling, lifestyle and casual wear. It is made with a waterproof Nubuck leather that combines with a waterproof, breathable membrane system and a Memory-fit insole to keep your feet comfy and a chunkier Vibram® Campos outsole with more cushioning for excellent traction, durability, responsiveness, stability and shock absorption over unpredictable terrain. This boot has a spacious forefoot and a snug heel fit for all-day comfort and stability.',
  price: '$35/day',
  image: '/footwear/anatom.jpg',
  moreImages:['/footwear/anatom.jpg','/footwear/an1.jpg']
  },
  {
    id:4,
    name: 'Moc Clearance',
    description:'The Hydro Moc is a water-friendly slip-on sandal that is ideal ...',
    fullDescription: 'The Hydro Moc is a water-friendly slip-on sandal that is ideal for your adventures in and around water. It features advanced construction techniques, a rear sling to lock in your heel, arch support and BLOOM® performance foam made of 10% algae biomass and FloatPro Foam™ for lightweight comfort. The Hydro Moc also floats!',
    price: '$35/day',
    image: '/footwear/moc.jpg',
    moreImages:['/footwear/moc.jpg','/footwear/moc1.jpg'],
    newArrival: true,

    }
];

function MenFootwear() {
  const handleAddToCart = (item) => {
    // Logic to handle adding the item to the cart can go here
    console.log(`${item.name} added to cart!`);
  };
  
  return (
    <div className="Footwear">
      <h2>Men's Footwear</h2>
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

export default MenFootwear;

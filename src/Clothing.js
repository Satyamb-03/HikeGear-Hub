import React, { useState } from 'react';
import './Clothing.css'; 

const clothingItems = [
  {
    id: 1,
    name: "Outdoor Research Men's Echo Quarter Zip",
    description: 'The Echo Quarter Zip is stretchy, durable and has a soft hand feel...',
    fullDescription: 'The Echo Quarter Zip is stretchy, durable and has a soft hand feel for increased comfort and longevity and features eco-friendly mesh fabric with AirVent™ moisture management to keep you dry. Other features include a quarter zip for extra protection or ventilation when you need it, odour control technology, a UPF 15/20 sun protection rating and thumb loops to anchor sleeves for extra protection and easy layering. Designed to tackle adventures in hot conditions.',
    price: '$3/day',
    image: 'Clothing/OR quaterzip.jpg',
    moreImages: ['Clothing/OR quaterzip 1.jpg'], 
    newArrival: true,
  },
  {
    id: 2,
    name: 'Outdoor Research Women\'s Echo LS Tee',
    description:'The Echo LS Tee has excellent stretch, a durable and soft...',
    fullDescription: 'The Echo LS Tee has excellent stretch, a durable and soft hand feel for comfort and longevity and an eco-friendly mesh fabric featuring AirVent™ moisture management to keep you dry. Other features include odour control technology and a UPF 15/20 sun protection rating a for extra protection. Designed to tackle adventures in hot conditions.',
    price: '$4/day',
    image: 'Clothing/OR Echotee.jpg',
    moreImages:['Clothing/OR Echotee 1.jpg'],
  },
  {
    id: 3,
    name: '360 Degrees Kid\'s Stratus Pants',
    description: 'The Kid\'s Stratus Pants are waterproof, breathable unisex over...',
    fullDescription: 'The Kid\'s Stratus Pants are waterproof, breathable unisex over pants as at home on the trail as on a bike ride to school. They are made from a lightweight, breathable 2.5 layer fabric that features a polyurethane coating and a DWR treatment and is seam sealed so no water gets in while sweat is wicked through to keep them dry and comfortable. Other features include articulation in the knees for easy movement, an elastic waist with a drawcord for a custom fit and zipped cuffs for easy on/off over footwear.',
    price: '$8/day',
    image: 'Clothing/360pants.jpg',
    moreImages:['Clothing/360pants 1.jpg'],
  },
  {
    id: 4,
    name: 'Patagonia Men\'s RPS Rock Pants',
    description:'The rock-paper-scissors RPS Rock Pants have you covered and keep you...',
    fullDescription: 'The rock-paper-scissors RPS Rock Pants have you covered and keep you moving fast on multipitch rock climbs with their stretchy, 96% postconsumer-recycled nylon fabric (sourced from recycled fishing nets to reduce ocean plastic pollution) and articulated patterning. Other features include a durable-water-repellent finish without perfluorinated chemicals, shock-cord cuffs, harness-compatible pockets and an adjustable waist. Fair Trade Certified™ sewn.',
    price: '$10/day',
    image: 'Clothing/Patagonia RPS.jpg',
    moreImages: ['Clothing/Patagonia RPS 1.jpg','Clothing/Patagonia RPS 2.jpg'],
  },
  {
    id: 5,
    name: 'The North Face Women\'s ThermoBall Eco 2.0 Hoodie',
    description:'The ThermoBall Eco Hoodie is designed for warmth, durability...',
    fullDescription: 'The ThermoBall Eco Hoodie is designed for warmth, durability and packability and is made with 100% recycled materials for a lesser environmental impact. It has a baffle pattern that minimises cold spots and ThermoBall™ Eco insulation, which retains loft and traps warmth even when wet. Other features include a hood, hand pockets for extra warmth and protection and can be stowed it into its own chest pocket for compact packing.',
    price: '$7/day',
    image: 'Clothing/TNF Thermoball.jpg',
    moreImages: ['Clothing/TNF Thermoball 1.jpg'],
  },
  {
    id: 6,
    name: 'Icebreaker Kid\'s 200 Oasis Leggings',
    description:'These 200 Oasis Leggings are a versatile lightweight base...',
    fullDescription: 'These 200 Oasis Leggings are a versatile lightweight base layer legging with all the benefits of pure Merino wool to keep kids warm on their adventures in cool conditions. They also feature sport a slim fit for easy layering, a comfortable brushed elastic waistband and a gusset for comfort and freedom of movement.',
    price: '$6/day',
    image: 'Clothing/Icebreaker Oasis.jpg',
    moreImages: ['Clothing/Icebreaker Oasis 1.jpg'],
    newArrival: true,
  },
];


function Clothing() {
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
      <h2>Clothing</h2>
      <p>Explore our wide range of outdoor clothing suitable for all weather conditions.</p>

      <div className="clothing-list">
        {clothingItems.map((item) => (
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

export default Clothing;
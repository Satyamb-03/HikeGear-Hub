import React, { useState } from 'react';
import './Clothing.css'; // You can reuse the same CSS for subcategories

const mensClothingItems = [
  {
    id: 1,
    name: "Outdoor Research Men's Echo Quarter Zip",
    description: 'The Echo Quarter Zip is stretchy, durable and has a soft hand feel...',
    fullDescription: 'The Echo Quarter Zip is stretchy, durable and has a soft hand feel for increased comfort and longevity and features eco-friendly mesh fabric with AirVent™ moisture management to keep you dry. Other features include a quarter zip for extra protection or ventilation when you need it, odour control technology, a UPF 15/20 sun protection rating and thumb loops to anchor sleeves for extra protection and easy layering. Designed to tackle adventures in hot conditions.',
    price: '$3/day',
    image: 'OR quaterzip.jpg',
    moreImages: ['OR quaterzip 1.jpg'], 
    newArrival: true,
  },
  {
    id: 2,
    name: 'Patagonia Men\'s RPS Rock Pants',
    description:'The rock-paper-scissors RPS Rock Pants have you covered and keep you...',
    fullDescription: 'The rock-paper-scissors RPS Rock Pants have you covered and keep you moving fast on multipitch rock climbs with their stretchy, 96% postconsumer-recycled nylon fabric (sourced from recycled fishing nets to reduce ocean plastic pollution) and articulated patterning. Other features include a durable-water-repellent finish without perfluorinated chemicals, shock-cord cuffs, harness-compatible pockets and an adjustable waist. Fair Trade Certified™ sewn.',
    price: '$10/day',
    image: 'Patagonia RPS.jpg',
    moreImages: ['Patagonia RPS 1.jpg','Clothing/Patagonia RPS 2.jpg'],
  },
  {
    id: 3,
    name: 'Columbia Men\'s Silver Ridge Lite Long Sleeve Shirt',
    description: 'The Silver Ridge Lite Shirt offers ultimate comfort in the heat...',
    fullDescription: 'The Silver Ridge Lite Shirt offers ultimate comfort in the heat with UPF 40 sun protection, moisture-wicking technology, and a vented design for breathability. Made with lightweight and quick-drying fabric, it’s perfect for any outdoor activity.',
    price: '$5/day',
    image: 'Columbia_Shirt.jpg',
    moreImages: ['Columbia_Shirt_1.jpg', 'Columbia_Shirt_2.jpg'],
  },
  {
    id: 4,
    name: 'Arc\'teryx Men\'s Gamma LT Hoody',
    description: 'The Gamma LT Hoody is a lightweight, versatile softshell jacket...',
    fullDescription: 'The Gamma LT Hoody is a lightweight, versatile softshell jacket designed for a range of activities. It offers excellent wind and weather resistance, with a comfortable fit that allows for ease of movement. Perfect for climbing, hiking, and other adventures.',
    price: '$12/day',
    image: 'Arcteryx_Gamma_Hoody.jpg',
    moreImages: ['Arcteryx_Gamma_Hoody_1.jpg', 'Arcteryx_Gamma_Hoody_2.jpg'],
  },
  {
    id: 5,
    name: 'Marmot Men\'s PreCip Eco Jacket',
    description: 'The PreCip Eco Jacket is a sustainable choice for rainwear...',
    fullDescription: 'The PreCip Eco Jacket is a sustainable choice for rainwear, featuring Marmot’s NanoPro™ waterproof and breathable technology. It is made from 100% recycled nylon fabric, offering durability and a lighter environmental impact.',
    price: '$9/day',
    image: 'Marmot_Precip_Jacket.jpg',
    moreImages: ['Marmot_Precip_Jacket_1.jpg'],
  },
  {
    id: 6,
    name: 'The North Face Men\'s Venture 2 Jacket',
    description: 'The Venture 2 Jacket is a lightweight, waterproof shell...',
    fullDescription: 'The Venture 2 Jacket is a lightweight, waterproof shell that is perfect for year-round adventures. Made with DryVent™ fabric, it ensures you stay dry and comfortable, with an adjustable hood, pit-zip venting, and a durable water-repellent finish.',
    price: '$8/day',
    image: 'TNF_Venture_Jacket.jpg',
    moreImages: ['TNF_Venture_Jacket_1.jpg'],
  }
];

function MensClothing() {
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
      <h2>Men's Clothing</h2>
      <p>Explore our range of men's outdoor clothing suitable for all weather conditions.</p>

      <div className="clothing-list">
        {mensClothingItems.map((item) => (
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

export default MensClothing;

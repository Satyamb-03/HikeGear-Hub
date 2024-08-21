import React, { useState } from 'react';
import './footwear.css'; // Ensure this file exists and is correctly referenced

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
    name: 'SCARPA Womens 4-Quattro XT Hybrid Ski Boot',
    fullDescription: 'The 4-Quattro XT is a light, stiff hybrid ski boot featuring a GripWalk sole and compatible with GripWalk bindings for both downhill skiing and touring.',
    description: 'The 4-Quattro XT is a light, stiff hybrid ski boot featuring ...',   
    price: '$70/day',
    image: '/footwear/sca_w_quatrro.jpg',
    moreImages: ['/footwear/sca_w_quatrro.jpg','/footwear/2.1.jpg','/footwear/2.2.jpg'],
    newArrival: true,
  },
  {
    id: 4,
    name: 'SCARPA Mens Ribelle Run',
    description:'The Ribelle Run is a highly-durable and technically precise trail...',
    fullDescription: 'The Ribelle Run is a highly-durable and technically precise trail running shoe ideal for short to medium distance running and racing in rugged, rocky terrain.',
    price: '$35/day',
    image: '/footwear/scarpaMen.jpg',
    moreImages:['/footwear/scarpaMen.jpg','/footwear/4.1.jpg','/footwear/4.2.jpg']
  },
  {
    id: 3,
    name: 'Keen Men Targhee IV Mid Waterproof Hiking Boot',
    description:'The fourth-generation Targhee Waterproof Mid is the most durable...',
    fullDescription: 'The fourth-generation Targhee Waterproof Mid is the most durable yet with its glue-free fused construction that will not delaminate and plush LuftCore technology cushioning that resists compression.',
    price: '$25/day',
    image: '/footwear/waterproofshoe.jpg',
    moreImages:['/footwear/waterproofshoe.jpg','/footwear/3.1.jpg','/footwear/3.2.jpg'],
    newArrival: true,
  },
  {
    id: 5,
    name: 'Teva Women Tirra Sandal',
    description:'Tackle your summer adventure in style and comfort with the women-specific,...',
    fullDescription: 'Tackle your summer adventure in style and comfort with the women-specific, multi-purpose Tirra Sandal. Adjustable straps enable a custom fit while the Spider Rubber outsole is grippy, especially on wet surfaces, and the EVA midsole, shank and Shoc Pad in the heel give you a stable, secure and comfy ride.',
    price: '$25/day',
    image: '/footwear/sandal.jpg',
    moreImages:['/footwear/sandal.jpg','/footwear/5.1.jpg','/footwear/5.2.jpg']

  },
  {
    id: 6,
    name: 'Keen Junior Kanyon Sport Sandal',
    description:'A smaller version of the Men Kanyon, this sandal is ideal for your younger...',
    fullDescription: 'A smaller version of the Men Kanyon, this sandal is ideal for your younger counterparts for around town, park and trails and, because they are in all black, can be worn in most New Zealand schools.',
    price: '$15/day',
    image: '/footwear/kidshoe.jpg',
    moreImages:['/footwear/kidshoe.jpg','/footwear/6.1.jpg','/footwear/6.2.jpg'],
    newArrival: true,
  },
];

function Footwear() {
  const [selectedItem, setSelectedItem] = useState(null); // Ensure useState is imported

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
    <div className="Footwear">
      <h2>Footwear</h2>
      <p>Find the best hiking boots and shoes for your next adventure.</p>

      <div className="footwear-list">
        {footwearItems.map((item) => (
          <div 
            key={item.id} 
            className={`footwear-item ${item.newArrival ? 'new-arrival' : ''}`} 
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
            <p>{selectedItem.fullDescription || selectedItem.description}</p> {/* Fallback to description if fullDescription is empty */}
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

export default Footwear;

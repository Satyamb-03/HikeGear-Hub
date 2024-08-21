import React, { useState } from 'react';
import './Gear.css';

const gearItems = [
  {
    id: 1,
    name: 'Rumpl The Stuffable Pillowcase',
    description: 'Add a jacket, hoodie or some other clothing items into The Stuffable Pillowcase and you have a choose....',
    fullDescription: 'Add a jacket, hoodie or some other clothing items into The Stuffable Pillowcase and you have a choose-your-own comfort instant pillow. Made from 100% post-consumer recycled polar fleece (top) and ripstop polyester (bottom). When it is time to pack up, just take out what you used for stuffing and stow it into the attached stuff sack for compact storage.',
    price: '$10/day',
    image: '/gear/ss2.jpg',
    moreImages: ['/gear/ss2.jpg','/gear/ss3.jpg'],
    newArrival: true,
  },
  {
    id: 1,
    name: 'Sea to Summit Breeze Sleeping Bag Liner',
    description: 'The Breeze Sleeping Bag Liners provide versatility to suit a range of climates and conditions....',
    fullDescription: 'The Breeze Sleeping Bag Liners provide versatility to suit a range of climates and conditions. They are made with a knitted, blended COOLMAX® EcoMade/TENCEL™ Lyocell fabric that provides incredible stretch and freedom of movement, feels soft against your skin and wicks moisture to keep you comfortable while you sleep. The Mummy version stretches to fit any sleeping bag shape and has shoulder and foot drawcords that integrate with Free Flow Zip system Sea to Summit bags. The Rectangular version has a built-in pillow sleeve and is ideal for travellers.',
    price: '$10/day',
    image: '/gear/slBg.jpg',
    moreImages: ['/gear/slBg.jpg','/gear/s1.jpg','/gear/s2.jpg'],
    newArrival: true,
  },
  {
  id: 2,
  name: 'Sea to Summit Women Ascent -1 Down Sleeping Bag',
  description: 'The Women Ascent -1 Down Sleeping Bag is a female-specific...',
  fullDescription: 'The Women Ascent -1 Down Sleeping Bag is a female-specific, versatile bag designed for comfort and adaptability and suited to a wide range of adventures. It features ULTRA-DRY 750+ loft goose down, 20D recycled polyester shell and lining, a non-PFC durable water repellent finish and a triple-zip Free Flow Zip System that allows for multiple configurations and ventilation, including opening the bag right out. Comes with a compression sack and a storage cell.',
  price: '$10/day',
  image: '/gear/ss1.jpg',
  moreImages: ['/gear/ss1.jpg','/gear/ss1.1.jpg','/gear/ss1.2.jpg'],
  newArrival: true,
  },
  {
    id: 3,
    name: 'Exped ULTRA Duo 3R Sleeping Mats',
    description: 'The ULTRA 3R Duo Sleeping Mats are lightweight, packable mats for two with light...',
    fullDescription: 'The ULTRA 3R Duo Sleeping Mats are lightweight, packable mats for two with light insulation for human-powered adventures from spring through to autumn. Features include two independent sides to customise the mat for each sleeper, a tapered shape to shave weight and bulk, a recycled 20D ripstop face fabric, 60gm/2 Texpedloft microfibre insulation and 7cm-thick chambers with fatter chambers at the sides to reduce the chance of you rolling off. Certified carbon neutral by myclimate™.',
    price: '$10/day',
    image: '/gear/m.jpg',
    moreImages: ['/gear/m2.jpg','/gear/m.jpg','/gear/m3.jpg'],
    newArrival: true,
  },
  {
    id: 4,
    name: 'Rumpl Original Puffy Blanket Printed',
    description: 'The Original Puffy Blanket is a washable, insulated blanket for all sorts....',
    fullDescription: 'The Original Puffy Blanket is a washable, insulated blanket for all sorts of adventures, from home to camp to the park or beach. This version has fun prints too! It is made with 100% post-consumer recycled materials that are also used in sleeping bags and jackets, reusing about 60 plastic bottles per blanket, and has a durable water repellent finish for weather resistance. You also have ability to wear this blanket as a cape for hand-free use with its handy cape clip and loops on the corners allow you to stake it to the ground if you wish.',
    price: '$10/day',
    image: '/gear/bl.jpg',
    moreImages: ['/gear/bl.jpg','/gear/bl1.jpg','/gear/bl2.jpg'],
    newArrival: true,
  },
 
];

function Gear() {
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
    <div className="Gear">
      <h2>Gear</h2>
      <p>Get top-notch hiking gear, from tents to backpacks.</p>

      <div className="gear-list">
        {gearItems.map((item) => (
          <div 
            key={item.id} 
            className={`gear-item ${item.newArrival ? 'new-arrival' : ''}`}
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
            <p>{selectedItem.fullDescription || selectedItem.description}</p>
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

export default Gear;

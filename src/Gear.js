import React, { useState } from 'react';
import './Gear.css';

const gearItems = [
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
    name: 'Osprey Tempest Velocity 20 Multisport Pack',
    description: 'The women-specific Tempest Velocity 20 combines the multi-sport features of the Talon family....',
    fullDescription: 'The women-specific Tempest Velocity 20 combines the multi-sport features of the Talon family with a soft-flask compatible, running-inspired harness and flexible back panel for added efficiency and versatility on your light-and-fast adventures, whether you are setting new personal bests, bagging peaks or linking quick laps on the snow. Other features include an adjustable torso for a custom fit, harness and hip belt pockets, a shove-it pocket that can stow a helmet, Stow-on-the-Go™ pole attachment and ice tool attachments.',
    price: '$20/day',
    image: '/gear/bag.jpg',
    moreImages: ['/gear/bag.jpg','/gear/bg1.jpg','/gear/bg2.jpg'],
  },
  {
    id: 3,
    name: 'The North Face VE 25 Tent',
    description: 'The VE 25 is a three-person expedition tent designed for extreme durability',
    fullDescription: 'The VE 25 is a three-person expedition tent designed for extreme durability and protection against the sort of intense weather you can experience on alpine adventures. DAC poles and stakes, welded reinforcements on the fly plus high-strength guylines with equalisers keep the tent grounded in snow and strong winds and a port window lets you check out the conditions before opening doors. Other features include high-low venting to minimise condensation, dual doors into the front vestibule and plenty of pockets and hanging loops for your gear.',
    price: '$10/day',
    image: '/gear/tent1.jpg',
    moreImages: [,'/gear/tent1.jpg','/gear/t1.jpg','/gear/t2.jpg'],
  },
  {
    id: 4,
    name: 'Sea to Summit Detour Stainless Steel Collapsible Pouring Pot',
    description: 'The 1.8-litre Detour Stainless Steel Collapsible Pouring Pot allows you to cook... ',
    fullDescription: 'The 1.8-litre Detour Stainless Steel Collapsible Pouring Pot allows you to cook as if you are in your home kitchen. It features induction-compatible stainless steel, a three-layer base for even heat transfer, collapsible EU food-grade silicone rubber side walls for space-efficient storage and an integrated spout. The Click-Safe removable handle doubles to keep the lid and other items secure in transit and a LidKeep on the lid so you have somewhere to stow the lid while adding ingredients or stirring. Nests with other Detour collapsible dinnerware.',
    price: '$15/day',
    image: '/gear/pot.jpg',
    moreImages: ['/gear/pot.jpg','/gear/p1.jpg','/gear/p2.jpg'],
    newArrival: true,
  },
  {
    id: 5,
    name: 'Coleman Folding Card Table',
    description: 'If you are looking for a lightweight, portable table for your campsite or an extra...',
    fullDescription: 'If you are looking for a lightweight, portable table for your campsite or an extra table for your card games at home, this Folding Card Table is just the thing. It has a steel frame, a vacuum-moulded top, a safety lock so it wont collapse on you and is rated to carry weight up to 180kg.',
    price: '$80/day',
    image: '/gear/table.jpg',
    moreImages: ['/gear/table.jpg'],
  },
  {
    id: 6,
    name: 'Exped ULTRA Duo 3R Sleeping Mats',
    description: 'The ULTRA 3R Duo Sleeping Mats are lightweight, packable mats for two with light...',
    fullDescription: 'The ULTRA 3R Duo Sleeping Mats are lightweight, packable mats for two with light insulation for human-powered adventures from spring through to autumn. Features include two independent sides to customise the mat for each sleeper, a tapered shape to shave weight and bulk, a recycled 20D ripstop face fabric, 60gm/2 Texpedloft microfibre insulation and 7cm-thick chambers with fatter chambers at the sides to reduce the chance of you rolling off. Certified carbon neutral by myclimate™.',
    price: '$10/day',
    image: '/gear/m.jpg',
    moreImages: ['/gear/m2.jpg','/gear/m.jpg','/gear/m3.jpg'],
    newArrival: true,
  },
  {
    id: 7,
    name: 'Osprey Arcane Roll Top Daypack',
    description: 'The 22-litre Arcane Roll Top Daypack is built with clean lines and durable recycled fabric ...',
    fullDescription: 'The 22-litre Arcane Roll Top Daypack is built with clean lines and durable recycled fabric to create a pack that withstands the demands of daily use. It features a breathable harness and back panel for a comfortable carry, a roll-top opening and a self-locking security hook that allows you to wrap the harness around a pole, table leg or similar. Other features include a padded laptop sleeve and other internal organisation, a stretch-mesh shoulder strap pocket for handy access to small items and a low-profile, stretchy pocket to keep your water bottle to hand.',
    price: '$25/day',
    image: '/gear/pa2.jpg',
    moreImages: ['/gear/pa2.jpg','/gear/pa.2.2.jpg','/gear/pa.2.1.jpg'],
    newArrival: true,
  },
  {
    id: 8,
    name: 'Coleman Weathermaster Air XL 4-Person Tent',
    description: 'The generously sized, tunnel-shaped, inflatable Weathermaster Air XL 4-Person Tent...',
    fullDescription: 'The generously sized, tunnel-shaped, inflatable Weathermaster Air XL 4-Person Tent has a large living space, two sleeping rooms with BlackOut Bedroom® technology for a more restful sleep, an extended front porch and full head height throughout. FastPitch™ Air technology make it fast to pitch and can be handled by a single person, with a supplied Manometer displaying the optimum air pressure. The air poles, adjustable storm straps, fully taped and waterproofed fabrics keep you dry and safe inside during stormy conditions. For easy handling when packed, it comes with a sturdy wheeled storage bag.',
    price: '310/day',
    image: '/gear/t4.jpg',
    moreImages: ['/gear/t4.jpg','/gear/t4.1.jpg','/gear/t4.2.jpg'],
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

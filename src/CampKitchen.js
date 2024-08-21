import React, { useState } from 'react';
import './Gear.css';

const gearItems = [
  {
    id: 1,
    name: 'Trangia Storm Cooker 25-7 UL/HA',
    description: 'The ultralight aluminium Storm Cooker 25-1 UL is a stove ...',
    fullDescription: 'The ultralight aluminium Storm Cooker 25-1 UL is a stove and pan set with all the basics needed for outdoor cooking for groups of 2-4 people. Its two saucepans and frying pan are made with hard anodised aluminium for scratch resistance and easier cleaning while the pot grip and upper and lower windshields are ultralight aluminium. There is also an easy-to-light spirit burner with a simmer ring to control the flame during cooking and to extinguish the flame when you are finished. The set comes with a strap to keep everything together in your pack..',
    price: '$15/day',
    image: '/gear/',
    moreImages: ['/gear/','/gear/','/gear/'],
    newArrival: true,
  },
  {
    id: 2,
    name: 'Sea to Summit Watercell X',
    description: 'The durable, versatile Watercell X lets you store, transport and dispense.....',
    fullDescription: 'The durable, versatile Watercell X lets you store, transport and dispense water wherever your adventures take you. It has a 3D baffled, RF-welded TPU construction that is both compact and stackable, a wide mouth cap and integrated welded handle for easy filling, a multi-function cap for flow control as well as a handy shower head attachment. The adjustable strap and welded lash points allow for hanging, carrying and attaching pretty much anywhere.',
    price: '$10/day',
    image: '/gear/ck1.jpg',
    moreImages: ['/gear/ck1.jpg','/gear/ck1.1.jpg','/gear/ck.1.2.jpg'],
    newArrival: true,
  },
  {
    id: 3,
    name: 'Sea to Summit Frontier Ultralight Collapsible Pour Over',
    description: 'The functional, space-saving Frontier Ultralight Collapsible Pour Over...',
    fullDescription: 'The functional, space-saving Frontier Ultralight Collapsible Pour Over is designed for backcountry barristas and makes a great cup of coffee. It has a food-grade silicone frame with fine stainless-steel mesh to catch coffee grinds and filter the coffee oils for a satisfying cuppa, folds flat for easy packing and has a base that fits most mugs and wide-mouth bottle rims. It also fits inside the Frontier Collapsible Kettle to there is no wasted space in your kit.',
    price: '$5/day',
    image: '/gear/ck3.jpg',
    moreImages: ['/gear/ck3.jpg','/gear/ck3.1.jpg','/gear/ck3.2.jpg'],
    newArrival: true,
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

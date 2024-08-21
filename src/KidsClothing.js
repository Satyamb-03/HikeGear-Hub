import React, { useState } from 'react';
import './Clothing.css';

const kidsClothingItems = [
  {
    id: 1,
    name: "Columbia Kid's Rain-Zilla Jacket",
    description: "The Rain-Zilla Jacket is waterproof and wind-resistant...",
    fullDescription: "The Rain-Zilla Jacket is waterproof and wind-resistant, keeping your little one dry in wet weather. The adjustable hood provides extra protection, while the lightweight design ensures comfort during outdoor play. Perfect for rainy day adventures.",
    price: '$4/day',
    image: 'Columbia_RainZilla.jpg',
    moreImages: ['Columbia_RainZilla1.jpg'],
    newArrival: true,
  },
  {
    id: 2,
    name: "The North Face Kid's Glacier 1/4 Zip Fleece",
    description: "The Glacier Fleece is warm, lightweight, and super soft...",
    fullDescription: "The Glacier Fleece is warm, lightweight, and super soft, making it a favorite for kids. It features pill-resistant microfleece fabric and a quarter-zip for easy on and off. Ideal for layering during cooler weather, it's a versatile piece for any outdoor adventure.",
    price: '$3/day',
    image: 'TNF_GlacierFleece.jpg',
    moreImages: ['TNF_GlacierFleece1.jpg'],
  },
  {
    id: 3,
    name: "Patagonia Kid's Capilene Midweight Baselayer",
    description: "The Capilene Baselayer provides warmth and moisture-wicking...",
    fullDescription: "The Capilene Baselayer provides warmth and moisture-wicking performance for active kids. It features a smooth, brushed interior for comfort and flatlock seams to minimize chafing. Made from 50-100% recycled polyester, it's an eco-friendly choice for outdoor activities.",
    price: '$3/day',
    image: 'Patagonia_CapileneKids.jpg',
    moreImages: ['Patagonia_CapileneKids1.jpg'],
  },
  {
    id: 4,
    name: '360 Degrees Kid\'s Stratus Pants',
    description: 'The Kid\'s Stratus Pants are waterproof, breathable unisex over...',
    fullDescription: 'The Kid\'s Stratus Pants are waterproof, breathable unisex over pants as at home on the trail as on a bike ride to school. They are made from a lightweight, breathable 2.5 layer fabric that features a polyurethane coating and a DWR treatment and is seam sealed so no water gets in while sweat is wicked through to keep them dry and comfortable. Other features include articulation in the knees for easy movement, an elastic waist with a drawcord for a custom fit and zipped cuffs for easy on/off over footwear.',
    price: '$8/day',
    image: '360pants.jpg',
    moreImages:['360pants 1.jpg'],
  },
  {
    id: 5,
    name: 'Icebreaker Kid\'s 200 Oasis Leggings',
    description:'These 200 Oasis Leggings are a versatile lightweight base...',
    fullDescription: 'These 200 Oasis Leggings are a versatile lightweight base layer legging with all the benefits of pure Merino wool to keep kids warm on their adventures in cool conditions. They also feature sport a slim fit for easy layering, a comfortable brushed elastic waistband and a gusset for comfort and freedom of movement.',
    price: '$6/day',
    image: ' Icebreaker Oasis.jpg',
    moreImages: [' Icebreaker Oasis 1.jpg'],
    newArrival: true,
  },
];

function KidsClothing() {
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
      <h2>Kid's Clothing</h2>
      <p>Find durable and comfortable outdoor clothing for kids of all ages.</p>

      <div className="clothing-list">
        {kidsClothingItems.map((item) => (
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

export default KidsClothing;

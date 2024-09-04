import React from 'react';
import { useCart } from './CartContext';
import { useUserAuth } from './UserAuth'; // Import your custom hook
import { Link } from 'react-router-dom';
import './Cart.css'; // Ensure you have the CSS for styling
import Header from "./Header";
import NavBar from "./NavBar";

function Cart() {
  const { user } = useUserAuth(); // Destructure user from context
  const { cart, removeFromCart, addToCart, getTotalCost } = useCart();

  // Handle cases where cart might be undefined
  const cartItems = cart || [];

  const handleQuantityChange = (id, newQuantity) => {
    const item = cartItems.find(cartItem => cartItem.id === id);
    if (item) {
      addToCart(item, newQuantity, item.days);
    }
  };

  const handleDaysChange = (id, newDays) => {
    const item = cartItems.find(cartItem => cartItem.id === id);
    if (item) {
      addToCart(item, item.quantity, newDays);
    }
  };

  const handleAddToCart = (item) => {
    if (!user) {
      alert('You must be signed in to add items to the cart.');
      return;
    }
    // Add logic to add the item to the cart
    addToCart(item, item.quantity, item.days);
  };

  return (
    <div className="Cart">
      <Header/>
      <NavBar/>
      <h2>Your Cart</h2>
      {user ? (
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul>
              {cartItems.map((cartItem) => {
                const { id, name, quantity, days, image, pricePerDay } = cartItem;
                const total = (parseFloat(pricePerDay) || 0) * quantity * days;
                return (
                  <li key={id} className="cart-item">
                    {image ? (
                      <img src={image} alt={name} className="cart-item-image" />
                    ) : (
                      <img src={cartItem.mainImage} alt={cartItem.name} />
                    )}
                    <div className="item-details">
                      <h3>{name}</h3>
                      <p>
                        Quantity: 
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => handleQuantityChange(id, parseInt(e.target.value, 10))}
                        />
                      </p>
                      <p>
                        Days: 
                        <input
                          type="number"
                          min="1"
                          value={days}
                          onChange={(e) => handleDaysChange(id, parseInt(e.target.value, 10))}
                        />
                      </p>
                      <p>Price per Day: ${parseFloat(pricePerDay).toFixed(2)}</p>
                      <p>Total: ${total.toFixed(2)}</p>
                      <button onClick={() => removeFromCart(id)}>Remove</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : (
        <p>You need to be signed in to view your cart.</p>
      )}
      {user && (
        <>
          <h3>Total Cost: ${getTotalCost().toFixed(2)}</h3>
          <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
        </>
      )}
    </div>
  );
}

export default Cart;

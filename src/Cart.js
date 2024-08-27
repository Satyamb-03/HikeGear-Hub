// Cart.js
import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart, addToCart, getTotalCost } = useContext(CartContext);

  const handleQuantityChange = (id, newQuantity) => {
    const item = cart.find(cartItem => cartItem.id === id);
    if (item) {
      addToCart(item, newQuantity, item.days);
    }
  };

  const handleDaysChange = (id, newDays) => {
    const item = cart.find(cartItem => cartItem.id === id);
    if (item) {
      addToCart(item, item.quantity, newDays);
    }
  };

  // Function to get price from integer value
  const getPricePerDay = (price) => {
    return typeof price === 'number' ? price : 0;
  };

  return (
    <div className="Cart">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul>
            {cart.map((item) => {
              const pricePerDay = getPricePerDay(item.price);
              const total = pricePerDay * item.quantity * item.days;
              return (
                <li key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      Quantity: 
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                      />
                    </p>
                    <p>
                      Days: 
                      <input
                        type="number"
                        min="1"
                        value={item.days}
                        onChange={(e) => handleDaysChange(item.id, parseInt(e.target.value, 10))}
                        />
                      </p>
                      <p>Price per Day: ${pricePerDay.toFixed(2)}</p>
                      <p>Total: $
                        {pricePerDay > 0
                          ? total.toFixed(2)
                          : 'Invalid Price'}
                      </p>
                      <button onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <h3>Total Cost: ${getTotalCost().toFixed(2)}</h3>
        <Link to="/checkout">Proceed to Checkout</Link>
      </div>
    );
  }
  
  export default Cart;

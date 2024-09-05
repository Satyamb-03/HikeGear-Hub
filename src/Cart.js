import React, { useState } from 'react';
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

  // State to store start and end dates for all items
  const [dates, setDates] = useState({
    startDate: '',
    endDate: '',
  });

  // Update quantity and days in cart
  const handleQuantityChange = (id, newQuantity) => {
    const item = cartItems.find(cartItem => cartItem.id === id);
    if (item) {
      addToCart(item, newQuantity, calculateDays(dates));
    }
  };

  // Update start and end dates and recalculate days for all items
  const handleDateChange = (field, value) => {
    setDates(prevDates => ({
      ...prevDates,
      [field]: value,
    }));

    // Apply new dates to all items in the cart
    cartItems.forEach(item => {
      addToCart(item, item.quantity, calculateDays({ ...dates, [field]: value }));
    });
  };

  // Calculate days between start and end dates
  const calculateDays = ({ startDate, endDate }) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    }
    return 1;
  };

  // Calculate the total cost
  const totalCost = getTotalCost();
  
  // Rename bond fee to "Hiring Fee" and calculate it
  const hiringFee = Math.ceil(totalCost / 80) * 40;
  
  // Calculate 20% service fee based on the total cost (excluding the hiring fee)
  const serviceFee = totalCost * 0.20;
  
  // Ensure the total amount with hiring fee and service fee is at least $40
  const totalWithFee = Math.max(totalCost + hiringFee + serviceFee, 40);

  // Check if both startDate and endDate are provided
  const isDateRangeValid = dates.startDate && dates.endDate;

  return (
    <div className="Cart">
      <Header />
      <NavBar />
      <div className="cart-container">
        <div className="cart-items">
          <h2>Your Cart</h2>
          {user ? (
            <div>
              <div className="date-selector">
                <p>
                  Start Date:
                  <input
                    type="date"
                    value={dates.startDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                  />
                </p>
                <p>
                  End Date:
                  <input
                    type="date"
                    value={dates.endDate}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                  />
                </p>
              </div>
              {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <ul>
                  {cartItems.map((cartItem) => {
                    const { id, name, quantity, image, pricePerDay } = cartItem;
                    const total = (parseFloat(pricePerDay) || 0) * quantity * calculateDays(dates);

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
                            Price per Day: ${parseFloat(pricePerDay).toFixed(2)}
                          </p>
                          <p>
                            Total Days: {calculateDays(dates)}
                          </p>
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
        </div>
        {user && (
          <div className="order-summary">
            <h3>Order Summary</h3>
            <p>
              <strong>Start Date:</strong> {dates.startDate}
            </p>
            <p>
              <strong>End Date:</strong> {dates.endDate}
            </p>
            <p>
              <strong>Total Cost:</strong> ${totalCost.toFixed(2)}
            </p>
            <p>
              <strong>Hiring Fee:</strong> ${hiringFee.toFixed(2)} (Refundable upon gear return)
            </p>
            <p>
              <strong>Service Fee (20%):</strong> ${serviceFee.toFixed(2)}
            </p>
            <p>
              <strong>Total with Fees:</strong> ${totalWithFee.toFixed(2)}
            </p>
            <button 
              className={`checkout-btn ${!isDateRangeValid ? 'disabled' : ''}`}
              disabled={!isDateRangeValid}
            >
              <Link to={isDateRangeValid ? "/checkout" : "#"} className={`checkout-link ${!isDateRangeValid ? 'disabled-link' : ''}`}>
                Proceed to Checkout
              </Link>
            </button>
            {!isDateRangeValid && <p className="date-error">Please select both start and end dates to proceed.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;

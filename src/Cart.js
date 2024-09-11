import React, { useState, useEffect } from 'react';
import { useCart } from './components/Context/CartContext';
import { useUserAuth } from './components/Context/UserAuth';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const { user } = useUserAuth();
  const { cart, removeFromCart, addToCart, getTotalCost } = useCart();
  const [dates, setDates] = useState({
    startDate: '',
    endDate: '',
  });
  const navigate = useNavigate();

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const savedDates = localStorage.getItem('selectedDates');
    if (savedDates) {
      setDates(JSON.parse(savedDates));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedDates', JSON.stringify(dates));
  }, [dates]);

  const handleDateChange = (field, value) => {
    setDates(prevDates => {
      const newDates = { ...prevDates, [field]: value };

      cart.forEach(item => {
        if (newDates.startDate && newDates.endDate) {
          addToCart(item, item.quantity, calculateDays(newDates));
        }
      });

      return newDates;
    });
  };

  const calculateDays = ({ startDate, endDate }) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    }
    return 1;
  };

  const totalCost = getTotalCost();
  const baseHiringFee = 50;
  const increment = 10;
  const threshold = 30;
  const additionalHiringFee = Math.floor(totalCost / threshold) * increment;
  const hiringFee = baseHiringFee + additionalHiringFee;
  const serviceFee = totalCost * 0.20;
  const totalWithFee = Math.max(totalCost + hiringFee + serviceFee, 40);
  const isDateRangeValid = dates.startDate && dates.endDate;

  const handleProceedToCheckout = () => {
    navigate('/checkout', { state: { startDate: dates.startDate, endDate: dates.endDate } });
  };

  return (
    <div className="Cart">
      <div className="cart-container">
        <div className="cart-items">
          <h2>Your Cart</h2>
          {user ? (
            <>
              <div className="date-selector">
                <p>
                  Start Date:
                  <input
                    type="date"
                    value={dates.startDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    min={getTodayDate()}
                  />
                </p>
                <p>
                  End Date:
                  <input
                    type="date"
                    value={dates.endDate}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    min={dates.startDate || getTodayDate()}
                  />
                </p>
              </div>
              {cart.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <ul>
                  {cart.map((cartItem) => {
                    const { id, name, quantity, image, pricePerDay } = cartItem;
                    const total = (parseFloat(pricePerDay) || 0) * quantity * calculateDays(dates);

                    return (
                      <li key={id} className="cart-item">
                        <img src={image || cartItem.mainImage} alt={name} className="cart-item-image" />
                        <div className="item-details">
                          <h3>{name}</h3>
                          <p>
                            Quantity:
                            <input
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => {
                                if (dates.startDate && dates.endDate) {
                                  addToCart(cartItem, parseInt(e.target.value, 10), calculateDays(dates));
                                }
                              }}
                            />
                          </p>
                          <p>Price per Day: ${parseFloat(pricePerDay).toFixed(2)}</p>
                          <p>Total Days: {calculateDays(dates)}</p>
                          <p>Total: ${total.toFixed(2)}</p>
                          <button onClick={() => removeFromCart(id)}>Remove</button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          ) : (
            <p>You need to be signed in to view your cart.</p>
          )}
        </div>
        {user && (
          <div className="order-summary">
            <h3>Order Summary</h3>
            <p><strong>Start Date:</strong> {dates.startDate}</p>
            <p><strong>End Date:</strong> {dates.endDate}</p>
            <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>
            <p><strong>Hiring Fee:</strong> ${hiringFee.toFixed(2)} (Refundable upon gear return)</p>
            <p><strong>Service Fee (20%):</strong> ${serviceFee.toFixed(2)}</p>
            <p><strong>Total with Fees:</strong> ${totalWithFee.toFixed(2)}</p>
            <button 
              className={`checkout-btn ${!isDateRangeValid ? 'disabled' : ''}`}
              disabled={!isDateRangeValid}
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
            {!isDateRangeValid && <p className="date-error">Please select both start and end dates to proceed.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;

import React, { useState } from 'react';
import { useCart } from './CartContext';
import { useUserAuth } from './UserAuth';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

function Checkout() {
  const { cart, getTotalCost } = useCart();
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'NZ', // Default to New Zealand
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [discountAmount] = useState(0); // Keeping discountAmount for future use
  const serviceFeeRate = 0.1; // 10% service fee
  const hiringFeeRate = 0.05; // 5% hiring fee

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleContinueShopping = () => {
    navigate('/cart');
  };

  const totalCost = getTotalCost();
  const serviceFee = totalCost * serviceFeeRate;
  const hiringFee = totalCost * hiringFeeRate;
  const finalTotal = totalCost + serviceFee + hiringFee - discountAmount;

  return (
    <div className="Checkout">
      <h2>Checkout</h2>
      {isSubmitted ? (
        <div className="ThankYou">
          <h2>Thank You for Your Purchase!</h2>
          <p>Your order has been placed successfully.</p>
          <button onClick={() => setIsSubmitted(false)}>Return to Cart</button>
          <button onClick={handleContinueShopping}>Continue Shopping</button>
        </div>
      ) : (
        <>
          {user ? (
            <>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>First Name:</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name:</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number:</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Street:</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City:</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State:</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ZIP Code:</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Country:</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Estimated Total:</label>
                  <div className="total-cost">
                    ${finalTotal.toFixed(2)}
                    <p>(Including Service Fee: ${serviceFee.toFixed(2)}, Hiring Fee: ${hiringFee.toFixed(2)}, and Discount: ${discountAmount.toFixed(2)})</p>
                  </div>
                </div>
                <button type="submit">Submit Order</button>
                <button
                  type="button"
                  onClick={handleContinueShopping}
                  className="continue-shopping-btn"
                >
                  Continue Shopping
                </button>
              </form>
            </>
          ) : (
            <p>Please sign in to proceed with checkout.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Checkout;

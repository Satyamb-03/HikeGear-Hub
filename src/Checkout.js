import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { useUserAuth } from './UserAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import './Checkout.css';

function Checkout() {
  const { cart, getTotalCost, clearCart } = useCart();
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const db = getFirestore();

  const [formData, setFormData] = useState({
    pickupDate: '',
    pickupTime: '',
    address: '165 Queen Street, CBD',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalDays, setTotalDays] = useState(1);
  const totalCost = getTotalCost();

  const baseHiringFee = 50;
  const additionalHiringFee = Math.floor(totalCost / 30) * 10;
  const hiringFee = baseHiringFee + additionalHiringFee;

  const serviceFeeRate = 0.2;
  const serviceFee = totalCost * serviceFeeRate;
  const totalWithFee = Math.max(totalCost + hiringFee + serviceFee, 40);

  useEffect(() => {
    if (location.state && location.state.startDate && location.state.endDate) {
      const { startDate, endDate } = location.state;
      setFormData((prevFormData) => ({
        ...prevFormData,
        pickupDate: calculatePickupMinDate(startDate),
      }));
      setTotalDays(calculateDays(startDate, endDate));
    }
  }, [location.state]);

  const calculateDays = (startDate, endDate) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    }
    return 1;
  };

  const calculatePickupMinDate = (startDate) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() - 2); 
    return start.toISOString().split('T')[0]; 
  };

  const calculatePickupMaxDate = (startDate) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() - 1); 
    return start.toISOString().split('T')[0]; 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productIds = cart.map((item) => item.id);

    const orderData = {
      ...formData,
      totalCost: totalCost,
      serviceFee: serviceFee,
      hiringFee: hiringFee,
      finalTotal: totalWithFee,
      productIds: productIds,
      dateCreated: new Date(),
      userName: user.displayName,
      userId: user.uid,
      totalDays: totalDays,
      startDate: location.state.startDate,
      endDate: location.state.endDate,
    };

    try {
      await addDoc(collection(db, 'checkout'), orderData);
      setIsSubmitted(true);
      clearCart();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleBackToHome = () => {
    clearCart();
    navigate('/');
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const availablePickupTimes = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];

  return (
    <div className="Checkout">
      <h2>Checkout</h2>
      {isSubmitted ? (
        <div className="ThankYou">
          <h2>Thank You for Your Purchase!</h2>
          <p>Your order has been placed successfully. You can pick up your items at the selected time.</p>
          <button onClick={handleBackToHome}>Back to Home</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pickupDate">Pickup Date:</label>
            <input
              type="date"
              id="pickupDate"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleInputChange}
              min={calculatePickupMinDate(location.state.startDate)}
              max={calculatePickupMaxDate(location.state.startDate)} 
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pickupTime">Pickup Time:</label>
            <select
              id="pickupTime"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a time</option>
              {availablePickupTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="address">Click & Collect Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              disabled
            />
          </div>
          <div className="order-summary">
            <h3>Order Summary</h3>
            <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>
            <p><strong>Hiring Fee:</strong> ${hiringFee.toFixed(2)}</p>
            <p><strong>Service Fee (20%):</strong> ${serviceFee.toFixed(2)}</p>
            <p><strong>Final Total with Fees:</strong> ${totalWithFee.toFixed(2)}</p>
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleBackToCart}>
              Back to Cart
            </button>
            <button type="submit">Submit Order</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Checkout;

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

  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [totalDays, setTotalDays] = useState(1);
  const [submittedDate, setSubmittedDate] = useState('');
  const [submittedTime, setSubmittedTime] = useState('');
  const [checkoutId, setCheckoutId] = useState('');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

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

    const products = cart.map((item) => ({
      id: item.id,
      name: item.name,
      supplierId: item.supplierId, // Ensure supplierId is part of the product
    }));

    const orderData = {
      ...formData,
      totalCost: totalCost,
      serviceFee: serviceFee,
      hiringFee: hiringFee,
      finalTotal: totalWithFee,
      productIds: products.map((product) => product.id),
      productNames: products.map((product) => product.name),
      supplierIds: products.map((product) => product.supplierId), // Store the supplier IDs
      dateCreated: new Date(),
      userName: user.displayName,
      userId: user.uid,
      totalDays: totalDays,
      startDate: location.state.startDate,
      endDate: location.state.endDate,
    };

    try {
      const docRef = await addDoc(collection(db, 'checkout'), orderData);
      setCheckoutId(docRef.id);
      setIsOrderSubmitted(true);
      setSubmittedDate(formData.pickupDate);
      setSubmittedTime(formData.pickupTime);
      clearCart();
      setIsOrderModalOpen(true);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'feedback'), {
        userId: user.uid,
        userName: user.displayName,
        feedback: feedback,
        rating: rating,
        checkoutId: checkoutId,
        dateSubmitted: new Date(),
      });
      setFeedback('');
      setRating(0);
      setIsFeedbackSubmitted(true);
      setIsFeedbackModalOpen(true); // Open feedback confirmation popup
    } catch (error) {
      console.error('Error submitting feedback: ', error);
    }
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    // Open the feedback modal after closing the order confirmation
    if (isFeedbackSubmitted) {
      setIsFeedbackModalOpen(true);
    }
  };

  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    navigate('/'); // Redirect after closing feedback confirmation
  };

  const availablePickupTimes = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];

  return (
    <div className="Checkout">
      <h2>Checkout</h2>
      {isOrderSubmitted ? (
        <div className="ThankYou">
          <h2>Thank You for Your Purchase!</h2>
          <p>
            Your order has been placed successfully. You can pick up your items
            on <strong>{submittedDate}</strong> at <strong>{submittedTime}</strong>.
          </p>

          <div className="Feedback">
            <h3>We'd love to hear your feedback!</h3>
            <form onSubmit={handleFeedbackSubmit}>
              <div className="rating">
                <label>Rating:</label>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${rating >= star ? 'filled' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                placeholder="Leave your feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
              <button type="submit">Submit Feedback</button>
            </form>
          </div>
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

            <h4>Products in Your Cart:</h4>
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  <p><strong>Product:</strong> {item.name}</p>
                  <p><strong>Supplier ID:</strong> {item.supplierId}</p> {/* Display supplier ID */}
                </li>
              ))}
            </ul>
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleBackToCart} className="back-to-cart-btn">
              Back to Cart
            </button>
            <button type="submit" className="submit-btn">
              Confirm Order
            </button>
          </div>
        </form>
      )}

      {isOrderModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseOrderModal}>
              &times;
            </span>
            <h2>Order Confirmation</h2>
            <p>Your order has been placed successfully. Thank you for your purchase!</p>
            {isFeedbackSubmitted && (
              <p>Your feedback has been submitted. Thank you!</p>
            )}
          </div>
        </div>
      )}

      {isFeedbackModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseFeedbackModal}>
              &times;
            </span>
            <h2>Feedback Submitted</h2>
            <p>Thank you for your feedback!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;

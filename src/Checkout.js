import React, { useState, useEffect } from 'react';
import { useCart } from './components/Context/CartContext'; // Cart context to handle cart operations
import { useUserAuth } from './components/Context/UserAuth'; // User authentication context
import { useNavigate, useLocation } from 'react-router-dom'; // For navigation and accessing location state
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Firestore methods for database interactions
import './Checkout.css'; // Checkout component-specific styles

function Checkout() {
  const { cart, getTotalCost, clearCart } = useCart(); // Get cart details and methods from Cart context
  const { user } = useUserAuth(); // Get current user details from UserAuth context
  const navigate = useNavigate(); // Navigation hook for redirection
  const location = useLocation(); // Access location state (e.g., start and end date passed from Cart)
  const db = getFirestore(); // Initialize Firestore

  // Form data state to manage pickup date, time, and address
  const [formData, setFormData] = useState({
    pickupDate: '',
    pickupTime: '',
    address: '165 Queen Street, CBD', // Pre-filled address for Click & Collect
  });

  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false); // Track order submission status
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false); // Track feedback submission status
  const [feedback, setFeedback] = useState(''); // Manage user feedback input
  const [rating, setRating] = useState(0); // Manage rating input
  const [totalDays, setTotalDays] = useState(1); // Total days for rental period
  const [submittedDate, setSubmittedDate] = useState(''); // Track submitted pickup date
  const [submittedTime, setSubmittedTime] = useState(''); // Track submitted pickup time
  const [checkoutId, setCheckoutId] = useState(''); // Store checkout ID from Firestore
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false); // Handle order confirmation modal visibility
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false); // Handle feedback modal visibility

  const totalCost = getTotalCost(); // Get total cart cost

  // Additional fees based on total cost
  const baseHiringFee = 50;
  const additionalHiringFee = Math.floor(totalCost / 30) * 10; // Increment hiring fee per threshold
  const hiringFee = baseHiringFee + additionalHiringFee; // Total hiring fee

  const serviceFeeRate = 0.2; // 20% service fee
  const serviceFee = totalCost * serviceFeeRate; // Calculate service fee
  const totalWithFee = Math.max(totalCost + hiringFee + serviceFee, 40); // Ensure minimum total charge of 40

  // Calculate rental period and update form data on component mount
  useEffect(() => {
    if (location.state && location.state.startDate && location.state.endDate) {
      const { startDate, endDate } = location.state;
      setFormData((prevFormData) => ({
        ...prevFormData,
        pickupDate: calculatePickupMinDate(startDate), // Set the minimum pickup date
      }));
      setTotalDays(calculateDays(startDate, endDate)); // Set the total rental days
    }
  }, [location.state]);

  // Function to calculate the number of rental days
  const calculateDays = (startDate, endDate) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    }
    return 1;
  };

  // Calculate minimum allowed pickup date (2 days before rental start date)
  const calculatePickupMinDate = (startDate) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() - 2);
    return start.toISOString().split('T')[0];
  };

  // Calculate maximum allowed pickup date (1 day before rental start date)
  const calculatePickupMaxDate = (startDate) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() - 1);
    return start.toISOString().split('T')[0];
  };

  // Handle form input changes (e.g., pickup date, time)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle order submission and save order data to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    const products = cart.map((item) => ({
      id: item.id,
      name: item.name,
      supplierId: item.supplierId, // Ensure supplierId is part of the product data
    }));

    const orderData = {
      ...formData,
      totalCost: totalCost,
      serviceFee: serviceFee,
      hiringFee: hiringFee,
      finalTotal: totalWithFee,
      productIds: products.map((product) => product.id), // List of product IDs
      productNames: products.map((product) => product.name), // List of product names
      supplierIds: products.map((product) => product.supplierId), // List of supplier IDs
      dateCreated: new Date(),
      userName: user.displayName,
      userId: user.uid,
      totalDays: totalDays,
      startDate: location.state.startDate, // Rental start date
      endDate: location.state.endDate, // Rental end date
    };

    try {
      const docRef = await addDoc(collection(db, 'checkout'), orderData); // Save order to Firestore
      setCheckoutId(docRef.id); // Store the generated Firestore document ID
      setIsOrderSubmitted(true); // Mark order as submitted
      setSubmittedDate(formData.pickupDate); // Set the submitted pickup date
      setSubmittedTime(formData.pickupTime); // Set the submitted pickup time
      clearCart(); // Clear the cart after successful submission
      setIsOrderModalOpen(true); // Open order confirmation modal
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  // Handle feedback submission and save feedback to Firestore
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'feedback'), {
        userId: user.uid,
        userName: user.displayName,
        feedback: feedback,
        rating: rating,
        checkoutId: checkoutId, // Link feedback to the order
        dateSubmitted: new Date(),
      });
      setFeedback(''); // Clear feedback form
      setRating(0); // Reset rating
      setIsFeedbackSubmitted(true); // Mark feedback as submitted
      setIsFeedbackModalOpen(true); // Open feedback confirmation popup
    } catch (error) {
      console.error('Error submitting feedback: ', error);
    }
  };

  // Navigate back to the cart page
  const handleBackToCart = () => {
    navigate('/cart');
  };

  // Close order confirmation modal
  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    // Open feedback modal after closing order confirmation if feedback was submitted
    if (isFeedbackSubmitted) {
      setIsFeedbackModalOpen(true);
    }
  };

  // Close feedback confirmation modal and navigate to the homepage
  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    navigate('/'); // Redirect to the homepage after closing the feedback modal
  };

  // Available pickup time options
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

          {/* Feedback form after successful order */}
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
          {/* Pickup date input */}
          <div className="form-group">
            <label htmlFor="pickupDate">Pickup Date:</label>
            <input
              type="date"
              id="pickupDate"
              name="pickupDate"
              value={formData.pickupDate}
              min={calculatePickupMinDate(location.state.startDate)}
              max={calculatePickupMaxDate(location.state.startDate)}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Pickup time input */}
          <div className="form-group">
            <label htmlFor="pickupTime">Pickup Time:</label>
            <select
              id="pickupTime"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a pickup time</option>
              {availablePickupTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Address input */}
          <div className="form-group">
            <label htmlFor="address">Address (Click & Collect):</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              readOnly // Click & Collect address is pre-filled and read-only
            />
          </div>

          {/* Total cost and additional fees */}
          <div className="cost-summary">
            <p>Total Cost: ${totalCost.toFixed(2)}</p>
            <p>Hiring Fee: ${hiringFee.toFixed(2)}</p>
            <p>Service Fee: ${serviceFee.toFixed(2)}</p>
            <h3>Final Total: ${totalWithFee.toFixed(2)}</h3>
          </div>

          {/* Submit order button */}
          <button type="submit" className="submit-button">
            Submit Order
          </button>
        </form>
      )}

      {/* Order confirmation modal */}
      {isOrderModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Order Confirmation</h2>
            <p>Your order has been placed successfully!</p>
            <button onClick={handleCloseOrderModal}>Close</button>
          </div>
        </div>
      )}

      {/* Feedback confirmation modal */}
      {isFeedbackModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Thank You for Your Feedback!</h2>
            <p>We appreciate your input. Have a great day!</p>
            <button onClick={handleCloseFeedbackModal}>Close</button>
          </div>
        </div>
      )}

      {/* Back to cart button */}
      {!isOrderSubmitted && (
        <button onClick={handleBackToCart} className="back-to-cart-button">
          Back to Cart
        </button>
      )}
    </div>
  );
}

export default Checkout;

import React, { useContext, useState } from 'react';
import { useCart } from './CartContext';
import { useUserAuth } from './UserAuth'; // Import your custom hook
import { Link } from 'react-router-dom';
import { db, setDoc, doc } from './firebase'; // Import Firestore functions
import './Cart.css'; // Ensure you have the CSS for styling
import Header from "./Header";
import NavBar from "./NavBar";

function Cart() {
  const { user } = useUserAuth(); // Destructure user from context
  const { cart, removeFromCart, addToCart, getTotalCost } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle modal close
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Save cart to Firestore
  const saveCartToFirestore = async () => {
    if (user) {
      const cartData = {
        userId: user.uid,
        totalCost: getTotalCost(),
        items: cart.map(item => ({
          productId: item.id,
          total: item.pricePerDay * item.quantity * item.days,
        })),
      };

      try {
        const cartId = `${user.uid}-${Date.now()}`;
        await setDoc(doc(db, 'carts', cartId), cartData);
        alert('Cart saved successfully!');
      } catch (error) {
        console.error("Error saving cart: ", error);
        alert('Failed to save cart.');
      }
    } else {
      alert('You must be signed in to save the cart.');
    }
  };

  // Handle quantity change
  const handleQuantityChange = (id, newQuantity) => {
    const item = cart.find(cartItem => cartItem.id === id);
    if (item) {
      addToCart(item, newQuantity, item.days);
    }
  };

  // Handle days change
  const handleDaysChange = (id, newDays) => {
    const item = cart.find(cartItem => cartItem.id === id);
    if (item) {
      addToCart(item, item.quantity, newDays);
    }
  };

  return (
    <div className="Cart">
      <Header/>
      <NavBar/>
      <h2>Your Cart</h2>
      {user ? (
        <div className="cart-items">
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul>
              {cart.map((item) => {
                const pricePerDay = item.pricePerDay || 0;
                const total = pricePerDay * item.quantity * item.days;
                return (
                  <li key={item.id} className="cart-item">
                    <img src={item.mainImage} alt={item.name} />
                    <div className="item-details">
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
                      <p className="price">Price per Day: ${pricePerDay.toFixed(2)}</p>
                      <p>Total: ${total.toFixed(2)}</p>
                      <button onClick={() => removeFromCart(item.id)}>Remove</button>
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
          <Link to="/checkout" className="checkout-btn"  onClick={saveCartToFirestore}>Proceed to Checkout</Link>
        </>
      )}
    </div>
  );
}

export default Cart;

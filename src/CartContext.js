import React, { createContext, useContext, useState } from 'react';

// Create context
const CartContext = createContext();

// Create provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item, quantity, days) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      if (existingItemIndex !== -1) {
        // Update the existing item
        return prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity, days }
            : cartItem
        );
      } else {
        // Add new item
        return [...prevCart, { ...item, quantity, days }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const getTotalCost = () => {
    // Logic to calculate total cost
    return cart.reduce((total, item) => 
      total + (parseFloat(item.pricePerDay) || 0) * item.quantity * item.days, 0
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotalCost }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

import React, { createContext, useState } from 'react';

export const CartContext = createContext();

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
      }
      // Add new item if not already in cart
      return [...prevCart, { ...item, quantity, days }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(cartItem => cartItem.id !== id));
  };

  const getTotalCost = () => {
    return cart.reduce((total, item) => {
      const priceString = typeof item.price === 'string' ? item.price : '';
      const pricePerDay = parseFloat(priceString.replace('$', '').replace('/day', '')) || 0;
      return total + (pricePerDay * item.quantity * item.days);
    }, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotalCost }}>
      {children}
    </CartContext.Provider>
  );
};

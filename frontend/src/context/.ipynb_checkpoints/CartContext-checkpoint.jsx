import React, { createContext, useState, useContext } from 'react';

// Create context
export const CartContext = createContext();

// Custom hook to use the context
export const useCart = () => useContext(CartContext);

// Cart provider with minimal functionality
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  
  const addToCart = (item) => {
    setCart(prev => [...prev, item]);
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  const value = {
    cart,
    totalItems: cart.length,
    totalPrice: cart.reduce((sum, item) => sum + item.price, 0),
    addToCart,
    clearCart
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
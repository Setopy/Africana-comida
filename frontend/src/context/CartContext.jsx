// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the Cart Context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage if available
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Calculate derived values
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Update localStorage and calculate totals whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Calculate total items and price
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const price = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setTotalItems(itemCount);
    setTotalPrice(price);
  }, [cart]);

  // Add item to cart
  const addToCart = (item) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + (item.quantity || 1)
        };
        return updatedCart;
      } else {
        // Item doesn't exist, add new item with quantity
        return [...prevCart, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => {
      return prevCart.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      );
    });
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Value to be provided to consuming components
  const value = {
    cart,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
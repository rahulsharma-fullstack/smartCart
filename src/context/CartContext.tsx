import React, { createContext, useContext, useState } from 'react';

// Create CartContext
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]); // Cart state

  // Add product to cart
  const addToCart = (product) => {
    // Ensure the product object includes all necessary details (e.g., id, name)
    setCart((prevCart) => [...prevCart, product]);
  };

  // Context provider
  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the Cart context
export function useCart() {
  return useContext(CartContext);
}

// ─────────────────────────────────────────────────────────────────────────────
// src/context/CartContext.js
// In-memory cart. Clears when app restarts (by design — orders are persisted).
// ─────────────────────────────────────────────────────────────────────────────
import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const getCartItem = (productId) => cartItems.find((x) => x.id === productId) || null;
  const isInCart    = (productId) => cartItems.some((x) => x.id === productId);

  const addToCart = (product, quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1);
    setCartItems((prev) => {
      const existing = prev.find((x) => x.id === product.id);
      if (existing) {
        return prev.map((x) =>
          x.id === product.id ? { ...x, quantity: x.quantity + qty } : x
        );
      }
      return [...prev, { id: product.id, product, quantity: qty }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    const nextQty = Math.max(0, Number(quantity) || 0);
    setCartItems((prev) => {
      if (nextQty <= 0) return prev.filter((x) => x.id !== productId);
      return prev.map((x) =>
        x.id === productId ? { ...x, quantity: nextQty } : x
      );
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((x) => x.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totals = useMemo(() => {
    const totalItems    = cartItems.length;
    const totalQuantity = cartItems.reduce((s, x) => s + (x.quantity || 0), 0);
    const subtotal      = cartItems.reduce((s, x) => {
      return s + (Number(x.product?.price) || 0) * (x.quantity || 0);
    }, 0);
    const gst         = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + gst;
    return { totalItems, totalQuantity, subtotal, gst, totalAmount };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isInCart,
        getCartItem,
        ...totals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
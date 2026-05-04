// ─────────────────────────────────────────────────────────────────────────────
// src/context/OrderContext.js
// Orders are persisted to AsyncStorage — they survive app restarts.
// ─────────────────────────────────────────────────────────────────────────────
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'bayo_orders';
const OrderContext = createContext(null);

// ── Generate order ID ─────────────────────────────────────────────────────────
const makeOrderId = () => {
  const now  = new Date();
  const y    = String(now.getFullYear()).slice(-2);
  const m    = String(now.getMonth() + 1).padStart(2, '0');
  const d    = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `BAYO-${y}${m}${d}-${rand}`;
};

// ── Provider ──────────────────────────────────────────────────────────────────
export const OrderProvider = ({ children }) => {
  const [orders, setOrders]             = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Load persisted orders on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setOrders(JSON.parse(raw));
      } catch (e) {
        console.error('Failed to load orders:', e);
      } finally {
        setOrdersLoading(false);
      }
    })();
  }, []);

  // Save orders to AsyncStorage
  const persist = async (next) => {
    setOrders(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Failed to save orders:', e);
    }
  };

  // ── placeOrder ────────────────────────────────────────────────────────────
  const placeOrder = async ({
    cartItems,
    customerInfo,
    paymentMethod,
    subtotal,
    gst,
    totalAmount,
  }) => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('Cart is empty.');
    }

    const items = cartItems.map((x) => {
      const price    = Number(x.product?.price) || 0;
      const quantity = Number(x.quantity) || 0;
      return {
        id:              x.product.id,
        name:            x.product.name,
        category:        x.product.category,
        packSize:        x.product.packSize,
        unit:            x.product.unit,
        price,
        backgroundColor: x.product.backgroundColor,
        quantity,
        subtotal:        price * quantity,
      };
    });

    const pm = paymentMethod || 'COD';
    const order = {
      orderId:       makeOrderId(),
      createdAt:     new Date().toISOString(),
      status:        'Order Placed',
      paymentMethod: pm,
      // COD = pending, UPI or Bank Transfer = Paid
      paymentStatus: pm === 'COD' ? 'COD Pending' : 'Paid',
      customerInfo:  customerInfo || {},
      items,
      subtotal:      Number(subtotal)    || items.reduce((s, p) => s + p.subtotal, 0),
      gst:           Number(gst)         || 0,
      totalAmount:   Number(totalAmount) || 0,
    };

    const next = [order, ...orders];
    await persist(next);
    return order;
  };

  const value = useMemo(
    () => ({ orders, ordersLoading, placeOrder }),
    [orders, ordersLoading]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within an OrderProvider');
  return ctx;
};
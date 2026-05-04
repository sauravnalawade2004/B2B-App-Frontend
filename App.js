
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { AuthProvider }  from './src/context/AuthContext.js';
import { CartProvider }  from './src/context/CartContext.js';
import { OrderProvider } from './src/context/OrderContext.js';
import AppNavigator      from './src/navigation/AppNavigator.js';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <AppNavigator />
          <StatusBar style="light" />
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// src/navigation/AppNavigator.js
// Auth-gated stack navigator.
// Shows Splash → then Login/Signup (if not logged in) or Home (if logged in).
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';

import SplashScreen       from '../screens/SplashScreen';
import LoginScreen        from '../screens/LoginScreen';
import SignupScreen       from '../screens/SignupScreen';
import HomeScreen         from '../screens/HomeScreen';
import CartScreen         from '../screens/CartScreen';
import OrdersScreen       from '../screens/OrdersScreen';
import ProfileScreen      from '../screens/ProfileScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import TrackOrderScreen   from '../screens/TrackorderScreen';

const Stack = createNativeStackNavigator();

// Shared screen options (no header, slide animation)
const SCREEN_OPTS = { headerShown: false };

const AppNavigator = () => {
  const { user, loading } = useAuth();

  // While restoring session show a simple loader (SplashScreen handles branding)
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFF5EB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#C0612B" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={SCREEN_OPTS}>
        {user ? (
          // ── Authenticated ────────────────────────────────────────────────
          <>
            <Stack.Screen name="Home"         component={HomeScreen} />
            <Stack.Screen name="Cart"         component={CartScreen} />
            <Stack.Screen name="Orders"       component={OrdersScreen} />
            <Stack.Screen name="Profile"      component={ProfileScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
            <Stack.Screen name="TrackOrder"   component={TrackOrderScreen} />
          </>
        ) : (
          // ── Unauthenticated ──────────────────────────────────────────────
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login"  component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
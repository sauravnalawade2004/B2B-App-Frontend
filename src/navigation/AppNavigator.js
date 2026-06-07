// ─────────────────────────────────────────────────────────────────────────────
// src/navigation/AppNavigator.js
// CheckoutScreen removed — checkout is now embedded inside CartScreen.
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
const SCREEN_OPTS = { headerShown: false };

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={SCREEN_OPTS}>
        {user ? (
          <>
            <Stack.Screen name="Home"         component={HomeScreen} />
            <Stack.Screen name="Cart"         component={CartScreen} />
            <Stack.Screen name="Orders"       component={OrdersScreen} />
            <Stack.Screen name="Profile"      component={ProfileScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
            <Stack.Screen name="TrackOrder"   component={TrackOrderScreen} />
          </>
        ) : (
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
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrdersScreen from '../screens/OrdersScreen';
import TrackOrderScreen from '../screens/TrackorderScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState('Splash');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Simulate a delay for splash screen
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Check if user is logged in (currently hardcoded to false for demo)
        const isUserLoggedIn = false;
        setInitialRoute(isUserLoggedIn ? 'Home' : 'Login');
      } catch (error) {
        setInitialRoute('Login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
        initialRouteName={initialRoute}
      >
        {/* Splash Screen */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            animationEnabled: false,
          }}
        />

        {/* Auth Stack */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            animationEnabled: false,
            cardStyle: { backgroundColor: '#fff' },
          }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{
            cardStyle: { backgroundColor: '#fff' },
          }}
        />

        {/* App Stack */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="Orders"
          component={OrdersScreen}
          options={{
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="TrackOrder"
          component={TrackOrderScreen}
          options={{
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            animationEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

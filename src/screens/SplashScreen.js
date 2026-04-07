import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const spinAnim = new Animated.Value(0);

  useEffect(() => {
    // Start rotation animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Navigate to Signup after 4.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Signup');
    }, 4500);

    return () => clearTimeout(timer);
  }, [navigation, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#f5e6d3', '#e8dcc8', '#d4c4b0', '#b8a8d4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Product Image Container */}
        <View style={styles.imageContainer}>
          <View style={styles.productBox}>
            {/* Placeholder for product image */}
            <View style={styles.imagePlaceholder} />
          </View>
        </View>

        {/* Brand Name */}
        <Text style={styles.brandName}>Bayo Masala</Text>

        {/* Hindi Tagline */}
        <Text style={styles.hindiText}>स्वादिष्ट और शुद्धता का वादा</Text>

        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>YOUR PREMIER B2B SPICE PARTNER</Text>
        </View>

        {/* Loading Indicator */}
        <View style={styles.loaderContainer}>
          <Animated.View
            style={{
              transform: [{ rotate: spin }],
            }}
          >
            <View style={styles.spinnerShape} />
          </Animated.View>
        </View>

        {/* Bottom Text */}
        <View style={styles.footerContainer}>
          <Text style={styles.poweredBy}>POWERED BY</Text>
          <Text style={styles.companyName}>THE SPICE ATELIER</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.08,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  productBox: {
    width: 220,
    height: 280,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  imagePlaceholder: {
    width: 200,
    height: 260,
    backgroundColor: '#2a2a2a',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#b8721f',
    marginTop: 20,
    letterSpacing: 1,
  },
  hindiText: {
    fontSize: 18,
    color: '#4a4a4a',
    marginTop: 8,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  taglineContainer: {
    backgroundColor: '#f5e0d8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 15,
  },
  tagline: {
    fontSize: 12,
    color: '#c41e3a',
    fontWeight: '600',
    letterSpacing: 2,
  },
  loaderContainer: {
    marginTop: 20,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerShape: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#b8721f',
    borderTopColor: 'transparent',
  },
  footerContainer: {
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  poweredBy: {
    fontSize: 12,
    color: '#8b8b8b',
    letterSpacing: 1,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#b8721f',
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});

export default SplashScreen;

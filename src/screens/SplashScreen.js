// ─────────────────────────────────────────────────────────────────────────────
// src/screens/SplashScreen.js
// Brand splash — shown while auth state loads.
// AppNavigator auto-redirects once loading is done.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const { user } = useAuth();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const spinAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade-in animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    // Spinning loader
    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 1200, useNativeDriver: true })
    ).start();

    // Navigate after 2.5 s
    const timer = setTimeout(() => {
      if (user) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <LinearGradient
      colors={['#FFF5EB', '#FFE4C4', '#FFDAB3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
          <Image
            source={require('../../assets/Logo.png')}  // your logo file
            style={styles.logo}
            resizeMode="contain"
          />

        <Text style={styles.brandName}>BAYO Masala</Text>
        <Text style={styles.taglineHindi}>स्वाद में शुद्धता का वादा</Text>

        <View style={styles.pillContainer}>
          <Text style={styles.pillText}>PREMIER B2B SPICE PARTNER</Text>
        </View>

        <View style={styles.promisesRow}>
          {['No Preservatives', 'No MSG', 'No Added Colour'].map((p) => (
            <View key={p} style={styles.promiseBadge}>
              <Text style={styles.promiseText}>{p}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <View style={styles.loaderArea}>
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerSub}>POWERED BY</Text>
        <Text style={styles.footerBrand}>THE SPICE ATELIER</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    flex: 1,
    justifyContent: 'center',
  },

  // ── Logo — adjust size here ↓ ─────────────────────────────────────────────
  logoContainer: {
    marginBottom: 24,
    width:        width * 0.42,
    height:       width * 0.42,
    borderRadius: width * 0.21,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#C0612B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  // When using real Image tag, apply this style:
  logo: {
    width:        width * 0.38,  // ← adjust logo image size here
    height:       width * 0.38,
  },
  logoPlaceholder: {
    width:        width * 0.36,
    height:       width * 0.36,
    borderRadius: width * 0.18,
    backgroundColor: '#C0612B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInitial: { fontSize: width * 0.18, fontWeight: '900', color: '#fff' },

  brandName: {
    fontSize:     Math.min(width * 0.12, 48),
    fontWeight:   '800',
    color:        '#C0612B',
    letterSpacing: 1,
    marginBottom: 6,
  },
  taglineHindi: {
    fontSize:     Math.min(width * 0.042, 17),
    color:        '#6B3A1F',
    fontStyle:    'italic',
    marginBottom: 16,
    letterSpacing: 0.4,
  },
  pillContainer: {
    backgroundColor: '#FDE3D0',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 24,
    marginBottom: 24,
  },
  pillText: {
    fontSize:      Math.min(width * 0.028, 12),
    color:         '#C0612B',
    fontWeight:    '700',
    letterSpacing: 1.8,
  },
  promisesRow: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  promiseBadge: {
    backgroundColor: 'rgba(192,97,43,0.1)',
    borderWidth:  1,
    borderColor:  'rgba(192,97,43,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  promiseText: {
    fontSize:   Math.min(width * 0.028, 11),
    color:      '#8B4513',
    fontWeight: '600',
  },

  loaderArea: { marginBottom: 32 },
  spinner: {
    width:        36,
    height:       36,
    borderRadius: 18,
    borderWidth:  3,
    borderColor:  '#C0612B',
    borderTopColor: 'transparent',
  },

  footer: { alignItems: 'center', paddingBottom: height * 0.05 },
  footerSub: { fontSize: 10, color: '#A0856B', letterSpacing: 1.5, marginBottom: 2 },
  footerBrand: { fontSize: 13, color: '#C0612B', fontWeight: '700', letterSpacing: 2 },
});

export default SplashScreen;
// ─────────────────────────────────────────────────────────────────────────────
// SplashScreen.js — Green & White theme
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
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
    Animated.loop(Animated.timing(spinAnim, { toValue: 1, duration: 1200, useNativeDriver: true })).start();
    const timer = setTimeout(() => {
      navigation.replace(user ? 'Home' : 'Login');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <LinearGradient colors={['#F1F8E9', '#DCEDC8', '#A5D6A7']} style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Image source={require('../../assets/Logo.png')} style={styles.logo} resizeMode="contain" />
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

const s1 = StyleSheet.create({
  container:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content:    { alignItems: 'center', paddingHorizontal: 24, flex: 1, justifyContent: 'center' },
  logo:       { width: width * 0.38, height: width * 0.38 },
  brandName:  { fontSize: Math.min(width * 0.12, 48), fontWeight: '800', color: '#2E7D32', letterSpacing: 1, marginBottom: 6 },
  taglineHindi: { fontSize: Math.min(width * 0.042, 17), color: '#1B5E20', fontStyle: 'italic', marginBottom: 16, letterSpacing: 0.4 },
  pillContainer: { backgroundColor: '#C8E6C9', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 24, marginBottom: 24 },
  pillText:   { fontSize: Math.min(width * 0.028, 12), color: '#2E7D32', fontWeight: '700', letterSpacing: 1.8 },
  promisesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  promiseBadge: { backgroundColor: 'rgba(46,125,50,0.1)', borderWidth: 1, borderColor: 'rgba(46,125,50,0.3)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  promiseText: { fontSize: Math.min(width * 0.028, 11), color: '#2E7D32', fontWeight: '600' },
  loaderArea: { marginBottom: 32 },
  spinner:    { width: 36, height: 36, borderRadius: 18, borderWidth: 3, borderColor: '#2E7D32', borderTopColor: 'transparent' },
  footer:     { alignItems: 'center', paddingBottom: height * 0.05 },
  footerSub:  { fontSize: 10, color: '#5A7A5C', letterSpacing: 1.5, marginBottom: 2 },
  footerBrand: { fontSize: 13, color: '#2E7D32', fontWeight: '700', letterSpacing: 2 },
});

export { SplashScreen as default };

// We export styles so OrderSuccessScreen (in this same file) can also use theme
const styles = s1;
// ─────────────────────────────────────────────────────────────────────────────
// src/screens/LoginScreen.js
// Fully local login — enter registered mobile → press Sign In.
// No OTP, no backend. Uses AuthContext.login().
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Dimensions, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [mobile, setMobile]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const clean = mobile.replace(/\D/g, '').slice(0, 10);
    if (clean.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      await login(clean);
      // AppNavigator auto-navigates to Home when user state is set
    } catch (e) {
      Alert.alert('Login Failed', e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={['#FFF5EB', '#FFE4C4', '#FFDAB3']} style={styles.bg}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Brand header ──────────────────────────────────────────────── */}
          <View style={styles.brandHeader}>
            <Image
              source={require('../../assets/Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>BAYO Masala</Text>
            <Text style={styles.brandTagline}>B2B SPICE PARTNER</Text>
          </View>

          {/* ── Card ──────────────────────────────────────────────────────── */}
          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Enter your registered mobile number to access your wholesale dashboard.
            </Text>

            {/* Mobile input */}
            <Text style={styles.fieldLabel}>MOBILE NUMBER</Text>
            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="10-digit mobile number"
                placeholderTextColor="#C8A882"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onChangeText={(v) => setMobile(v.replace(/\D/g, '').slice(0, 10))}
              />
            </View>

            {/* Sign In button */}
            <TouchableOpacity
              style={[styles.signInBtn, loading && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <MaterialCommunityIcons name="login" size={20} color="#fff" />
                  <Text style={styles.signInBtnText}>Sign In</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Register link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerLabel}>New business? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.registerLink}>Register here</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Promise strip */}
          <View style={styles.promiseStrip}>
            <MaterialCommunityIcons name="shield-check" size={16} color="#C0612B" />
            <Text style={styles.promiseText}>
              No Preservatives · No MSG · No Added Colour · Consistent Taste
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Math.max(16, width * 0.06),
    paddingTop: 60,
    paddingBottom: 40,
  },

  // ── Brand header ──────────────────────────────────────────────────────────
  brandHeader: { alignItems: 'center', marginBottom: 32 },
  // ↓ Adjust logo size here
  logoCircle: {
    width:        width * 0.22,
    height:       width * 0.22,
    borderRadius: width * 0.11,
    backgroundColor: '#C0612B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    elevation: 8,
    shadowColor: '#C0612B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  // For real Image:
  logo: {
    width:        width * 0.22,
    height:       width * 0.22,
    marginBottom: 14,
  },
  logoLetter: { fontSize: width * 0.11, fontWeight: '900', color: '#fff' },
  brandName:  { fontSize: Math.min(width * 0.085, 34), fontWeight: '800', color: '#C0612B', marginBottom: 4 },
  brandTagline: { fontSize: 11, color: '#A0856B', fontWeight: '700', letterSpacing: 2 },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowColor: '#C0612B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 20,
  },
  title: { fontSize: Math.min(width * 0.07, 28), fontWeight: '800', color: '#1A1A1A', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#777', lineHeight: 20, marginBottom: 24 },

  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B4513',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#F5D5B5',
    backgroundColor: '#FFF8F2',
    overflow: 'hidden',
  },
  countryCode: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#F5E8D8',
    borderRightWidth: 1.5,
    borderRightColor: '#F5D5B5',
  },
  countryCodeText: { fontSize: 15, fontWeight: '700', color: '#8B4513' },
  phoneInput: { flex: 1, paddingHorizontal: 14, fontSize: 15, color: '#333', paddingVertical: 14 },

  signInBtn: {
    backgroundColor: '#C0612B',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    elevation: 6,
    shadowColor: '#C0612B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 16,
  },
  signInBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  btnDisabled: { opacity: 0.6 },

  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerLabel: { fontSize: 14, color: '#777' },
  registerLink: { fontSize: 14, color: '#C0612B', fontWeight: '700' },

  // ── Promise strip ─────────────────────────────────────────────────────────
  promiseStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF0E6',
    borderRadius: 14,
    padding: 14,
  },
  promiseText: { flex: 1, fontSize: 12, color: '#8B4513', fontWeight: '500', lineHeight: 17 },
});

export default LoginScreen;
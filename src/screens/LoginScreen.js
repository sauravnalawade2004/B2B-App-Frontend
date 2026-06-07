// ─────────────────────────────────────────────────────────────────────────────
// LoginScreen.js — Green & White theme
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Dimensions, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const G = {
  primary: '#2E7D32',
  light:   '#E8F5E9',
  text:    '#1B2A1C',
  subtext: '#5A7A5C',
  border:  '#C8E6C9',
  white:   '#FFFFFF',
};

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [mobile, setMobile]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const clean = mobile.replace(/\D/g, '').slice(0, 10);
    if (clean.length !== 10) { Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.'); return; }
    setLoading(true);
    try { await login(clean); }
    catch (e) { Alert.alert('Login Failed', e.message || 'Something went wrong.'); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient colors={['#F1F8E9', '#DCEDC8', '#C5E1A5']} style={styles.bg}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <View style={styles.brandHeader}>
            <Image source={require('../../assets/Logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.brandName}>BAYO Masala</Text>
            <Text style={styles.brandTagline}>B2B SPICE PARTNER</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Enter your registered mobile number to access your wholesale dashboard.</Text>

            <Text style={styles.fieldLabel}>MOBILE NUMBER</Text>
            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="10-digit mobile number"
                placeholderTextColor="#A5C9A7"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onChangeText={(v) => setMobile(v.replace(/\D/g, '').slice(0, 10))}
              />
            </View>

            <TouchableOpacity style={[styles.signInBtn, loading && styles.btnDisabled]} onPress={handleLogin} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <>
                    <MaterialCommunityIcons name="login" size={20} color="#fff" />
                    <Text style={styles.signInBtnText}>Sign In</Text>
                  </>
              }
            </TouchableOpacity>

            <View style={styles.registerRow}>
              <Text style={styles.registerLabel}>New business? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.registerLink}>Register here</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.promiseStrip}>
            <MaterialCommunityIcons name="shield-check" size={16} color={G.primary} />
            <Text style={styles.promiseText}>No Preservatives · No MSG · No Added Colour · Consistent Taste</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bg:     { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Math.max(16, width * 0.06), paddingTop: 60, paddingBottom: 40 },

  brandHeader: { alignItems: 'center', marginBottom: 32 },
  logo:        { width: width * 0.22, height: width * 0.22, marginBottom: 14 },
  brandName:   { fontSize: Math.min(width * 0.085, 34), fontWeight: '800', color: G.primary, marginBottom: 4 },
  brandTagline: { fontSize: 11, color: G.subtext, fontWeight: '700', letterSpacing: 2 },

  card: {
    backgroundColor: G.white, borderRadius: 24, padding: 24,
    elevation: 8, shadowColor: G.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, marginBottom: 20,
  },
  title:    { fontSize: Math.min(width * 0.07, 28), fontWeight: '800', color: G.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#777', lineHeight: 20, marginBottom: 24 },

  fieldLabel: { fontSize: 11, fontWeight: '700', color: G.primary, letterSpacing: 1.2, marginBottom: 10 },
  phoneRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 24,
    borderRadius: 14, borderWidth: 1.5, borderColor: G.border,
    backgroundColor: G.light, overflow: 'hidden',
  },
  countryCode:     { paddingHorizontal: 14, paddingVertical: 14, backgroundColor: '#C8E6C9', borderRightWidth: 1.5, borderRightColor: G.border },
  countryCodeText: { fontSize: 15, fontWeight: '700', color: G.primary },
  phoneInput:      { flex: 1, paddingHorizontal: 14, fontSize: 15, color: '#333', paddingVertical: 14 },

  signInBtn: {
    backgroundColor: G.primary, borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    elevation: 6, shadowColor: G.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, marginBottom: 16,
  },
  signInBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  btnDisabled:   { opacity: 0.6 },

  registerRow:  { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerLabel: { fontSize: 14, color: '#777' },
  registerLink:  { fontSize: 14, color: G.primary, fontWeight: '700' },

  promiseStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: G.white, borderRadius: 14, padding: 14,
  },
  promiseText: { flex: 1, fontSize: 12, color: G.primary, fontWeight: '500', lineHeight: 17 },
});

export default LoginScreen;
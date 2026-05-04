// ─────────────────────────────────────────────────────────────────────────────
// src/screens/SignupScreen.js
// Business registration — fully local, wired to AuthContext.signup()
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

const BUSINESS_TYPES = ['Hotel', 'Restaurant', 'Retailer', 'Wholesaler', 'Caterer'];

const SignupScreen = ({ navigation }) => {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    fullName:     '',
    businessName: '',
    businessType: '',
    mobile:       '',
    address:      '',
    city:         '',
    pincode:      '',
    gstNumber:    '',
  });
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const validate = () => {
    if (!form.fullName.trim())                                    return 'Please enter your full name.';
    if (!form.businessName.trim())                                return 'Please enter your business name.';
    if (!form.businessType)                                       return 'Please select your business type.';
    if (form.mobile.replace(/\D/g, '').length !== 10)             return 'Please enter a valid 10-digit mobile number.';
    if (!form.address.trim())                                     return 'Please enter your address.';
    if (!form.city.trim())                                        return 'Please enter your city.';
    if (form.pincode.replace(/\D/g, '').length !== 6)             return 'Please enter a valid 6-digit pincode.';
    return null;
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) { Alert.alert('Incomplete Details', err); return; }

    setLoading(true);
    try {
      await signup({
        ...form,
        mobile:    form.mobile.replace(/\D/g, '').slice(0, 10),
        pincode:   form.pincode.replace(/\D/g, '').slice(0, 6),
        gstNumber: form.gstNumber.trim().toUpperCase() || '',
      });
      // AppNavigator auto-navigates to Home once user state is set
    } catch (e) {
      Alert.alert('Registration Failed', e?.message || 'Something went wrong. Please try again.');
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
          keyboardDismissMode="none"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <MaterialIcons name="arrow-back" size={22} color="#8B4513" />
            </TouchableOpacity>
            <View style={styles.headerLogo}>
              <Image source={require('../../assets/Logo.png')} style={styles.logoImg} resizeMode="contain" />
              <Text style={styles.brandName}>BAYO Masala</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Register Your Business</Text>
            <Text style={styles.subtitle}>
              Join 500+ hotels, restaurants, and retailers buying from BAYO.
            </Text>

            {/* ── Personal Info ───────────────────────────────────────────── */}
            <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>

            <Text style={styles.fieldLabel}>FULL NAME *</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g. Ramesh Sharma"
              placeholderTextColor="#C8A882"
              value={form.fullName}
              onChangeText={(v) => set('fullName', v)}
            />

            <Text style={styles.fieldLabel}>MOBILE NUMBER *</Text>
            <TextInput
              style={styles.input}
              placeholder="10-digit mobile number"
              placeholderTextColor="#C8A882"
              keyboardType="phone-pad"
              maxLength={10}
              value={form.mobile}
              onChangeText={(v) => set('mobile', v.replace(/\D/g, '').slice(0, 10))}
            />

            {/* ── Business Info ───────────────────────────────────────────── */}
            <Text style={styles.sectionLabel}>BUSINESS INFORMATION</Text>

            <Text style={styles.fieldLabel}>BUSINESS NAME *</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g. Hotel Sai Palace"
              placeholderTextColor="#C8A882"
              value={form.businessName}
              onChangeText={(v) => set('businessName', v)}
            />

            <Text style={styles.fieldLabel}>GST NUMBER (OPTIONAL)</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g. 27ABCDE1234F1Z5"
              placeholderTextColor="#C8A882"
              autoCapitalize="characters"
              maxLength={15}
              value={form.gstNumber}
              onChangeText={(v) => set('gstNumber', v.toUpperCase().replace(/\s/g, '').slice(0, 15))}
            />

            <Text style={styles.fieldLabel}>BUSINESS TYPE *</Text>
            <View style={styles.typeGrid}>
              {BUSINESS_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeChip, form.businessType === t && styles.typeChipActive]}
                  onPress={() => set('businessType', t)}
                >
                  <Text style={[styles.typeChipText, form.businessType === t && styles.typeChipTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Delivery Address ────────────────────────────────────────── */}
            <Text style={styles.sectionLabel}>DELIVERY ADDRESS</Text>

            <Text style={styles.fieldLabel}>FULL ADDRESS *</Text>
            <TextInput
              style={[styles.input, styles.inputMulti]}
              placeholder="Shop/Hotel address, street, landmark"
              placeholderTextColor="#C8A882"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={form.address}
              onChangeText={(v) => set('address', v)}
            />

            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.fieldLabel}>CITY *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="E.g. Nashik"
                  placeholderTextColor="#C8A882"
                  value={form.city}
                  onChangeText={(v) => set('city', v)}
                />
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.fieldLabel}>PINCODE *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="6-digit"
                  placeholderTextColor="#C8A882"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={form.pincode}
                  onChangeText={(v) => set('pincode', v.replace(/\D/g, '').slice(0, 6))}
                />
              </View>
            </View>

            {/* Promise strip */}
            <View style={styles.promiseStrip}>
              <MaterialCommunityIcons name="shield-check" size={16} color="#C0612B" />
              <Text style={styles.promiseStripText}>
                No Preservatives · No MSG · No Added Colour · Consistent Taste
              </Text>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <MaterialCommunityIcons name="storefront" size={20} color="#fff" />
                  <Text style={styles.submitBtnText}>Create Account & Continue</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginLabel}>Already registered? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: Math.max(16, width * 0.05),
    paddingBottom: 40,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerLogo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  // ↓ Adjust header logo size here
  logoCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#C0612B',
    justifyContent: 'center', alignItems: 'center',
  },
  logoImg: { width: 36, height: 36 },
  logoLetter: { fontSize: 18, fontWeight: '900', color: '#fff' },
  brandName: { fontSize: 18, fontWeight: '800', color: '#C0612B' },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 22,
    elevation: 8,
    shadowColor: '#C0612B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  title: { fontSize: Math.min(width * 0.065, 26), fontWeight: '800', color: '#1A1A1A', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#777', marginBottom: 22, lineHeight: 19 },

  sectionLabel: {
    fontSize: 11, fontWeight: '800', color: '#C0612B',
    letterSpacing: 1.2, marginBottom: 14, marginTop: 8,
    paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: '#F5E8D8',
  },

  // ── Fields ────────────────────────────────────────────────────────────────
  fieldLabel: {
    fontSize: 11, fontWeight: '700', color: '#8B4513',
    letterSpacing: 1, marginBottom: 8, marginTop: 4,
  },
  input: {
    backgroundColor: '#FFF8F2',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#F5D5B5',
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  inputMulti: { minHeight: 80, paddingTop: 13 },
  row: { flexDirection: 'row', gap: 12 },
  halfCol: { flex: 1 },

  // ── Business type chips ───────────────────────────────────────────────────
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  typeChip: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 24, borderWidth: 1.5,
    borderColor: '#F5D5B5', backgroundColor: '#FFF8F2',
  },
  typeChipActive: { backgroundColor: '#C0612B', borderColor: '#C0612B' },
  typeChipText: { fontSize: 13, color: '#8B4513', fontWeight: '600' },
  typeChipTextActive: { color: '#fff' },

  // ── Promise strip ─────────────────────────────────────────────────────────
  promiseStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFF5EB', borderRadius: 10, padding: 12, marginVertical: 16,
  },
  promiseStripText: { flex: 1, fontSize: 12, color: '#8B4513', fontWeight: '500', lineHeight: 17 },

  // ── Buttons ───────────────────────────────────────────────────────────────
  submitBtn: {
    backgroundColor: '#C0612B',
    borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    elevation: 6,
    shadowColor: '#C0612B', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
    marginBottom: 16,
  },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  btnDisabled: { opacity: 0.6 },

  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginLabel: { fontSize: 14, color: '#777' },
  loginLink: { fontSize: 14, color: '#C0612B', fontWeight: '700' },
});

export default SignupScreen;
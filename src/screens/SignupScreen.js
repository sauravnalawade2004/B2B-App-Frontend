// ─────────────────────────────────────────────────────────────────────────────
// SignupScreen.js — Green & White theme
// Two registration types: With Food Licence / Without Food Licence
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

const G = {
  primary: '#2E7D32',
  light:   '#E8F5E9',
  text:    '#1B2A1C',
  subtext: '#5A7A5C',
  border:  '#C8E6C9',
  white:   '#FFFFFF',
};

const BUSINESS_TYPES = ['Hotel', 'Restaurant', 'Retailer', 'Wholesaler', 'Caterer'];

const SignupScreen = ({ navigation }) => {
  const { signup } = useAuth();
  const [licenceType, setLicenceType] = useState(null); // 'with' | 'without'
  const [form, setForm] = useState({
    fullName: '', businessName: '', businessType: '', mobile: '',
    address: '', city: '', pincode: '', gstNumber: '', foodLicenceNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const validate = () => {
    if (!licenceType)                                           return 'Please select registration type.';
    if (!form.fullName.trim())                                  return 'Please enter your full name.';
    if (!form.businessName.trim())                              return 'Please enter your business name.';
    if (!form.businessType)                                     return 'Please select your business type.';
    if (form.mobile.replace(/\D/g, '').length !== 10)           return 'Please enter a valid 10-digit mobile.';
    if (!form.address.trim())                                   return 'Please enter your address.';
    if (!form.city.trim())                                      return 'Please enter your city.';
    if (form.pincode.replace(/\D/g, '').length !== 6)           return 'Please enter a valid 6-digit pincode.';
    if (licenceType === 'with' && !form.foodLicenceNumber.trim()) return 'Please enter your Food Licence number.';
    return null;
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) { Alert.alert('Incomplete Details', err); return; }
    setLoading(true);
    try {
      await signup({
        ...form,
        mobile:  form.mobile.replace(/\D/g, '').slice(0, 10),
        pincode: form.pincode.replace(/\D/g, '').slice(0, 6),
        gstNumber: form.gstNumber.trim().toUpperCase() || '',
        licenceType,
        isApproved: licenceType === 'with', // without licence needs admin approval
      });
    } catch (e) {
      Alert.alert('Registration Failed', e?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 1: choose licence type ──────────────────────────────────────────
  if (!licenceType) {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <LinearGradient colors={['#F1F8E9', '#DCEDC8', '#C5E1A5']} style={styles.bg}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <MaterialIcons name="arrow-back" size={22} color={G.primary} />
              </TouchableOpacity>
              <View style={styles.headerLogo}>
                <Image source={require('../../assets/Logo.png')} style={styles.logoImg} resizeMode="contain" />
                <Text style={styles.brandName}>BAYO Masala</Text>
              </View>
              <View style={{ width: 40 }} />
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>Register Your Business</Text>
              <Text style={styles.subtitle}>Choose your registration type to get started.</Text>

              <Text style={styles.sectionLabel}>REGISTRATION TYPE</Text>

              <TouchableOpacity style={styles.licenceCard} onPress={() => setLicenceType('with')}>
                <View style={[styles.licenceIcon, { backgroundColor: '#E8F5E9' }]}>
                  <MaterialCommunityIcons name="certificate" size={30} color={G.primary} />
                </View>
                <View style={styles.licenceInfo}>
                  <Text style={styles.licenceTitle}>With Food Licence</Text>
                  <Text style={styles.licenceDesc}>You have a valid FSSAI / Food Licence number. Instant approval.</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={G.primary} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.licenceCard, { marginTop: 12 }]} onPress={() => setLicenceType('without')}>
                <View style={[styles.licenceIcon, { backgroundColor: '#FFF3E0' }]}>
                  <MaterialCommunityIcons name="storefront" size={30} color="#FF6F00" />
                </View>
                <View style={styles.licenceInfo}>
                  <Text style={styles.licenceTitle}>Without Food Licence</Text>
                  <Text style={styles.licenceDesc}>No food licence yet. Admin will review and approve your account.</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#FF6F00" />
              </TouchableOpacity>
            </View>

            <View style={styles.promiseStrip}>
              <MaterialCommunityIcons name="shield-check" size={16} color={G.primary} />
              <Text style={styles.promiseStripText}>No Preservatives · No MSG · No Added Colour · Consistent Taste</Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }

  // ── Step 2: fill form ────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient colors={['#F1F8E9', '#DCEDC8', '#C5E1A5']} style={styles.bg}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <View style={styles.header}>
            <TouchableOpacity onPress={() => setLicenceType(null)} style={styles.backBtn}>
              <MaterialIcons name="arrow-back" size={22} color={G.primary} />
            </TouchableOpacity>
            <View style={styles.headerLogo}>
              <Image source={require('../../assets/Logo.png')} style={styles.logoImg} resizeMode="contain" />
              <Text style={styles.brandName}>BAYO Masala</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          {/* Licence type banner */}
          <View style={[styles.typeBanner, licenceType === 'with' ? styles.typeBannerGreen : styles.typeBannerAmber]}>
            <MaterialCommunityIcons
              name={licenceType === 'with' ? 'certificate' : 'storefront'}
              size={18}
              color={licenceType === 'with' ? G.primary : '#FF6F00'}
            />
            <Text style={[styles.typeBannerText, { color: licenceType === 'with' ? G.primary : '#FF6F00' }]}>
              {licenceType === 'with' ? 'With Food Licence — Instant Approval' : 'Without Food Licence — Pending Admin Approval'}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Register Your Business</Text>
            <Text style={styles.subtitle}>Join 500+ hotels & restaurants buying from BAYO.</Text>

            <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>
            <Text style={styles.fieldLabel}>FULL NAME *</Text>
            <TextInput style={styles.input} placeholder="E.g. Ramesh Sharma" placeholderTextColor="#A5C9A7" value={form.fullName} onChangeText={(v) => set('fullName', v)} />

            <Text style={styles.fieldLabel}>MOBILE NUMBER *</Text>
            <TextInput style={styles.input} placeholder="10-digit mobile number" placeholderTextColor="#A5C9A7" keyboardType="phone-pad" maxLength={10} value={form.mobile} onChangeText={(v) => set('mobile', v.replace(/\D/g, '').slice(0, 10))} />

            <Text style={styles.sectionLabel}>BUSINESS INFORMATION</Text>
            <Text style={styles.fieldLabel}>BUSINESS NAME *</Text>
            <TextInput style={styles.input} placeholder="E.g. Hotel Sai Palace" placeholderTextColor="#A5C9A7" value={form.businessName} onChangeText={(v) => set('businessName', v)} />

            <Text style={styles.fieldLabel}>GST NUMBER (OPTIONAL)</Text>
            <TextInput style={styles.input} placeholder="E.g. 27ABCDE1234F1Z5" placeholderTextColor="#A5C9A7" autoCapitalize="characters" maxLength={15} value={form.gstNumber} onChangeText={(v) => set('gstNumber', v.toUpperCase().replace(/\s/g, '').slice(0, 15))} />

            {licenceType === 'with' && (
              <>
                <Text style={styles.fieldLabel}>FOOD LICENCE NUMBER *</Text>
                <TextInput style={styles.input} placeholder="E.g. 11225002000001" placeholderTextColor="#A5C9A7" keyboardType="number-pad" maxLength={14} value={form.foodLicenceNumber} onChangeText={(v) => set('foodLicenceNumber', v.replace(/\D/g, '').slice(0, 14))} />
              </>
            )}

            <Text style={styles.fieldLabel}>BUSINESS TYPE *</Text>
            <View style={styles.typeGrid}>
              {BUSINESS_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeChip, form.businessType === t && styles.typeChipActive]}
                  onPress={() => set('businessType', t)}
                >
                  <Text style={[styles.typeChipText, form.businessType === t && styles.typeChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>DELIVERY ADDRESS</Text>
            <Text style={styles.fieldLabel}>FULL ADDRESS *</Text>
            <TextInput style={[styles.input, styles.inputMulti]} placeholder="Shop/Hotel address, street, landmark" placeholderTextColor="#A5C9A7" multiline numberOfLines={3} textAlignVertical="top" value={form.address} onChangeText={(v) => set('address', v)} />

            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.fieldLabel}>CITY *</Text>
                <TextInput style={styles.input} placeholder="E.g. Nashik" placeholderTextColor="#A5C9A7" value={form.city} onChangeText={(v) => set('city', v)} />
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.fieldLabel}>PINCODE *</Text>
                <TextInput style={styles.input} placeholder="6-digit" placeholderTextColor="#A5C9A7" keyboardType="number-pad" maxLength={6} value={form.pincode} onChangeText={(v) => set('pincode', v.replace(/\D/g, '').slice(0, 6))} />
              </View>
            </View>

            {licenceType === 'without' && (
              <View style={styles.approvalNote}>
                <MaterialCommunityIcons name="information" size={16} color="#FF6F00" />
                <Text style={styles.approvalNoteText}>Your account will be reviewed by admin. You'll receive a notification once approved.</Text>
              </View>
            )}

            <View style={styles.promiseStrip}>
              <MaterialCommunityIcons name="shield-check" size={16} color={G.primary} />
              <Text style={styles.promiseStripText}>No Preservatives · No MSG · No Added Colour</Text>
            </View>

            <TouchableOpacity style={[styles.submitBtn, loading && styles.btnDisabled]} onPress={handleRegister} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <>
                    <MaterialCommunityIcons name="storefront" size={20} color="#fff" />
                    <Text style={styles.submitBtnText}>Create Account & Continue</Text>
                  </>
              }
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
  bg:     { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Math.max(16, width * 0.05), paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 20 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerLogo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoImg: { width: 36, height: 36 },
  brandName: { fontSize: 18, fontWeight: '800', color: G.primary },

  card: {
    backgroundColor: G.white, borderRadius: 24, padding: 22,
    elevation: 8, shadowColor: G.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12,
  },
  title:    { fontSize: Math.min(width * 0.065, 26), fontWeight: '800', color: G.text, marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#777', marginBottom: 22, lineHeight: 19 },

  typeBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, padding: 12, marginBottom: 12 },
  typeBannerGreen: { backgroundColor: G.light },
  typeBannerAmber: { backgroundColor: '#FFF3E0' },
  typeBannerText: { fontSize: 13, fontWeight: '700', flex: 1 },

  licenceCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: G.white, borderRadius: 16, padding: 16,
    borderWidth: 1.5, borderColor: G.border,
    elevation: 2, shadowColor: G.primary,
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4,
  },
  licenceIcon: { width: 56, height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  licenceInfo: { flex: 1 },
  licenceTitle: { fontSize: 15, fontWeight: '800', color: G.text, marginBottom: 4 },
  licenceDesc: { fontSize: 12, color: G.subtext, lineHeight: 17 },

  sectionLabel: {
    fontSize: 11, fontWeight: '800', color: G.primary, letterSpacing: 1.2,
    marginBottom: 14, marginTop: 8, paddingBottom: 6,
    borderBottomWidth: 1, borderBottomColor: G.border,
  },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: G.primary, letterSpacing: 1, marginBottom: 8, marginTop: 4 },
  input: {
    backgroundColor: G.light, borderRadius: 12, borderWidth: 1.5,
    borderColor: G.border, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 14, color: '#333', marginBottom: 12,
  },
  inputMulti: { minHeight: 80, paddingTop: 13 },
  row:     { flexDirection: 'row', gap: 12 },
  halfCol: { flex: 1 },

  typeGrid:           { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  typeChip:           { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, borderWidth: 1.5, borderColor: G.border, backgroundColor: G.light },
  typeChipActive:     { backgroundColor: G.primary, borderColor: G.primary },
  typeChipText:       { fontSize: 13, color: G.primary, fontWeight: '600' },
  typeChipTextActive: { color: '#fff' },

  approvalNote: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: '#FFF3E0', borderRadius: 10, padding: 12, marginBottom: 12,
  },
  approvalNoteText: { flex: 1, fontSize: 12, color: '#E65100', fontWeight: '500', lineHeight: 17 },

  promiseStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: G.light, borderRadius: 10, padding: 12, marginVertical: 16,
  },
  promiseStripText: { flex: 1, fontSize: 12, color: G.primary, fontWeight: '500', lineHeight: 17 },

  submitBtn: {
    backgroundColor: G.primary, borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    elevation: 6, shadowColor: G.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, marginBottom: 16,
  },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  btnDisabled:   { opacity: 0.6 },

  loginRow:  { flexDirection: 'row', justifyContent: 'center' },
  loginLabel: { fontSize: 14, color: '#777' },
  loginLink:  { fontSize: 14, color: G.primary, fontWeight: '700' },
});

export default SignupScreen;
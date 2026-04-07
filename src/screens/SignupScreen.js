import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { authAPI } from '../api';

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    FullName: '', Email: '', PhoneNumber: '', GSTNumber: '', termsAccepted: false,
  });
  const [validations, setValidations] = useState({ email: false, gst: false });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (field === 'Email') {
      setValidations({ ...validations, email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) });
    }
    if (field === 'GSTNumber') {
      setValidations({ ...validations, gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value) || value === '' });
    }
  };

  const handleCreateAccount = async () => {
    const { FullName, Email, PhoneNumber, GSTNumber, termsAccepted } = formData;

    if (!FullName || !Email || !PhoneNumber || !GSTNumber) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    if (!validations.email) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!termsAccepted) {
      Alert.alert('Terms Required', 'Please accept the terms and conditions.');
      return;
    }

    const cleanPhone = PhoneNumber.replace(/[\s\-\+]/g, '').replace(/^91/, '');
    if (cleanPhone.length !== 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    try {
      await authAPI.signup({ FullName, Email, PhoneNumber: cleanPhone, GSTNumber: GSTNumber.toUpperCase() });
      Alert.alert(
        'Account Created! 🎉',
        'Your business account has been registered. Please login with your phone number.',
        [{ text: 'Go to Login', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <LinearGradient colors={['#f5e6d3', '#e8dcc8', '#d4c4b0']} style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Register your business for wholesale pricing.</Text>

            {/* Full Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>FULL NAME</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="account" size={24} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#ccc"
                  value={formData.FullName}
                  onChangeText={(t) => handleInputChange('FullName', t)}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="email" size={24} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="john@spicehouse.com"
                  placeholderTextColor="#ccc"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.Email}
                  onChangeText={(t) => handleInputChange('Email', t)}
                />
                {validations.email && formData.Email
                  ? <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
                  : null
                }
              </View>
            </View>

            {/* Phone */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>PHONE NUMBER</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="phone" size={24} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="9876543210"
                  placeholderTextColor="#ccc"
                  keyboardType="phone-pad"
                  value={formData.PhoneNumber}
                  onChangeText={(t) => handleInputChange('PhoneNumber', t)}
                  maxLength={10}
                />
              </View>
            </View>

            {/* GST */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>GST NUMBER</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="shield-check" size={24} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="22AAAAA0000A1Z5"
                  placeholderTextColor="#ccc"
                  autoCapitalize="characters"
                  value={formData.GSTNumber}
                  onChangeText={(t) => handleInputChange('GSTNumber', t.toUpperCase())}
                />
                {validations.gst && formData.GSTNumber
                  ? <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
                  : null
                }
              </View>
              <Text style={styles.gstNote}>GST is mandatory for B2B wholesale access.</Text>
            </View>

            {/* Terms */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkbox, formData.termsAccepted && styles.checkboxChecked]}
                onPress={() => setFormData({ ...formData, termsAccepted: !formData.termsAccepted })}
              >
                {formData.termsAccepted && <MaterialCommunityIcons name="check" size={16} color="#b8721f" />}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>.
              </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleCreateAccount} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <>
                    <Text style={styles.buttonText}>Create Account</Text>
                    <MaterialCommunityIcons name="arrow-right" size={24} color="white" />
                  </>
              }
            </TouchableOpacity>

            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 30 },
  card: { backgroundColor: '#fff', borderRadius: 30, paddingHorizontal: 25, paddingVertical: 35, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 10 },
  title: { fontSize: 36, fontWeight: '700', color: '#1a1a1a', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30, lineHeight: 24 },
  fieldContainer: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '600', color: '#4a4a4a', marginBottom: 10, letterSpacing: 0.5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8f0f7', borderRadius: 15, paddingHorizontal: 15, height: 55 },
  inputIcon: { marginRight: 15 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  gstNote: { fontSize: 12, color: '#999', marginTop: 8, fontStyle: 'italic' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 25 },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderColor: '#ddd', borderRadius: 4, marginRight: 12, marginTop: 2, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#f5e0d8', borderColor: '#b8721f' },
  termsText: { flex: 1, fontSize: 14, color: '#4a4a4a', lineHeight: 22 },
  termsLink: { color: '#b8721f', fontWeight: '600' },
  button: { backgroundColor: '#a0621d', borderRadius: 20, height: 60, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10, elevation: 8 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  signInContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  signInText: { fontSize: 14, color: '#666' },
  signInLink: { fontSize: 14, color: '#b8721f', fontWeight: '600' },
});

export default SignupScreen;

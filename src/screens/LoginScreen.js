import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { authAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const otpInputs = useRef([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => setResendTimer((p) => p - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handlePhoneChange = (text) => {
    const digits = text.replace(/\D/g, '').slice(0, 10);
    setRawPhone(digits);
    setPhone(digits.replace(/(\d{5})(\d{1,5})/, '$1 $2'));
  };

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) otpInputs.current[index + 1]?.focus();
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async () => {
    if (rawPhone.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number.');
      return;
    }
    setLoading(true);
    try {
      const data = await authAPI.login(rawPhone);
      Alert.alert('OTP Sent', data.message + (data.otp ? `\n\n[DEV] OTP: ${data.otp}` : ''));
      setStep('otp');
      setResendTimer(30);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLogin = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      const data = await authAPI.verifyOTP(rawPhone, otpCode);
      await login(data.token, data.user);
      // Navigation handled by AppNavigator via auth state
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    otpInputs.current[0]?.focus();
    setLoading(true);
    try {
      const data = await authAPI.login(rawPhone);
      Alert.alert('OTP Resent', data.message + (data.otp ? `\n\n[DEV] OTP: ${data.otp}` : ''));
      setResendTimer(30);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <LinearGradient colors={['#f5e6d3', '#e8dcc8', '#d4c4b0']} style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.headerContainer}>
              <Text style={styles.brandName}>Bayo Masala</Text>
              <Text style={styles.subtitle}>SPICE WHOLESALERS LOGIN</Text>
            </View>

            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeText}>Enter your phone number to access your wholesale dashboard.</Text>

            {step === 'phone' ? (
              <>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>PHONE NUMBER</Text>
                  <View style={styles.phoneInputWrapper}>
                    <Text style={styles.countryCode}>+91</Text>
                    <TextInput
                      style={styles.phoneInput}
                      placeholder="98765 43210"
                      placeholderTextColor="#ccc"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={handlePhoneChange}
                      maxLength={11}
                    />
                  </View>
                </View>

                <TouchableOpacity style={styles.primaryButton} onPress={handleSendOtp} disabled={loading}>
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <>
                        <Text style={styles.primaryButtonText}>Send OTP</Text>
                        <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
                      </>
                  }
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>SECURE ACCESS</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.otpSectionContainer}>
                  <View style={styles.otpHeaderContainer}>
                    <Text style={styles.otpLabel}>ENTER OTP</Text>
                    {resendTimer > 0
                      ? <Text style={styles.resendTimer}>Resend in {resendTimer}s</Text>
                      : <TouchableOpacity onPress={handleResendOtp}>
                          <Text style={styles.resendLink}>Resend OTP</Text>
                        </TouchableOpacity>
                    }
                  </View>

                  <View style={styles.otpInputContainer}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(r) => (otpInputs.current[index] = r)}
                        style={styles.otpInput}
                        placeholder="0"
                        placeholderTextColor="#ddd"
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(t) => handleOtpChange(t, index)}
                        onKeyPress={(e) => handleOtpKeyPress(e, index)}
                      />
                    ))}
                  </View>
                </View>

                <TouchableOpacity style={styles.secondaryButton} onPress={handleVerifyLogin} disabled={loading}>
                  {loading
                    ? <ActivityIndicator color="#6b4c1f" />
                    : <Text style={styles.secondaryButtonText}>Verify & Login</Text>
                  }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStep('phone')}>
                  <Text style={styles.changePhoneText}>Use different number</Text>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.termsContainer}>
              <Text style={styles.termsSmallText}>
                BY LOGGING IN, YOU AGREE TO OUR{' '}
                <Text style={styles.termsLink}>WHOLESALE TERMS</Text>
              </Text>
            </View>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                New to Bayo Masala?{' '}
                <Text style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>
                  Register your business
                </Text>
              </Text>
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
  headerContainer: { alignItems: 'center', marginBottom: 30 },
  brandName: { fontSize: 36, fontWeight: '700', color: '#a0621d', fontStyle: 'italic' },
  subtitle: { fontSize: 12, color: '#333', marginTop: 5, letterSpacing: 2, fontWeight: '500' },
  welcomeTitle: { fontSize: 40, fontWeight: '700', color: '#1a1a1a', marginBottom: 15 },
  welcomeText: { fontSize: 16, color: '#666', marginBottom: 30, lineHeight: 24 },
  fieldContainer: { marginBottom: 25 },
  label: { fontSize: 11, fontWeight: '700', color: '#a0621d', marginBottom: 12, letterSpacing: 1.5 },
  phoneInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8f0f7', borderRadius: 15, paddingHorizontal: 15, height: 55 },
  countryCode: { fontSize: 16, color: '#333', marginRight: 10, fontWeight: '600' },
  phoneInput: { flex: 1, fontSize: 16, color: '#333' },
  primaryButton: { backgroundColor: '#a0621d', borderRadius: 20, height: 60, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 20, elevation: 8 },
  primaryButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#ddd' },
  dividerText: { marginHorizontal: 15, fontSize: 11, color: '#ccc', fontWeight: '600', letterSpacing: 1 },
  otpSectionContainer: { marginBottom: 25 },
  otpHeaderContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  otpLabel: { fontSize: 11, fontWeight: '700', color: '#1a1a1a', letterSpacing: 1.5 },
  resendTimer: { fontSize: 12, color: '#999' },
  resendLink: { fontSize: 12, color: '#a0621d', fontWeight: '600' },
  otpInputContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  otpInput: { width: 50, height: 55, borderRadius: 12, backgroundColor: '#e8f0f7', textAlign: 'center', fontSize: 24, fontWeight: '600', color: '#333', borderWidth: 1, borderColor: '#e0e0e0' },
  secondaryButton: { backgroundColor: '#f5c974', borderRadius: 20, height: 60, justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 6 },
  secondaryButtonText: { color: '#6b4c1f', fontSize: 18, fontWeight: '600' },
  changePhoneText: { textAlign: 'center', fontSize: 13, color: '#a0621d', marginTop: 15, fontWeight: '500' },
  termsContainer: { marginTop: 25, marginBottom: 20 },
  termsSmallText: { fontSize: 11, color: '#999', textAlign: 'center', letterSpacing: 0.3 },
  termsLink: { color: '#a0621d', fontWeight: '600', textDecorationLine: 'underline' },
  signupContainer: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 20 },
  signupText: { fontSize: 14, color: '#1a1a1a', textAlign: 'center' },
  signupLink: { color: '#a0621d', fontWeight: '700' },
});

export default LoginScreen;

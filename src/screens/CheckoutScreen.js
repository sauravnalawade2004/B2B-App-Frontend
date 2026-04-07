import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ScrollView, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { orderAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const CheckoutScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const cartData = route.params?.cartData || { items: [], subtotal: 0, tax: 0, total: 0 };
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: 'qrcode', description: 'GPay, PhonePe, Paytm' },
    { id: 'card', name: 'Credit / Debit Card', icon: 'credit-card', description: 'Visa, Mastercard, RuPay' },
    { id: 'netbanking', name: 'Net Banking', icon: 'bank', description: 'All major Indian banks' },
  ];

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      Alert.alert('Address Required', 'Please enter your delivery address.');
      return;
    }
    setLoading(true);
    try {
      const data = await orderAPI.place(address.trim(), selectedPayment);
      Alert.alert(
        'Order Placed! 🎉',
        `Your order ${data.order.orderId} has been placed successfully.`,
        [{ text: 'View Orders', onPress: () => navigation.navigate('Orders') }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#8B4513" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bayo Masala</Text>
        <MaterialCommunityIcons name="account-circle" size={32} color="#8B4513" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Checkout</Text>
          <Text style={styles.subtitle}>Review your details and confirm delivery.</Text>
        </View>

        {/* Personal Details (read-only from profile) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="account" size={20} color="#8B4513" />
            <Text style={styles.sectionTitle}>Personal Details</Text>
          </View>
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyLabel}>FULL NAME</Text>
            <Text style={styles.readOnlyValue}>{user?.FullName}</Text>
          </View>
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyLabel}>PHONE NUMBER</Text>
            <Text style={styles.readOnlyValue}>+91 {user?.PhoneNumber}</Text>
          </View>
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyLabel}>GST NUMBER</Text>
            <Text style={styles.readOnlyValue}>{user?.GSTNumber}</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#8B4513" />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Enter your warehouse or shop address..."
            placeholderTextColor="#bbb"
            multiline
            numberOfLines={4}
            value={address}
            onChangeText={setAddress}
          />
          <Text style={styles.helperText}>A detailed address helps our team deliver faster.</Text>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="credit-card" size={20} color="#8B4513" />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[styles.paymentMethod, selectedPayment === method.id && styles.paymentMethodActive]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.paymentContent}>
                <MaterialCommunityIcons name={method.icon} size={24} color="#8B4513" />
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentName}>{method.name}</Text>
                  <Text style={styles.paymentDesc}>{method.description}</Text>
                </View>
              </View>
              <View style={[styles.radioButton, selectedPayment === method.id && styles.radioButtonActive]}>
                {selectedPayment === method.id && <View style={styles.radioButtonDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          {cartData.items.map((item) => (
            <View key={item._id} style={styles.summaryItem}>
              <View style={[styles.itemThumbnail, { backgroundColor: item.product?.backgroundColor || '#FFD699' }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemSummaryName}>{item.product?.name}</Text>
                <Text style={styles.itemSummaryQty}>{item.quantity}{item.product?.unit} Bulk Pack</Text>
              </View>
              <Text style={styles.itemSummaryPrice}>₹{item.subtotal?.toLocaleString()}</Text>
            </View>
          ))}

          <View style={styles.pricingBreakdown}>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Subtotal</Text>
              <Text style={styles.pricingValue}>₹{cartData.subtotal?.toLocaleString()}</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>GST (5%)</Text>
              <Text style={styles.pricingValue}>₹{cartData.tax?.toLocaleString()}</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Shipping</Text>
              <Text style={[styles.pricingValue, { color: '#4CAF50' }]}>FREE</Text>
            </View>
            <View style={[styles.pricingRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>₹{cartData.total?.toLocaleString()}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <>
                  <MaterialCommunityIcons name="package-check" size={20} color="#fff" />
                  <Text style={styles.placeOrderText}>Place Order</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                </>
            }
          </TouchableOpacity>

          <View style={styles.securityNote}>
            <MaterialCommunityIcons name="shield-check" size={16} color="#666" />
            <Text style={styles.securityText}>Secure B2B Transaction</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#8B4513' },
  content: { flex: 1 },
  titleSection: { paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666' },
  section: { backgroundColor: '#e8f4f8', marginHorizontal: 16, marginVertical: 12, borderRadius: 12, padding: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  readOnlyField: { marginBottom: 12 },
  readOnlyLabel: { fontSize: 11, fontWeight: '700', color: '#999', marginBottom: 4, letterSpacing: 0.5 },
  readOnlyValue: { fontSize: 15, color: '#333', fontWeight: '500' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, color: '#333' },
  textarea: { textAlignVertical: 'top', minHeight: 100 },
  helperText: { fontSize: 12, color: '#999', marginTop: 8 },
  paymentMethod: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#ddd', borderRadius: 10, padding: 14, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentMethodActive: { borderColor: '#8B4513', backgroundColor: '#fff8f3' },
  paymentContent: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  paymentInfo: { flex: 1 },
  paymentName: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 2 },
  paymentDesc: { fontSize: 12, color: '#999' },
  radioButton: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ddd' },
  radioButtonActive: { borderColor: '#8B4513' },
  radioButtonDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#8B4513', margin: 3 },
  summarySection: { backgroundColor: '#e8f4f8', marginHorizontal: 16, marginVertical: 12, borderRadius: 12, padding: 16, marginBottom: 40 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  summaryItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, gap: 12 },
  itemThumbnail: { width: 45, height: 45, borderRadius: 8 },
  itemSummaryName: { fontSize: 13, fontWeight: '600', color: '#333' },
  itemSummaryQty: { fontSize: 11, color: '#999', marginTop: 2 },
  itemSummaryPrice: { fontSize: 14, fontWeight: '700', color: '#8B4513' },
  pricingBreakdown: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginTop: 12 },
  pricingRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  pricingLabel: { fontSize: 13, color: '#666' },
  pricingValue: { fontSize: 13, fontWeight: '600', color: '#333' },
  grandTotalRow: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12, marginTop: 4 },
  grandTotalLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  grandTotalValue: { fontSize: 18, fontWeight: 'bold', color: '#8B4513' },
  placeOrderBtn: { backgroundColor: '#8B4513', borderRadius: 12, paddingVertical: 16, marginTop: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  placeOrderText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  securityNote: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 12 },
  securityText: { fontSize: 12, color: '#666' },
});

export default CheckoutScreen;

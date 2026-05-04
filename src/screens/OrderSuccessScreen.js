// ─────────────────────────────────────────────────────────────────────────────
// OrderSuccessScreen.js — Confirmation screen after placing an order
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const OrderSuccessScreen = ({ navigation, route }) => {
  const { order } = route.params || {};

  if (!order) {
    navigation.replace('Home');
    return null;
  }

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const paymentStatusColor = order.paymentMethod === 'COD' ? '#E67E22' : '#27AE60';
  const paymentStatusLabel = order.paymentStatus;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Success banner ─────────────────────────────────────────────── */}
        <LinearGradient colors={['#C0612B', '#8B3A1A']} style={styles.successBanner}>
          <View style={styles.checkCircle}>
            <MaterialIcons name="check" size={48} color="#C0612B" />
          </View>
          <Text style={styles.successTitle}>Order Placed! 🎉</Text>
          <Text style={styles.successSub}>
            Thank you! Your order has been received and will be processed shortly.
          </Text>
        </LinearGradient>

        {/* ── Order ID card ──────────────────────────────────────────────── */}
        <View style={styles.orderIdCard}>
          <View style={styles.orderIdRow}>
            <Text style={styles.orderIdLabel}>Order ID</Text>
            <View style={styles.orderIdPill}>
              <Text style={styles.orderIdText}>{order.orderId}</Text>
            </View>
          </View>
          <View style={styles.orderIdRow}>
            <Text style={styles.orderIdLabel}>Date</Text>
            <Text style={styles.orderIdValue}>{formatDate(order.createdAt)}</Text>
          </View>
          <View style={styles.orderIdRow}>
            <Text style={styles.orderIdLabel}>Status</Text>
            <View style={styles.statusPill}>
              <View style={[styles.statusDot, { backgroundColor: '#27AE60' }]} />
              <Text style={[styles.statusText, { color: '#27AE60' }]}>{order.status}</Text>
            </View>
          </View>
        </View>

        {/* ── Order items ────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items Ordered</Text>
          {order.items.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <View style={[styles.itemThumb, { backgroundColor: item.backgroundColor || '#C0612B' }]}>
                <Text style={styles.itemThumbText}>{item.name.charAt(0)}</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemMeta}>{item.category} · {item.packSize}</Text>
                <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemAmt}>₹{item.subtotal.toLocaleString('en-IN')}</Text>
            </View>
          ))}
        </View>

        {/* ── Amount summary ─────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Summary</Text>
          {[
            { label: 'Subtotal', val: `₹${order.subtotal.toLocaleString('en-IN')}` },
            { label: 'GST (5%)', val: `₹${order.gst.toLocaleString('en-IN')}` },
            { label: 'Shipping', val: 'FREE', green: true },
          ].map((r) => (
            <View key={r.label} style={styles.amtRow}>
              <Text style={styles.amtLabel}>{r.label}</Text>
              <Text style={[styles.amtVal, r.green && styles.freeText]}>{r.val}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.amtRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalAmt}>₹{order.totalAmount.toLocaleString('en-IN')}</Text>
          </View>

          {/* Payment method + status */}
          <View style={styles.paymentRow}>
            <View style={styles.payMethodPill}>
              <MaterialCommunityIcons
                name={order.paymentMethod === 'COD' ? 'cash' : order.paymentMethod === 'UPI' ? 'qrcode' : 'bank'}
                size={14}
                color="#C0612B"
              />
              <Text style={styles.payMethodText}>{order.paymentMethod}</Text>
            </View>
            <View style={[styles.payStatusPill, { backgroundColor: paymentStatusColor + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: paymentStatusColor }]} />
              <Text style={[styles.payStatusText, { color: paymentStatusColor }]}>
                {paymentStatusLabel}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Delivery address ───────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Address</Text>
          <View style={styles.addressBlock}>
            <MaterialCommunityIcons name="map-marker" size={18} color="#C0612B" />
            <View style={styles.addressInfo}>
              <Text style={styles.addressName}>
                {order.customerInfo.customerName} · {order.customerInfo.businessName}
              </Text>
              <Text style={styles.addressType}>{order.customerInfo.businessType}</Text>
              <Text style={styles.addressText}>
                {order.customerInfo.address},{'\n'}
                {order.customerInfo.city} - {order.customerInfo.pincode}
              </Text>
              <Text style={styles.addressMobile}>📞 {order.customerInfo.mobile}</Text>
              {order.customerInfo.notes ? (
                <Text style={styles.addressNotes}>Note: {order.customerInfo.notes}</Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* ── BAYO promise ───────────────────────────────────────────────── */}
        <View style={styles.promiseBox}>
          <MaterialCommunityIcons name="shield-check" size={20} color="#C0612B" />
          <Text style={styles.promiseText}>
            No Preservatives · No MSG · No Added Colour · Premium Quality Guaranteed
          </Text>
        </View>

        {/* ── Action buttons ─────────────────────────────────────────────── */}
        <View style={styles.actionBtns}>
          <TouchableOpacity
            style={styles.viewOrdersBtn}
            onPress={() => navigation.navigate('Orders')}
          >
            <MaterialCommunityIcons name="receipt-text" size={18} color="#C0612B" />
            <Text style={styles.viewOrdersText}>View My Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <MaterialIcons name="storefront" size={18} color="#fff" />
            <Text style={styles.continueBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F2' },
  scroll: { paddingBottom: 40 },

  // ── Success banner ────────────────────────────────────────────────────────
  successBanner: {
    padding: 32,
    alignItems: 'center',
    paddingTop: 48,
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  successTitle: { fontSize: Math.min(width * 0.07, 28), fontWeight: '900', color: '#fff', marginBottom: 8 },
  successSub: { fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 20 },

  // ── Order ID card ─────────────────────────────────────────────────────────
  orderIdCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#C0612B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    gap: 10,
  },
  orderIdRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderIdLabel: { fontSize: 13, color: '#888', fontWeight: '600' },
  orderIdPill: { backgroundColor: '#FFF0E6', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  orderIdText: { fontSize: 14, fontWeight: '800', color: '#C0612B', letterSpacing: 0.5 },
  orderIdValue: { fontSize: 14, fontWeight: '600', color: '#333' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#EAF9EE', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusDot: { width: 7, height: 7, borderRadius: 3.5 },
  statusText: { fontSize: 12, fontWeight: '700' },

  // ── Shared card ───────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#C0612B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
  },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#2C1A0E', marginBottom: 14 },

  // ── Order items ───────────────────────────────────────────────────────────
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  // Adjust success screen item thumbnail size here ↓
  itemThumb: { width: 50, height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  itemThumbText: { fontSize: 20, fontWeight: '900', color: 'rgba(255,255,255,0.5)' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: '700', color: '#2C1A0E', marginBottom: 2 },
  itemMeta: { fontSize: 11, color: '#A0856B', marginBottom: 2 },
  itemQty: { fontSize: 12, color: '#8B4513', fontWeight: '600' },
  itemAmt: { fontSize: 14, fontWeight: '800', color: '#C0612B' },

  // ── Amount summary ────────────────────────────────────────────────────────
  amtRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  amtLabel: { fontSize: 13, color: '#777' },
  amtVal: { fontSize: 13, fontWeight: '600', color: '#333' },
  freeText: { color: '#27AE60', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F5E8D8', marginVertical: 10 },
  totalLabel: { fontSize: 15, fontWeight: '800', color: '#2C1A0E' },
  totalAmt: { fontSize: 20, fontWeight: '900', color: '#C0612B' },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  payMethodPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FFF0E6', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  payMethodText: { fontSize: 12, fontWeight: '700', color: '#C0612B' },
  payStatusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  payStatusText: { fontSize: 12, fontWeight: '700' },

  // ── Delivery address ──────────────────────────────────────────────────────
  addressBlock: { flexDirection: 'row', gap: 10 },
  addressInfo: { flex: 1 },
  addressName: { fontSize: 14, fontWeight: '700', color: '#2C1A0E', marginBottom: 2 },
  addressType: { fontSize: 12, color: '#C0612B', fontWeight: '600', marginBottom: 4 },
  addressText: { fontSize: 13, color: '#555', lineHeight: 18, marginBottom: 4 },
  addressMobile: { fontSize: 13, color: '#555', marginBottom: 4 },
  addressNotes: { fontSize: 12, color: '#A0856B', fontStyle: 'italic' },

  // ── Promise box ───────────────────────────────────────────────────────────
  promiseBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: '#FFF0E6',
    borderRadius: 12,
    padding: 12,
  },
  promiseText: { flex: 1, fontSize: 12, color: '#8B4513', fontWeight: '500', lineHeight: 16 },

  // ── Action buttons ────────────────────────────────────────────────────────
  actionBtns: { marginHorizontal: 12, marginTop: 20, gap: 12 },
  viewOrdersBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: '#C0612B',
  },
  viewOrdersText: { fontSize: 15, fontWeight: '700', color: '#C0612B' },
  continueBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#C0612B',
    borderRadius: 14,
    paddingVertical: 15,
    elevation: 4,
    shadowColor: '#C0612B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  continueBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});

export default OrderSuccessScreen;
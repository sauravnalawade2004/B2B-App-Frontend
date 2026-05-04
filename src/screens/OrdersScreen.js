// ─────────────────────────────────────────────────────────────────────────────
// OrdersScreen.js — Shows placed orders from local AsyncStorage / OrderContext
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TouchableOpacity, Dimensions, ActivityIndicator,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

const FILTERS = [
  { id: 'all', label: 'All Orders' },
  { id: 'recent', label: 'Recent (7 Days)' },
  { id: 'cod', label: 'COD' },
  { id: 'paid', label: 'Paid' },
];

const OrdersScreen = ({ navigation }) => {
  const { orders, ordersLoading } = useOrders();
  const { totalItems } = useCart();
  const [filter, setFilter] = useState('all');

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders;
    if (filter === 'recent') {
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return orders.filter((o) => new Date(o.createdAt).getTime() > cutoff);
    }
    if (filter === 'cod') return orders.filter((o) => o.paymentMethod === 'COD');
    if (filter === 'paid') return orders.filter((o) => o.paymentStatus === 'Paid');
    return orders;
  }, [orders, filter]);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const renderOrder = ({ item }) => {
    const paymentColor = item.paymentMethod === 'COD' ? '#E67E22' : '#27AE60';
    const isMulti = item.items.length > 1;

    return (
      <View style={styles.orderCard}>
        {/* Header row */}
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>{item.orderId}</Text>
            <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={styles.statusPill}>
            <View style={[styles.statusDot, { backgroundColor: '#27AE60' }]} />
            <Text style={[styles.statusText, { color: '#27AE60' }]}>{item.status}</Text>
          </View>
        </View>

        {/* Product list */}
        <View style={styles.productList}>
          {item.items.map((p, idx) => (
            <View key={idx} style={styles.productRow}>
              {/* Adjust order card thumbnail size here ↓ */}
              <View style={[styles.thumb, { backgroundColor: p.backgroundColor || '#C0612B' }]}>
                <Text style={styles.thumbText}>{p.name.charAt(0)}</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{p.name}</Text>
                <Text style={styles.productMeta}>{p.category} · Qty {p.quantity}</Text>
              </View>
              <Text style={styles.productAmt}>₹{p.subtotal.toLocaleString('en-IN')}</Text>
            </View>
          ))}
        </View>

        {/* Order totals */}
        <View style={styles.orderFooter}>
          <View style={styles.footerLeft}>
            <Text style={styles.itemCountText}>
              {item.items.length} product{item.items.length > 1 ? 's' : ''} · {item.items.reduce((s, p) => s + p.quantity, 0)} units
            </Text>
            <Text style={styles.totalText}>₹{item.totalAmount.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.footerRight}>
            {/* Payment method */}
            <View style={styles.payMethodPill}>
              <MaterialCommunityIcons
                name={item.paymentMethod === 'COD' ? 'cash' : item.paymentMethod === 'UPI' ? 'qrcode' : 'bank'}
                size={12}
                color="#C0612B"
              />
              <Text style={styles.payMethodText}>{item.paymentMethod}</Text>
            </View>
            {/* Payment status */}
            <View style={[styles.payStatusPill, { backgroundColor: paymentColor + '18' }]}>
              <View style={[styles.payStatusDot, { backgroundColor: paymentColor }]} />
              <Text style={[styles.payStatusText, { color: paymentColor }]}>{item.paymentStatus}</Text>
            </View>
          </View>
        </View>

        {/* Delivery address summary */}
        <View style={styles.addressRow}>
          <MaterialCommunityIcons name="map-marker-outline" size={14} color="#A0856B" />
          <Text style={styles.addressText} numberOfLines={1}>
            {item.customerInfo.businessName} · {item.customerInfo.city} - {item.customerInfo.pincode}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>My Orders</Text>
        <Text style={styles.topBarCount}>{orders.length} total</Text>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.filterTab, filter === f.id && styles.filterTabActive]}
            onPress={() => setFilter(f.id)}
          >
            <Text style={[styles.filterText, filter === f.id && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {ordersLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#C0612B" />
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="receipt-text-outline" size={70} color="#E8C9A8" />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyDesc}>
            {filter === 'all'
              ? 'Place your first order from our catalogue!'
              : 'No orders matching this filter.'}
          </Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shopBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        {[
          { label: 'Home', icon: 'home', screen: 'Home' },
          { label: 'Cart', icon: 'shopping-cart', screen: 'Cart', count: totalItems },
          { label: 'Orders', icon: 'receipt-long', screen: 'Orders', active: true },
          { label: 'Profile', icon: 'person-outline', screen: 'Profile' },
        ].map((t) => (
          <TouchableOpacity key={t.label} style={styles.navTab} onPress={() => navigation.navigate(t.screen)}>
            <View>
              <MaterialIcons name={t.icon} size={24} color={t.active ? '#C0612B' : '#AAA'} />
              {t.count > 0 && (
                <View style={styles.navBadge}><Text style={styles.navBadgeText}>{t.count}</Text></View>
              )}
            </View>
            <Text style={[styles.navLabel, t.active && styles.navLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F2' },

  // ── Top bar ───────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#C0612B',
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 4,
  },
  topBarTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  topBarCount: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  // ── Filters ───────────────────────────────────────────────────────────────
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E8D8',
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFF5EB',
    borderWidth: 1.5,
    borderColor: '#F5D5B5',
  },
  filterTabActive: { backgroundColor: '#C0612B', borderColor: '#C0612B' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#8B4513' },
  filterTextActive: { color: '#fff' },

  // ── Center / Empty ────────────────────────────────────────────────────────
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#2C1A0E', marginTop: 16, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#A0856B', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  shopBtn: { backgroundColor: '#C0612B', borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 },
  shopBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // ── Order list ────────────────────────────────────────────────────────────
  list: { padding: 12, paddingBottom: 90 },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#C0612B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  orderId: { fontSize: 16, fontWeight: '800', color: '#C0612B', letterSpacing: 0.3 },
  orderDate: { fontSize: 12, color: '#A0856B', marginTop: 2 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EAF9EE', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },

  // ── Product rows ──────────────────────────────────────────────────────────
  productList: { marginBottom: 12, gap: 8 },
  productRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  // Adjust order item thumbnail size here ↓
  thumb: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  thumbText: { fontSize: 18, fontWeight: '900', color: 'rgba(255,255,255,0.5)' },
  productInfo: { flex: 1 },
  productName: { fontSize: 13, fontWeight: '700', color: '#2C1A0E' },
  productMeta: { fontSize: 11, color: '#A0856B', marginTop: 1 },
  productAmt: { fontSize: 14, fontWeight: '800', color: '#C0612B' },

  // ── Footer ────────────────────────────────────────────────────────────────
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5E8D8',
    marginBottom: 8,
  },
  footerLeft: {},
  footerRight: { alignItems: 'flex-end', gap: 6 },
  itemCountText: { fontSize: 12, color: '#888' },
  totalText: { fontSize: 18, fontWeight: '900', color: '#C0612B', marginTop: 2 },

  payMethodPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF0E6', borderRadius: 14, paddingHorizontal: 9, paddingVertical: 4 },
  payMethodText: { fontSize: 11, fontWeight: '700', color: '#C0612B' },
  payStatusPill: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 14, paddingHorizontal: 9, paddingVertical: 4 },
  payStatusDot: { width: 6, height: 6, borderRadius: 3 },
  payStatusText: { fontSize: 11, fontWeight: '700' },

  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  addressText: { flex: 1, fontSize: 12, color: '#A0856B' },

  // ── Bottom nav ────────────────────────────────────────────────────────────
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F5E8D8',
    paddingVertical: 8,
    elevation: 8,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navTab: { flex: 1, alignItems: 'center', gap: 2 },
  navLabel: { fontSize: 11, color: '#AAA', fontWeight: '500' },
  navLabelActive: { color: '#C0612B' },
  navBadge: {
    position: 'absolute', top: -4, right: -6,
    backgroundColor: '#C0612B', borderRadius: 8,
    minWidth: 16, height: 16,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 2,
  },
  navBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
});

export default OrdersScreen;
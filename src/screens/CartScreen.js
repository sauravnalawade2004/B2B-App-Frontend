// ─────────────────────────────────────────────────────────────────────────────
// CartScreen.js — Green & White theme
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity,
  TextInput, Alert, Dimensions, Image,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

// ── Theme ─────────────────────────────────────────────────────────────────────
const G = {
  primary:  '#2E7D32',
  primary2: '#43A047',
  light:    '#E8F5E9',
  accent:   '#FF6F00',
  white:    '#FFFFFF',
  text:     '#1B2A1C',
  subtext:  '#5A7A5C',
  border:   '#C8E6C9',
};

const PAYMENT_METHODS = [
  { id: 'COD',           label: 'Cash on Delivery', icon: 'cash',   desc: 'Pay when your order arrives' },
  { id: 'UPI',           label: 'UPI',              icon: 'qrcode', desc: 'GPay, PhonePe, Paytm' },
  { id: 'Bank Transfer', label: 'Bank Transfer',    icon: 'bank',   desc: 'NEFT / IMPS / RTGS' },
];

const BUSINESS_TYPES = ['Hotel', 'Restaurant', 'Retailer', 'Wholesaler', 'Caterer'];

const CartItemImage = ({ item }) => {
  if (item.product.image) {
    return <Image source={item.product.image} style={styles.itemImg} resizeMode="cover" />;
  }
  return (
    <View style={[styles.itemImg, { backgroundColor: item.product.backgroundColor || G.primary }]}>
      <Text style={styles.itemImgText}>{item.product.name.charAt(0)}</Text>
    </View>
  );
};

// Bottom nav helper
const BottomNav = ({ navigation, active }) => {
  const { totalItems } = useCart();
  return (
    <View style={styles.bottomNav}>
      {[
        { label: 'Home',    icon: 'home',          screen: 'Home' },
        { label: 'Cart',    icon: 'shopping-cart',  screen: 'Cart',    count: totalItems },
        { label: 'Orders',  icon: 'receipt-long',   screen: 'Orders' },
        { label: 'Profile', icon: 'person-outline', screen: 'Profile' },
      ].map((t) => (
        <TouchableOpacity key={t.label} style={styles.navTab} onPress={() => navigation.navigate(t.screen)}>
          <View>
            <MaterialIcons name={t.icon} size={24} color={t.screen === active ? G.primary : '#AAA'} />
            {t.count > 0 && (
              <View style={styles.navBadge}><Text style={styles.navBadgeText}>{t.count}</Text></View>
            )}
          </View>
          <Text style={[styles.navLabel, t.screen === active && styles.navLabelActive]}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const CartScreen = ({ navigation }) => {
  const { user } = useAuth();
  const {
    cartItems, totalItems, totalQuantity, subtotal, gst, totalAmount,
    updateQuantity, removeFromCart, clearCart,
  } = useCart();
  const { placeOrder } = useOrders();

  const [form, setForm] = useState({
    customerName: user?.fullName    || '',
    businessName: user?.businessName || '',
    businessType: user?.businessType || '',
    mobile:       user?.mobile       || '',
    address:      user?.address      || '',
    city:         user?.city         || '',
    pincode:      user?.pincode      || '',
    notes:        '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const validateCheckout = () => {
    if (!form.customerName.trim()) return 'Please enter customer name.';
    if (!form.businessName.trim()) return 'Please enter business name.';
    if (!form.businessType)        return 'Please select business type.';
    if (form.mobile.replace(/\D/g, '').length !== 10) return 'Please enter a valid 10-digit mobile.';
    if (!form.address.trim())      return 'Please enter delivery address.';
    if (!form.city.trim())         return 'Please enter city.';
    if (form.pincode.replace(/\D/g, '').length !== 6) return 'Please enter a valid 6-digit pincode.';
    return null;
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) { Alert.alert('Empty Cart', 'Add products first.'); return; }
    const err = validateCheckout();
    if (err) { Alert.alert('Incomplete Details', err); return; }

    setPlacing(true);
    try {
      const order = await placeOrder({ cartItems, customerInfo: { ...form }, paymentMethod, subtotal, gst, totalAmount });
      await clearCart();
      navigation.navigate('OrderSuccess', { order });
    } catch (e) {
      Alert.alert('Error', e.message || 'Something went wrong.');
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Your Cart</Text>
        </View>
        <View style={styles.emptyState}>
          <MaterialIcons name="shopping-cart" size={72} color={G.border} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyDesc}>Add products from the catalogue to get started.</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.browseBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
        <BottomNav navigation={navigation} active="Cart" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Your Cart</Text>
        <View style={styles.itemCountPill}>
          <Text style={styles.itemCountText}>{totalItems} item{totalItems > 1 ? 's' : ''}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── Cart items ─────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <MaterialCommunityIcons name="cart-outline" size={16} color={G.primary} /> Cart Items
          </Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <CartItemImage item={item} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
                <Text style={styles.itemCat}>{item.product.category} · {item.product.packSize}</Text>
                {item.product.selectedVariant && (
                  <Text style={styles.itemVariant}>Pack: {item.product.selectedVariant}</Text>
                )}
                <Text style={styles.itemPrice}>₹{item.product.price} / {item.product.unit}</Text>
                <View style={styles.qtyRow}>
                  <View style={styles.qtyBox}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => {
                        if (item.quantity === 1) {
                          Alert.alert('Remove Item', `Remove ${item.product.name}?`, [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id) },
                          ]);
                        } else {
                          updateQuantity(item.id, item.quantity - 1);
                        }
                      }}
                    >
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyVal}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCart(item.id)}>
                    <MaterialIcons name="delete-outline" size={20} color="#E74C3C" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.itemSubtotal}>
                <Text style={styles.subtotalLabel}>Subtotal</Text>
                <Text style={styles.subtotalAmt}>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Order Summary ──────────────────────────────────────────────── */}
        <View style={styles.summaryBox}>
          <Text style={styles.sectionTitle}>
            <MaterialCommunityIcons name="receipt" size={16} color={G.primary} /> Order Summary
          </Text>
          {[
            { label: 'Total Items',    val: `${totalItems} product${totalItems > 1 ? 's' : ''}` },
            { label: 'Total Quantity', val: `${totalQuantity} unit${totalQuantity > 1 ? 's' : ''}` },
            { label: 'Subtotal',       val: `₹${subtotal.toLocaleString('en-IN')}` },
            { label: 'GST (5%)',       val: `₹${gst.toLocaleString('en-IN')}` },
            { label: 'Shipping',       val: 'FREE', green: true },
          ].map((r) => (
            <View key={r.label} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{r.label}</Text>
              <Text style={[styles.summaryVal, r.green && styles.freeText]}>{r.val}</Text>
            </View>
          ))}
          <View style={styles.totalDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalAmt}>₹{totalAmount.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* ── Checkout form ──────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <MaterialCommunityIcons name="map-marker" size={16} color={G.primary} /> Delivery Details
          </Text>

          <Text style={styles.fieldLabel}>CUSTOMER NAME *</Text>
          <TextInput style={styles.input} placeholder="Full name" placeholderTextColor="#A5C9A7" value={form.customerName} onChangeText={(v) => set('customerName', v)} />

          <Text style={styles.fieldLabel}>BUSINESS NAME *</Text>
          <TextInput style={styles.input} placeholder="Hotel / Restaurant name" placeholderTextColor="#A5C9A7" value={form.businessName} onChangeText={(v) => set('businessName', v)} />

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

          <Text style={styles.fieldLabel}>MOBILE NUMBER *</Text>
          <TextInput style={styles.input} placeholder="10-digit mobile" placeholderTextColor="#A5C9A7" keyboardType="phone-pad" maxLength={10} value={form.mobile} onChangeText={(v) => set('mobile', v.replace(/\D/g, '').slice(0, 10))} />

          <Text style={styles.fieldLabel}>DELIVERY ADDRESS *</Text>
          <TextInput style={[styles.input, styles.inputMulti]} placeholder="Shop / hotel address" placeholderTextColor="#A5C9A7" multiline numberOfLines={3} textAlignVertical="top" value={form.address} onChangeText={(v) => set('address', v)} />

          <View style={styles.row}>
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>CITY *</Text>
              <TextInput style={styles.input} placeholder="City" placeholderTextColor="#A5C9A7" value={form.city} onChangeText={(v) => set('city', v)} />
            </View>
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>PINCODE *</Text>
              <TextInput style={styles.input} placeholder="6-digit" placeholderTextColor="#A5C9A7" keyboardType="number-pad" maxLength={6} value={form.pincode} onChangeText={(v) => set('pincode', v.replace(/\D/g, '').slice(0, 6))} />
            </View>
          </View>

          <Text style={styles.fieldLabel}>ORDER NOTES (OPTIONAL)</Text>
          <TextInput style={[styles.input, styles.inputMulti]} placeholder="Any special instructions..." placeholderTextColor="#A5C9A7" multiline numberOfLines={2} textAlignVertical="top" value={form.notes} onChangeText={(v) => set('notes', v)} />
        </View>

        {/* ── Payment Method ─────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <MaterialCommunityIcons name="credit-card" size={16} color={G.primary} /> Payment Method
          </Text>
          {PAYMENT_METHODS.map((pm) => (
            <TouchableOpacity
              key={pm.id}
              style={[styles.paymentCard, paymentMethod === pm.id && styles.paymentCardActive]}
              onPress={() => setPaymentMethod(pm.id)}
            >
              <View style={styles.paymentLeft}>
                <MaterialCommunityIcons name={pm.icon} size={22} color={G.primary} />
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentLabel}>{pm.label}</Text>
                  <Text style={styles.paymentDesc}>{pm.desc}</Text>
                </View>
              </View>
              <View style={[styles.radio, paymentMethod === pm.id && styles.radioActive]}>
                {paymentMethod === pm.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Final total + Place order ──────────────────────────────────── */}
        <View style={{ marginHorizontal: 12, marginTop: 12, marginBottom: 20 }}>
          <View style={styles.finalSummary}>
            <View>
              <Text style={styles.finalLabel}>Grand Total</Text>
              <Text style={styles.finalAmt}>₹{totalAmount.toLocaleString('en-IN')}</Text>
            </View>
            <View>
              <Text style={styles.finalLabel}>Payment</Text>
              <Text style={[styles.finalLabel, { color: G.primary, fontWeight: '700' }]}>{paymentMethod}</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.placeOrderBtn, placing && styles.btnDisabled]} onPress={handlePlaceOrder} disabled={placing}>
            {placing
              ? <Text style={styles.placeOrderText}>Placing Order…</Text>
              : <>
                  <MaterialCommunityIcons name="package-check" size={20} color="#fff" />
                  <Text style={styles.placeOrderText}>Place Order</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                </>
            }
          </TouchableOpacity>

          <View style={styles.secureNote}>
            <MaterialCommunityIcons name="shield-check" size={14} color={G.subtext} />
            <Text style={styles.secureText}>Secure B2B Transaction · No Preservatives · No MSG</Text>
          </View>
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} active="Cart" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: G.light },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: G.primary, paddingHorizontal: 16, paddingVertical: 14, elevation: 4,
  },
  topBarTitle:   { fontSize: 20, fontWeight: '800', color: '#fff' },
  itemCountPill: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 5 },
  itemCountText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  emptyState:    { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle:    { fontSize: 20, fontWeight: '800', color: G.text, marginTop: 16, marginBottom: 8 },
  emptyDesc:     { fontSize: 14, color: G.subtext, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  browseBtn:     { backgroundColor: G.primary, borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 },
  browseBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  section: {
    backgroundColor: G.white, marginHorizontal: 12, marginTop: 12,
    borderRadius: 16, padding: 16, elevation: 2,
    shadowColor: G.primary, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 6,
  },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: G.text, marginBottom: 14 },

  cartItem: {
    flexDirection: 'row', gap: 10,
    paddingBottom: 14, marginBottom: 14,
    borderBottomWidth: 1, borderBottomColor: G.border,
  },
  itemImg:      { width: 80, height: 80, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  itemImgText:  { fontSize: 26, fontWeight: '900', color: 'rgba(255,255,255,0.5)' },
  itemInfo:     { flex: 1 },
  itemName:     { fontSize: 14, fontWeight: '700', color: G.text, marginBottom: 2 },
  itemCat:      { fontSize: 11, color: G.subtext, marginBottom: 2 },
  itemVariant:  { fontSize: 11, color: G.primary, fontWeight: '600', marginBottom: 2 },
  itemPrice:    { fontSize: 13, color: G.accent, fontWeight: '600', marginBottom: 8 },

  qtyRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBox:  { flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1.5, borderColor: G.primary, overflow: 'hidden' },
  qtyBtn:  { width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: G.primary },
  qtyBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  qtyVal:  { fontSize: 14, fontWeight: '800', color: G.primary, paddingHorizontal: 12 },
  removeBtn: { padding: 4 },

  itemSubtotal:  { alignItems: 'flex-end', justifyContent: 'flex-start', paddingTop: 4 },
  subtotalLabel: { fontSize: 10, color: G.subtext, fontWeight: '600', marginBottom: 3 },
  subtotalAmt:   { fontSize: 15, fontWeight: '800', color: G.accent },

  summaryBox: {
    backgroundColor: G.white, marginHorizontal: 12, marginTop: 12,
    borderRadius: 16, padding: 16, elevation: 2,
    shadowColor: G.primary, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 6,
  },
  summaryRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 13, color: '#777' },
  summaryVal:   { fontSize: 13, fontWeight: '600', color: '#333' },
  freeText:     { color: '#27AE60', fontWeight: '700' },
  totalDivider: { height: 1, backgroundColor: G.border, marginVertical: 10 },
  totalLabel:   { fontSize: 15, fontWeight: '800', color: G.text },
  totalAmt:     { fontSize: 18, fontWeight: '800', color: G.accent },

  fieldLabel: { fontSize: 11, fontWeight: '700', color: G.primary, letterSpacing: 1, marginBottom: 8, marginTop: 4 },
  input: {
    backgroundColor: G.light, borderRadius: 12, borderWidth: 1.5,
    borderColor: G.border, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#333', marginBottom: 12,
  },
  inputMulti: { minHeight: 76, paddingTop: 12, marginBottom: 12 },
  row:     { flexDirection: 'row', gap: 10 },
  halfCol: { flex: 1 },

  typeGrid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  typeChip:          { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: G.border, backgroundColor: G.light },
  typeChipActive:    { backgroundColor: G.primary, borderColor: G.primary },
  typeChipText:      { fontSize: 13, color: G.primary, fontWeight: '600' },
  typeChipTextActive: { color: '#fff' },

  paymentCard:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 14, borderWidth: 2, borderColor: G.border, padding: 14, marginBottom: 10, backgroundColor: G.light },
  paymentCardActive: { borderColor: G.primary, backgroundColor: '#F1F8E9' },
  paymentLeft:       { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  paymentInfo:       { flex: 1 },
  paymentLabel:      { fontSize: 15, fontWeight: '700', color: G.text, marginBottom: 2 },
  paymentDesc:       { fontSize: 12, color: G.subtext },
  radio:             { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
  radioActive:       { borderColor: G.primary },
  radioDot:          { width: 11, height: 11, borderRadius: 5.5, backgroundColor: G.primary },

  finalSummary: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: G.white, borderRadius: 14, padding: 16, marginBottom: 14,
    borderWidth: 1.5, borderColor: G.border, elevation: 2,
  },
  finalLabel: { fontSize: 14, fontWeight: '700', color: '#777' },
  finalAmt:   { fontSize: 22, fontWeight: '900', color: G.accent },

  placeOrderBtn: {
    backgroundColor: G.primary, borderRadius: 16, paddingVertical: 18,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    elevation: 6, shadowColor: G.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, marginBottom: 10,
  },
  placeOrderText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  btnDisabled:    { opacity: 0.6 },
  secureNote:     { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  secureText:     { fontSize: 12, color: G.subtext, fontWeight: '500' },

  bottomNav: {
    flexDirection: 'row', backgroundColor: G.white,
    borderTopWidth: 1, borderTopColor: G.border,
    paddingVertical: 8, elevation: 8,
    position: 'absolute', bottom: 0, width: '100%',
  },
  navTab:         { flex: 1, alignItems: 'center', gap: 2 },
  navLabel:       { fontSize: 11, color: '#AAA', fontWeight: '500' },
  navLabelActive: { color: G.primary },
  navBadge: {
    position: 'absolute', top: -4, right: -6,
    backgroundColor: G.primary, borderRadius: 8,
    minWidth: 16, height: 16,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 2,
  },
  navBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
});

export default CartScreen;
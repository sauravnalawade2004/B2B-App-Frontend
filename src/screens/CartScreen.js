import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TouchableOpacity, ActivityIndicator, Alert, RefreshControl, ScrollView,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { cartAPI } from '../api';

const CartScreen = ({ navigation }) => {
  const [cartData, setCartData] = useState({ items: [], subtotal: 0, tax: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const data = await cartAPI.get();
      setCartData(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const handleQuantityChange = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) {
      Alert.alert('Remove Item', `Remove ${item.product.name} from cart?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => handleRemove(item._id) },
      ]);
      return;
    }
    if (newQty < item.product.moq) {
      Alert.alert('MOQ Required', `Minimum order quantity is ${item.product.moq}${item.product.unit}`);
      return;
    }
    setUpdatingId(item._id);
    try {
      await cartAPI.update(item._id, newQty);
      await fetchCart();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (itemId) => {
    setUpdatingId(itemId);
    try {
      await cartAPI.remove(itemId);
      await fetchCart();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={[styles.itemImage, { backgroundColor: item.product.backgroundColor || '#FFD699' }]} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.product.name}</Text>
        <View style={styles.gradeContainer}>
          <MaterialCommunityIcons name="star" size={12} color="#8B4513" />
          <Text style={styles.gradeText}>{item.product.grade}</Text>
        </View>
        {item.product.badge && (
          <Text style={styles.badgeLabel}>{item.product.badge}</Text>
        )}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => handleQuantityChange(item, -1)}
            style={styles.quantityBtn}
            disabled={updatingId === item._id}
          >
            <Text style={styles.quantityBtnText}>−</Text>
          </TouchableOpacity>
          <View style={styles.quantityDisplay}>
            {updatingId === item._id
              ? <ActivityIndicator size="small" color="#8B4513" />
              : <Text style={styles.quantityValue}>{item.quantity}{item.product.unit}</Text>
            }
          </View>
          <TouchableOpacity
            onPress={() => handleQuantityChange(item, 1)}
            style={styles.quantityBtn}
            disabled={updatingId === item._id}
          >
            <Text style={styles.quantityBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.itemPrice}>₹{item.subtotal?.toLocaleString()}</Text>
        <Text style={styles.unitPrice}>₹{item.product.price}/{item.product.unit}</Text>
        <TouchableOpacity onPress={() => handleRemove(item._id)} style={styles.removeBtn}>
          <MaterialIcons name="delete-outline" size={20} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#8B4513" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bayo Masala</Text>
        <MaterialCommunityIcons name="account-circle" size={32} color="#8B4513" />
      </View>

      <View style={styles.cartHeader}>
        <Text style={styles.cartTitle}>Your Procurement Cart</Text>
        <View style={styles.itemCount}>
          <Text style={styles.countText}>{cartData.items.length} Items</Text>
        </View>
      </View>

      {cartData.items.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons name="shopping-cart" size={64} color="#ddd" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shopBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCart(); }} colors={['#8B4513']} />}
        >
          <FlatList
            data={cartData.items}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            scrollEnabled={false}
          />

          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Order Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.label}>Subtotal</Text>
              <Text style={styles.value}>₹{cartData.subtotal?.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Tax (GST 5%)</Text>
              <Text style={styles.value}>₹{cartData.tax?.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Shipping (Express Bulk)</Text>
              <Text style={[styles.value, { color: '#4CAF50' }]}>FREE</Text>
            </View>

            <View style={styles.deliveryInfo}>
              <MaterialCommunityIcons name="truck-fast" size={20} color="#8B4513" />
              <Text style={styles.deliveryText}>
                Your bulk order qualifies for Next-Day Priority Delivery.
              </Text>
            </View>

            <View style={styles.summaryTotalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{cartData.total?.toLocaleString()}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => navigation.navigate('Checkout', { cartData })}
            >
              <Text style={styles.checkoutText}>Proceed to Order</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <MaterialCommunityIcons name="home" size={24} color="#999" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="shopping-cart" size={24} color="#8B4513" />
          <Text style={[styles.navLabel, { color: '#8B4513' }]}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Orders')}>
          <MaterialCommunityIcons name="calendar-check" size={24} color="#999" />
          <Text style={styles.navLabel}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <MaterialCommunityIcons name="account-circle" size={24} color="#999" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#8B4513' },
  cartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  cartTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  itemCount: { backgroundColor: '#FFE4D6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  countText: { fontSize: 12, fontWeight: '600', color: '#8B4513' },
  list: { padding: 16 },
  cartItem: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row', gap: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 3 },
  itemImage: { width: 90, height: 90, borderRadius: 10 },
  itemDetails: { flex: 1, gap: 6 },
  itemName: { fontSize: 15, fontWeight: '600', color: '#333' },
  gradeContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  gradeText: { fontSize: 11, color: '#666' },
  badgeLabel: { fontSize: 10, fontWeight: '700', color: '#fff', backgroundColor: '#8B4513', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 20, width: 130 },
  quantityBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  quantityBtnText: { fontSize: 18, fontWeight: 'bold', color: '#8B4513' },
  quantityDisplay: { flex: 1, alignItems: 'center', minHeight: 20 },
  quantityValue: { fontSize: 13, fontWeight: '600', color: '#333' },
  priceContainer: { justifyContent: 'space-between', alignItems: 'flex-end', paddingVertical: 4 },
  itemPrice: { fontSize: 15, fontWeight: '700', color: '#8B4513' },
  unitPrice: { fontSize: 11, color: '#999' },
  removeBtn: { padding: 4 },
  summarySection: { backgroundColor: '#e8f4f8', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: 14, color: '#666' },
  value: { fontSize: 14, fontWeight: '600', color: '#333' },
  deliveryInfo: { backgroundColor: '#FFE4D6', borderRadius: 10, padding: 12, marginVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  deliveryText: { fontSize: 13, color: '#333', flex: 1, fontWeight: '500' },
  summaryTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#ccc', marginTop: 12 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#8B4513' },
  checkoutBtn: { backgroundColor: '#8B4513', paddingVertical: 16, borderRadius: 12, marginTop: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  checkoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 16, marginBottom: 20 },
  shopBtn: { backgroundColor: '#8B4513', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  shopBtnText: { color: '#fff', fontWeight: '600' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 10, position: 'absolute', bottom: 0, width: '100%' },
  navItem: { alignItems: 'center', paddingVertical: 4 },
  navLabel: { fontSize: 11, marginTop: 4, color: '#999', fontWeight: '500' },
});

export default CartScreen;

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TouchableOpacity, ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { orderAPI } from '../api';

const OrdersScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('recent');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const filters = [
    { id: 'recent', label: 'Recent (30 Days)' },
    { id: 'pending', label: 'Pending' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'all', label: 'All' },
  ];

  const fetchOrders = useCallback(async () => {
    try {
      const data = await orderAPI.getAll(selectedFilter);
      setOrders(data.orders);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return '#34D399';
      case 'PENDING': return '#F87171';
      case 'APPROVED': return '#60A5FA';
      case 'PACKED': return '#FBBF24';
      case 'OUT_FOR_DELIVERY': return '#A78BFA';
      case 'CANCELLED': return '#9CA3AF';
      default: return '#999';
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{item.orderId}</Text>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.orderDate}>Placed on {formatDate(item.createdAt)}</Text>

      <View style={styles.productSection}>
        <View style={[styles.productThumbnail, { backgroundColor: item.items[0]?.product?.backgroundColor || '#FFD699' }]} />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.items[0]?.name}</Text>
          {item.items.length > 1 && (
            <Text style={styles.moreItems}>+{item.items.length - 1} more items</Text>
          )}
          <Text style={styles.productAmount}>₹{item.total?.toLocaleString('en-IN')}</Text>
          <Text style={styles.itemCount}>({item.items.length} item{item.items.length > 1 ? 's' : ''})</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        {item.status !== 'DELIVERED' && item.status !== 'CANCELLED' && (
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('TrackOrder', { orderId: item._id })}
          >
            <MaterialCommunityIcons name="truck-check" size={16} color="#fff" />
            <Text style={styles.btnPrimaryText}>Track Order</Text>
          </TouchableOpacity>
        )}
        {item.status === 'DELIVERED' && (
          <TouchableOpacity style={styles.btnSecondary}>
            <MaterialCommunityIcons name="refresh" size={16} color="#8B4513" />
            <Text style={styles.btnSecondaryText}>Reorder</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.btnSecondary}>
          <MaterialCommunityIcons name="file-document" size={16} color="#8B4513" />
          <Text style={styles.btnSecondaryText}>Invoice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <MaterialIcons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bayo Masala</Text>
        <MaterialCommunityIcons name="account-circle" size={32} color="#8B4513" />
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.title}>Order History</Text>
        <Text style={styles.subtitle}>Manage your bulk procurement and track shipments.</Text>
      </View>

      <View style={styles.tabsContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            onPress={() => setSelectedFilter(filter.id)}
            style={[styles.tab, selectedFilter === filter.id && styles.tabActive]}
          >
            <Text style={[styles.tabText, selectedFilter === filter.id && styles.tabTextActive]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#8B4513" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons name="package-variant" size={64} color="#ddd" />
          <Text style={styles.emptyText}>No orders found</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchOrders(); }} colors={['#8B4513']} />
          }
        />
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <MaterialCommunityIcons name="home" size={24} color="#999" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Cart')}>
          <MaterialIcons name="shopping-cart" size={24} color="#999" />
          <Text style={styles.navLabel}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="calendar-check" size={24} color="#8B4513" />
          <Text style={[styles.navLabel, { color: '#8B4513' }]}>Orders</Text>
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
  titleSection: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#666' },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab: { paddingVertical: 6, paddingHorizontal: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#8B4513' },
  tabText: { fontSize: 12, color: '#999', fontWeight: '500' },
  tabTextActive: { color: '#8B4513', fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 80 },
  orderCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 3 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, backgroundColor: '#f5f5f5' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  orderDate: { fontSize: 12, color: '#999', marginBottom: 12 },
  productSection: { flexDirection: 'row', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
  productThumbnail: { width: 65, height: 65, borderRadius: 10 },
  productInfo: { flex: 1 },
  productName: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 2 },
  moreItems: { fontSize: 11, color: '#8B4513', marginBottom: 2 },
  productAmount: { fontSize: 15, fontWeight: 'bold', color: '#8B4513' },
  itemCount: { fontSize: 12, color: '#999' },
  actionButtons: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  btnPrimary: { backgroundColor: '#8B4513', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' },
  btnPrimaryText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  btnSecondary: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#8B4513', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' },
  btnSecondaryText: { color: '#8B4513', fontWeight: '600', fontSize: 13 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 16, marginBottom: 20 },
  shopBtn: { backgroundColor: '#8B4513', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  shopBtnText: { color: '#fff', fontWeight: '600' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 10, position: 'absolute', bottom: 0, width: '100%' },
  navItem: { alignItems: 'center', paddingVertical: 4 },
  navLabel: { fontSize: 11, marginTop: 4, color: '#999', fontWeight: '500' },
});

export default OrdersScreen;

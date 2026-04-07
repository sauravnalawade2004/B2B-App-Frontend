import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, FlatList, Dimensions, SafeAreaView,
  ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { productAPI, cartAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [addingId, setAddingId] = useState(null);

  const categories = ['All', 'Spices', 'Powder', 'Whole'];

  const fetchProducts = useCallback(async () => {
    try {
      const data = await productAPI.getAll(selectedCategory, search);
      setProducts(data.products);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, search]);

  const fetchCartCount = useCallback(async () => {
    try {
      const data = await cartAPI.get();
      setCartCount(data.items?.length || 0);
    } catch (_) {}
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchCartCount(); }, [fetchCartCount]);

  const handleAddToCart = async (product) => {
    setAddingId(product._id);
    try {
      await cartAPI.add(product._id, product.moq);
      setCartCount((c) => c + 1);
      Alert.alert('Added to Cart', `${product.name} (${product.moq}${product.unit}) added!`);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setAddingId(null);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={[styles.productImage, { backgroundColor: item.backgroundColor }]} />
      <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.gradeText}>{item.grade}</Text>
      <Text style={styles.moqText}>MOQ: {item.moq}{item.unit}</Text>
      <Text style={styles.priceText}>₹{item.price}/{item.unit}</Text>
      {item.badge && (
        <View style={styles.badgeTag}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}
      <TouchableOpacity
        style={[styles.addToCartBtn, addingId === item._id && styles.addingBtn]}
        onPress={() => handleAddToCart(item)}
        disabled={addingId === item._id}
      >
        {addingId === item._id
          ? <ActivityIndicator size="small" color="#fff" />
          : <>
              <MaterialIcons name="shopping-cart" size={16} color="#fff" />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </>
        }
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <MaterialIcons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bayo Masala</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <MaterialCommunityIcons name="account-circle" size={32} color="#8B4513" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8B4513']} />}
      >
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>Hello, {user?.FullName?.split(' ')[0]} 👋</Text>
          <Text style={styles.subText}>Ready for your bulk spice procurement today?</Text>
        </View>

        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#999" />
          <TextInput
            placeholder="Search premium spices, herbs..."
            placeholderTextColor="#bbb"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            onSubmitEditing={fetchProducts}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialIcons name="clear" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.categoryBtn, selectedCategory === cat && styles.categoryBtnActive]}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <LinearGradient
          colors={['rgba(139, 69, 19, 0.9)', 'rgba(101, 50, 15, 0.9)']}
          style={styles.promotionBanner}
        >
          <View style={styles.promotionContent}>
            <Text style={styles.seasonalLabel}>SEASONAL SPECIAL</Text>
            <Text style={styles.promotionTitle}>Premium Guntur Sannam</Text>
            <Text style={styles.promotionDesc}>Best rates for bulk orders over 50kg this month.</Text>
          </View>
          <MaterialCommunityIcons name="fire" size={60} color="rgba(255, 165, 0, 0.8)" />
        </LinearGradient>

        <View style={styles.catalogHeader}>
          <Text style={styles.catalogTitle}>Wholesale Catalog</Text>
          <Text style={styles.countText}>{products.length} products</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#8B4513" style={{ marginTop: 40 }} />
        ) : products.length === 0 ? (
          <View style={styles.empty}>
            <MaterialCommunityIcons name="package-variant" size={60} color="#ddd" />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <MaterialCommunityIcons name="home" size={24} color="#8B4513" />
          <Text style={[styles.navLabel, { color: '#8B4513' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Cart')}>
          <View>
            <MaterialIcons name="shopping-cart" size={24} color="#999" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeNum}>{cartCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.navLabel}>Cart</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#8B4513' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  greetingSection: { marginBottom: 20 },
  greetingText: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subText: { fontSize: 14, color: '#666' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10, marginBottom: 20 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#333' },
  categoryScroll: { marginBottom: 20 },
  categoryBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 10 },
  categoryBtnActive: { backgroundColor: '#8B4513' },
  categoryText: { color: '#666', fontWeight: '600', fontSize: 14 },
  categoryTextActive: { color: '#fff' },
  promotionBanner: { borderRadius: 15, padding: 20, marginBottom: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  promotionContent: { flex: 1 },
  seasonalLabel: { color: '#ffb366', fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginBottom: 5 },
  promotionTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  promotionDesc: { fontSize: 12, color: '#f0f0f0' },
  catalogHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  catalogTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  countText: { color: '#999', fontSize: 13 },
  productRow: { justifyContent: 'space-between', marginBottom: 15 },
  productCard: { width: (width - 60) / 2, backgroundColor: '#fff', borderRadius: 15, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  productImage: { width: '100%', height: 110 },
  productName: { fontSize: 13, fontWeight: '600', color: '#333', paddingHorizontal: 10, paddingTop: 10 },
  gradeText: { fontSize: 11, color: '#999', paddingHorizontal: 10, marginTop: 2 },
  moqText: { fontSize: 11, color: '#8B4513', paddingHorizontal: 10, marginTop: 4, fontWeight: '600' },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#333', paddingHorizontal: 10, marginTop: 4 },
  badgeTag: { backgroundColor: '#8B4513', marginHorizontal: 10, marginTop: 4, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  addToCartBtn: { flexDirection: 'row', backgroundColor: '#8B4513', margin: 10, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, justifyContent: 'center', alignItems: 'center', gap: 5 },
  addingBtn: { backgroundColor: '#b8866e' },
  addToCartText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  empty: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  emptyText: { color: '#999', fontSize: 15, marginTop: 12 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 10 },
  navItem: { alignItems: 'center' },
  navLabel: { fontSize: 11, marginTop: 4, color: '#999', fontWeight: '500' },
  badge: { position: 'absolute', top: -4, right: -8, backgroundColor: '#8B4513', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  badgeNum: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});

export default HomeScreen;

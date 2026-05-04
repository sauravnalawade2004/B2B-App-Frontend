// ─────────────────────────────────────────────────────────────────────────────
// HomeScreen.js — Product catalog with category filters + add to cart
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  FlatList, Dimensions, SafeAreaView, Image, Platform,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { CATEGORIES, PRODUCTS } from '../data/products';

const { width } = Dimensions.get('window');

// ── Responsive card width ────────────────────────────────────────────────────
const CARD_GAP = 12;
const H_PAD = 16;
// Adjust COLUMNS here if you want 1 or 3 columns:
const COLUMNS = 2;
const CARD_WIDTH = (width - H_PAD * 2 - CARD_GAP * (COLUMNS - 1)) / COLUMNS;

// ── Product Image component ──────────────────────────────────────────────────
// When you have real images, replace the colored View with an Image tag.
const ProductImage = ({ product, style }) => {
  if (product.image) {
    return (
      <Image
        source={product.image} // ← local require() image
        style={[styles.productImg, style]}
        resizeMode="cover"
      />
    );
  }
  // Fallback color block with initials
  return (
    <View style={[styles.productImg, { backgroundColor: product.backgroundColor || '#C0612B' }, style]}>
      <Text style={styles.productImgText}>{product.name.charAt(0)}</Text>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { addToCart, isInCart, getCartItem, updateQuantity, totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  // ── Filter + search products ─────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, search]);

  // ── Greeting ─────────────────────────────────────────────────────────────
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // ── Render product card ──────────────────────────────────────────────────
  const renderProduct = ({ item }) => {
    const inCart = isInCart(item.id);
    const cartItem = getCartItem(item.id);

    return (
      <View style={styles.productCard}>
        <ProductImage product={item} />
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
        <View style={styles.cardBody}>
          <Text style={styles.productCategory}>{item.category}</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.packSize}>{item.packSize}</Text>
          <Text style={styles.productDesc} numberOfLines={2}>{item.description}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>
            <Text style={styles.priceUnit}>/{item.unit}</Text>
          </View>

          {/* ── Add to Cart / Quantity Controls ─────────────────────────── */}
          {!inCart ? (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addToCart(item, 1)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="add-shopping-cart" size={15} color="#fff" />
              <Text style={styles.addBtnText}>Add to Cart</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyControls}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => {
                  if (cartItem.quantity === 1) return; // Remove handled in CartScreen
                  updateQuantity(cartItem.id, cartItem.quantity - 1);
                }}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{cartItem.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <View style={styles.topBar}>
          <Image source={require('../../assets/Logo.png')} style={styles.topLogo} resizeMode="contain" />
        <Text style={styles.topBarTitle}>BAYO Masala</Text>

        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => navigation.navigate('Cart')}
        >
          <MaterialIcons name="shopping-cart" size={24} color="#fff" />
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── Greeting ──────────────────────────────────────────────────── */}
        <View style={styles.greetRow}>
          <View>
            <Text style={styles.greetText}>
              {greeting()}, {user?.fullName?.split(' ')[0] || 'Partner'} 👋
            </Text>
            <Text style={styles.greetSub}>{user?.businessName || 'Your B2B Spice Dashboard'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <MaterialCommunityIcons name="account-circle" size={44} color="#C0612B" />
          </TouchableOpacity>
        </View>

        {/* ── Search ──────────────────────────────────────────────────────── */}
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#A0856B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search masala, spices, blends..."
            placeholderTextColor="#C8A882"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialIcons name="close" size={18} color="#A0856B" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Category filter chips ────────────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.7}
            >
              <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Promo banner ─────────────────────────────────────────────────── */}
        <LinearGradient
          colors={['#C0612B', '#8B3A1A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.promoBanner}
        >
          <View style={styles.promoContent}>
            <Text style={styles.promoLabel}>BAYO PROMISE</Text>
            <Text style={styles.promoTitle}>Premium Quality{'\n'}Every Batch</Text>
            <Text style={styles.promoDesc}>No preservatives · No MSG · No added colour</Text>
          </View>
          <MaterialCommunityIcons name="fire" size={70} color="rgba(255,200,100,0.7)" />
        </LinearGradient>

        {/* ── Catalogue header ─────────────────────────────────────────────── */}
        <View style={styles.catHeader}>
          <Text style={styles.catHeaderTitle}>
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </Text>
          <Text style={styles.catHeaderCount}>{filteredProducts.length} items</Text>
        </View>

        {/* ── Product grid ─────────────────────────────────────────────────── */}
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="magnify-close" size={56} color="#DDD" />
            <Text style={styles.emptyText}>No products found</Text>
            <TouchableOpacity onPress={() => { setSearch(''); setSelectedCategory('All'); }}>
              <Text style={styles.emptyClear}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={COLUMNS}
            columnWrapperStyle={styles.productRow}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </ScrollView>

      {/* ── Bottom navigation ─────────────────────────────────────────────── */}
      <View style={styles.bottomNav}>
        {[
          { icon: 'home', label: 'Home', screen: 'Home', active: true },
          { icon: 'shopping-cart', label: 'Cart', screen: 'Cart', active: false, count: totalItems },
          { icon: 'receipt-long', label: 'Orders', screen: 'Orders', active: false },
          { icon: 'person-outline', label: 'Profile', screen: 'Profile', active: false },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.label}
            style={styles.navTab}
            onPress={() => navigation.navigate(tab.screen)}
          >
            <View>
              <MaterialIcons name={tab.icon} size={24} color={tab.active ? '#C0612B' : '#AAA'} />
              {tab.count > 0 && (
                <View style={styles.navBadge}>
                  <Text style={styles.navBadgeText}>{tab.count}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.navLabel, tab.active && styles.navLabelActive]}>{tab.label}</Text>
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
    backgroundColor: '#C0612B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#C0612B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  topLogoCircle: {
    // Adjust top bar logo size here ↓
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  topLogo: { width: 34, height: 34, marginRight: 10 },
  topLogoLetter: { fontSize: 16, fontWeight: '900', color: '#fff' },
  topBarTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  cartBtn: { position: 'relative', padding: 4 },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: '#FFD700',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: { fontSize: 10, fontWeight: '800', color: '#8B3A1A' },

  scrollContent: { paddingHorizontal: H_PAD },

  // ── Greeting ──────────────────────────────────────────────────────────────
  greetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  greetText: { fontSize: Math.min(width * 0.055, 22), fontWeight: '800', color: '#2C1A0E' },
  greetSub: { fontSize: 13, color: '#A0856B', marginTop: 2, fontWeight: '500' },

  // ── Search bar ────────────────────────────────────────────────────────────
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#F5D5B5',
    elevation: 2,
    shadowColor: '#C0612B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#333', marginHorizontal: 8 },

  // ── Category chips ────────────────────────────────────────────────────────
  categoryScroll: { marginBottom: 16 },
  categoryContent: { paddingRight: 8, gap: 10 },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#F5D5B5',
    elevation: 1,
  },
  catChipActive: { backgroundColor: '#C0612B', borderColor: '#C0612B' },
  catChipText: { fontSize: 13, fontWeight: '600', color: '#8B4513' },
  catChipTextActive: { color: '#fff' },

  // ── Promo banner ──────────────────────────────────────────────────────────
  promoBanner: {
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#8B3A1A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  promoContent: { flex: 1 },
  promoLabel: { fontSize: 10, color: '#FFD5A8', fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
  promoTitle: { fontSize: Math.min(width * 0.055, 22), fontWeight: '800', color: '#fff', marginBottom: 6, lineHeight: Math.min(width * 0.066, 26) },
  promoDesc: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },

  // ── Catalogue header ──────────────────────────────────────────────────────
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  catHeaderTitle: { fontSize: 17, fontWeight: '800', color: '#2C1A0E' },
  catHeaderCount: { fontSize: 13, color: '#A0856B', fontWeight: '500' },

  // ── Product grid ──────────────────────────────────────────────────────────
  productRow: { justifyContent: 'space-between', marginBottom: CARD_GAP },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#C0612B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  // ── Product image — adjust IMAGE HEIGHT here ↓ ───────────────────────────
  productImg: {
    width: '100%',
    height: CARD_WIDTH * 0.68,    // ← change 0.68 to adjust card image height ratio
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImgText: { fontSize: 36, fontWeight: '900', color: 'rgba(255,255,255,0.5)' },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#C0612B',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  cardBody: { padding: 10 },
  productCategory: { fontSize: 10, color: '#C0612B', fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  productName: { fontSize: 14, fontWeight: '700', color: '#2C1A0E', marginBottom: 2, lineHeight: 18 },
  packSize: { fontSize: 11, color: '#A0856B', fontWeight: '500', marginBottom: 3 },
  productDesc: { fontSize: 11, color: '#888', lineHeight: 15, marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 10 },
  price: { fontSize: 18, fontWeight: '800', color: '#C0612B' },
  priceUnit: { fontSize: 11, color: '#A0856B', marginLeft: 2 },

  // ── Add to cart button ────────────────────────────────────────────────────
  addBtn: {
    backgroundColor: '#C0612B',
    borderRadius: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // ── Quantity controls (shown when item is in cart) ────────────────────────
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF5EB',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#C0612B',
    overflow: 'hidden',
  },
  qtyBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C0612B' },
  qtyBtnText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  qtyValue: { fontSize: 14, fontWeight: '800', color: '#C0612B', flex: 1, textAlign: 'center' },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { fontSize: 15, color: '#BBB', marginTop: 10, fontWeight: '500' },
  emptyClear: { marginTop: 10, fontSize: 14, color: '#C0612B', fontWeight: '700' },

  // ── Bottom nav ────────────────────────────────────────────────────────────
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F5E8D8',
    paddingVertical: 8,
    paddingBottom: Platform?.OS === 'ios' ? 20 : 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  navTab: { flex: 1, alignItems: 'center', gap: 2 },
  navLabel: { fontSize: 11, color: '#AAA', fontWeight: '500' },
  navLabelActive: { color: '#C0612B' },
  navBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#C0612B',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  navBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
});

export default HomeScreen;
// ─────────────────────────────────────────────────────────────────────────────
// HomeScreen.js — Green & White theme
// Ad banner (top) → Category chips → Product grid
// Add to Cart opens a popup for variant/quantity selection
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  FlatList, Dimensions, SafeAreaView, Image, Platform, Modal, Pressable,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { CATEGORIES, PRODUCTS } from '../data/products';

const { width } = Dimensions.get('window');

// ── Theme colours ─────────────────────────────────────────────────────────────
const G = {
  primary:   '#2E7D32',   // deep green
  primary2:  '#43A047',   // mid green
  light:     '#E8F5E9',   // pale green bg
  accent:    '#FF6F00',   // amber for price / badges
  white:     '#FFFFFF',
  text:      '#1B2A1C',
  subtext:   '#5A7A5C',
  border:    '#C8E6C9',
};

// ── Grid config ──────────────────────────────────────────────────────────────
const CARD_GAP  = 12;
const H_PAD     = 16;
const COLUMNS   = 2;
const CARD_W    = (width - H_PAD * 2 - CARD_GAP * (COLUMNS - 1)) / COLUMNS;

// ── Dummy ad banners (replace with real images / API data) ───────────────────
const ADS = [
  { id: 'a1', title: 'Premium Masala', sub: 'No MSG · No Preservatives · No Colour', color: ['#2E7D32', '#1B5E20'] },
  { id: 'a2', title: 'New: Hotel Blend', sub: 'Exclusive for B2B partners — order now!', color: ['#FF6F00', '#E65100'] },
  { id: 'a3', title: 'Bulk Discounts', sub: 'Order 10 kg+ and save 12% on every batch', color: ['#1565C0', '#0D47A1'] },
];

// ── Dummy variants per product (replace with API data) ───────────────────────
const DEFAULT_VARIANTS = [
  { label: '50 g',  multiplier: 0.05 },
  { label: '100 g', multiplier: 0.1  },
  { label: '250 g', multiplier: 0.25 },
  { label: '500 g', multiplier: 0.5  },
  { label: '1 kg',  multiplier: 1    },
];

// ── Product image ─────────────────────────────────────────────────────────────
const ProductImage = ({ product, style }) => {
  if (product.image) {
    return <Image source={product.image} style={[styles.productImg, style]} resizeMode="cover" />;
  }
  return (
    <View style={[styles.productImg, { backgroundColor: product.backgroundColor || G.primary }, style]}>
      <Text style={styles.productImgText}>{product.name.charAt(0)}</Text>
    </View>
  );
};

// ── Ad Banner ────────────────────────────────────────────────────────────────
const AdBanner = () => {
  const [active, setActive] = useState(0);
  return (
    <View style={styles.adWrapper}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setActive(Math.round(e.nativeEvent.contentOffset.x / (width - H_PAD * 2)));
        }}
      >
        {ADS.map((ad) => (
          <LinearGradient key={ad.id} colors={ad.color} style={styles.adSlide}>
            <View style={styles.adContent}>
              <Text style={styles.adLabel}>BAYO MASALA</Text>
              <Text style={styles.adTitle}>{ad.title}</Text>
              <Text style={styles.adSub}>{ad.sub}</Text>
            </View>
            <MaterialCommunityIcons name="fire" size={64} color="rgba(255,255,255,0.25)" />
          </LinearGradient>
        ))}
      </ScrollView>
      {/* Dots */}
      <View style={styles.adDots}>
        {ADS.map((_, i) => (
          <View key={i} style={[styles.adDot, i === active && styles.adDotActive]} />
        ))}
      </View>
    </View>
  );
};

// ── Product Popup ─────────────────────────────────────────────────────────────
const ProductPopup = ({ product, visible, onClose, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(DEFAULT_VARIANTS[1]);
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const variantPrice = Math.round(product.price * selectedVariant.multiplier);
  const total        = variantPrice * qty;

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, qty, variantPrice);
    onClose();
    setQty(1);
    setSelectedVariant(DEFAULT_VARIANTS[1]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.popupOverlay} onPress={onClose}>
        <Pressable style={styles.popupSheet} onPress={() => {}}>
          {/* Handle bar */}
          <View style={styles.popupHandle} />

          {/* Product header */}
          <View style={styles.popupHeader}>
            {product.image ? (
              <Image source={product.image} style={styles.popupImg} resizeMode="cover" />
            ) : (
              <View style={[styles.popupImg, { backgroundColor: product.backgroundColor || G.primary }]}>
                <Text style={styles.popupImgText}>{product.name.charAt(0)}</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.popupCategory}>{product.category}</Text>
              <Text style={styles.popupName}>{product.name}</Text>
              <Text style={styles.popupDesc} numberOfLines={2}>{product.description}</Text>
            </View>
          </View>

          {/* Variant picker */}
          <Text style={styles.popupSectionLabel}>SELECT PACK SIZE</Text>
          <View style={styles.variantRow}>
            {DEFAULT_VARIANTS.map((v) => {
              const price = Math.round(product.price * v.multiplier);
              const active = selectedVariant.label === v.label;
              return (
                <TouchableOpacity
                  key={v.label}
                  style={[styles.variantChip, active && styles.variantChipActive]}
                  onPress={() => setSelectedVariant(v)}
                >
                  <Text style={[styles.variantLabel, active && styles.variantLabelActive]}>{v.label}</Text>
                  <Text style={[styles.variantPrice, active && styles.variantPriceActive]}>₹{price}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quantity */}
          <Text style={styles.popupSectionLabel}>QUANTITY</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQty((q) => Math.max(1, q - 1))}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyVal}>{qty}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQty((q) => q + 1)}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
            <Text style={styles.qtyPackLabel}>× {selectedVariant.label} pack</Text>
          </View>

          {/* Total + Add */}
          <View style={styles.popupFooter}>
            <View>
              <Text style={styles.popupTotalLabel}>Total</Text>
              <Text style={styles.popupTotal}>₹{total.toLocaleString('en-IN')}</Text>
            </View>
            <TouchableOpacity style={styles.popupAddBtn} onPress={handleAdd}>
              <MaterialIcons name="add-shopping-cart" size={18} color="#fff" />
              <Text style={styles.popupAddText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ── Main HomeScreen ───────────────────────────────────────────────────────────
const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { addToCart, isInCart, getCartItem, updateQuantity, totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch]       = useState('');
  const [popupProduct, setPopupProduct] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;
    if (selectedCategory !== 'All') list = list.filter((p) => p.category === selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return list;
  }, [selectedCategory, search]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const openPopup = (item) => {
    setPopupProduct(item);
    setPopupVisible(true);
  };

  const handlePopupAdd = (product, variant, qty, price) => {
    // We store variant info in the product snapshot
    addToCart({ ...product, selectedVariant: variant.label, price }, qty);
  };

  const renderProduct = ({ item }) => {
    const inCart   = isInCart(item.id);
    const cartItem = getCartItem(item.id);

    return (
      <View style={styles.productCard}>
        <TouchableOpacity onPress={() => openPopup(item)} activeOpacity={0.9}>
          <ProductImage product={item} />
        </TouchableOpacity>
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
        <View style={styles.cardBody}>
          <Text style={styles.productCategory}>{item.category}</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.packSize}>{item.packSize}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>
            <Text style={styles.priceUnit}>/{item.unit}</Text>
          </View>

          {!inCart ? (
            <TouchableOpacity style={styles.addBtn} onPress={() => openPopup(item)} activeOpacity={0.8}>
              <MaterialIcons name="add-shopping-cart" size={14} color="#fff" />
              <Text style={styles.addBtnText}>Add to Cart</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyControls}>
              <TouchableOpacity
                style={styles.qtyCtrlBtn}
                onPress={() => {
                  if (cartItem.quantity === 1) return;
                  updateQuantity(cartItem.id, cartItem.quantity - 1);
                }}
              >
                <Text style={styles.qtyCtrlText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyCtrlVal}>{cartItem.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyCtrlBtn}
                onPress={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
              >
                <Text style={styles.qtyCtrlText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <Image source={require('../../assets/Logo.png')} style={styles.topLogo} resizeMode="contain" />
        <Text style={styles.topBarTitle}>BAYO Masala</Text>
        <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
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
            <MaterialCommunityIcons name="account-circle" size={44} color={G.primary} />
          </TouchableOpacity>
        </View>

        {/* ── Search ────────────────────────────────────────────────────── */}
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={G.subtext} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search masala, spices, blends..."
            placeholderTextColor="#A5C9A7"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialIcons name="close" size={18} color={G.subtext} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Ad Banner ─────────────────────────────────────────────────── */}
        <AdBanner />

        {/* ── Category chips ────────────────────────────────────────────── */}
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

        {/* ── Catalogue header ──────────────────────────────────────────── */}
        <View style={styles.catHeader}>
          <Text style={styles.catHeaderTitle}>
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </Text>
          <Text style={styles.catHeaderCount}>{filteredProducts.length} products</Text>
        </View>

        {/* ── Product grid ──────────────────────────────────────────────── */}
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="emoticon-sad-outline" size={52} color={G.border} />
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
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </ScrollView>

      {/* ── Bottom nav ──────────────────────────────────────────────────── */}
      <View style={styles.bottomNav}>
        {[
          { label: 'Home',    icon: 'home',          screen: 'Home',    active: true },
          { label: 'Cart',    icon: 'shopping-cart',  screen: 'Cart',    count: totalItems },
          { label: 'Orders',  icon: 'receipt-long',   screen: 'Orders' },
          { label: 'Profile', icon: 'person-outline', screen: 'Profile' },
        ].map((t) => (
          <TouchableOpacity key={t.label} style={styles.navTab} onPress={() => navigation.navigate(t.screen)}>
            <View>
              <MaterialIcons name={t.icon} size={24} color={t.active ? G.primary : '#AAA'} />
              {t.count > 0 && (
                <View style={styles.navBadge}><Text style={styles.navBadgeText}>{t.count}</Text></View>
              )}
            </View>
            <Text style={[styles.navLabel, t.active && styles.navLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Product Popup ─────────────────────────────────────────────── */}
      <ProductPopup
        product={popupProduct}
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        onAddToCart={handlePopupAdd}
      />
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: G.light },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: G.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: G.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  topLogo: { width: 34, height: 34, marginRight: 10 },
  topBarTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  cartBtn: { position: 'relative', padding: 4 },
  cartBadge: {
    position: 'absolute', top: -2, right: -4,
    backgroundColor: G.accent, borderRadius: 9,
    minWidth: 18, height: 18,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3,
  },
  cartBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff' },

  scrollContent: { paddingHorizontal: H_PAD, paddingBottom: 90 },

  // Greeting
  greetRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 18,
  },
  greetText: { fontSize: Math.min(width * 0.055, 22), fontWeight: '800', color: G.text },
  greetSub:  { fontSize: 13, color: G.subtext, marginTop: 2, fontWeight: '500' },

  // Search
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: G.white, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    marginBottom: 16, borderWidth: 1.5, borderColor: G.border,
    elevation: 2, shadowColor: G.primary,
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#333', marginHorizontal: 8 },

  // Ad banner
  adWrapper: { marginBottom: 18 },
  adSlide: {
    width: width - H_PAD * 2,
    borderRadius: 18, padding: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginRight: 0,
    elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2, shadowRadius: 8,
  },
  adContent: { flex: 1 },
  adLabel:   { fontSize: 10, color: 'rgba(255,255,255,0.75)', fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
  adTitle:   { fontSize: Math.min(width * 0.055, 22), fontWeight: '800', color: '#fff', marginBottom: 4 },
  adSub:     { fontSize: 12, color: 'rgba(255,255,255,0.82)', fontWeight: '500' },
  adDots:    { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  adDot:     { width: 6, height: 6, borderRadius: 3, backgroundColor: G.border },
  adDotActive: { width: 18, backgroundColor: G.primary },

  // Category chips
  categoryScroll:  { marginBottom: 16 },
  categoryContent: { paddingRight: 8, gap: 10 },
  catChip: {
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 22,
    backgroundColor: G.white, borderWidth: 1.5, borderColor: G.border, elevation: 1,
  },
  catChipActive:     { backgroundColor: G.primary, borderColor: G.primary },
  catChipText:       { fontSize: 13, fontWeight: '600', color: G.primary },
  catChipTextActive: { color: '#fff' },

  // Catalogue header
  catHeader:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  catHeaderTitle: { fontSize: 17, fontWeight: '800', color: G.text },
  catHeaderCount: { fontSize: 13, color: G.subtext, fontWeight: '500' },

  // Product grid
  productRow:  { justifyContent: 'space-between', marginBottom: CARD_GAP },
  productCard: {
    width: CARD_W, backgroundColor: G.white, borderRadius: 16, overflow: 'hidden',
    elevation: 3,
    shadowColor: G.primary,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6,
  },
  productImg: {
    width: '100%', height: CARD_W * 0.68,
    justifyContent: 'center', alignItems: 'center',
  },
  productImgText: { fontSize: 36, fontWeight: '900', color: 'rgba(255,255,255,0.5)' },
  badge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: G.accent, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  badgeText:        { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  cardBody:         { padding: 10 },
  productCategory:  { fontSize: 10, color: G.primary, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  productName:      { fontSize: 14, fontWeight: '700', color: G.text, marginBottom: 2, lineHeight: 18 },
  packSize:         { fontSize: 11, color: G.subtext, fontWeight: '500', marginBottom: 3 },
  priceRow:         { flexDirection: 'row', alignItems: 'baseline', marginBottom: 10 },
  price:            { fontSize: 18, fontWeight: '800', color: G.accent },
  priceUnit:        { fontSize: 11, color: G.subtext, marginLeft: 2 },

  addBtn: {
    backgroundColor: G.primary, borderRadius: 10, paddingVertical: 9,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6,
  },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  qtyControls: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: G.light, borderRadius: 10, borderWidth: 1.5,
    borderColor: G.primary, overflow: 'hidden',
  },
  qtyCtrlBtn:  { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', backgroundColor: G.primary },
  qtyCtrlText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  qtyCtrlVal:  { fontSize: 14, fontWeight: '800', color: G.primary, flex: 1, textAlign: 'center' },

  // Empty
  emptyState:  { alignItems: 'center', paddingVertical: 48 },
  emptyText:   { fontSize: 15, color: '#BBB', marginTop: 10, fontWeight: '500' },
  emptyClear:  { marginTop: 10, fontSize: 14, color: G.primary, fontWeight: '700' },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row', backgroundColor: G.white,
    borderTopWidth: 1, borderTopColor: G.border,
    paddingVertical: 8, paddingBottom: Platform?.OS === 'ios' ? 20 : 8,
    elevation: 8, shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 6,
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

  // ── Popup ─────────────────────────────────────────────────────────────────
  popupOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  popupSheet: {
    backgroundColor: G.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 20, paddingBottom: 36,
  },
  popupHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: G.border,
    alignSelf: 'center', marginBottom: 18,
  },
  popupHeader: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  popupImg: {
    width: 80, height: 80, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  popupImgText:    { fontSize: 32, fontWeight: '900', color: 'rgba(255,255,255,0.5)' },
  popupCategory:   { fontSize: 11, color: G.primary, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  popupName:       { fontSize: 16, fontWeight: '800', color: G.text, marginBottom: 4, lineHeight: 20 },
  popupDesc:       { fontSize: 12, color: G.subtext, lineHeight: 17 },

  popupSectionLabel: {
    fontSize: 11, fontWeight: '800', color: G.subtext,
    letterSpacing: 1, marginBottom: 12, marginTop: 4,
  },
  variantRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  variantChip: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    borderWidth: 1.5, borderColor: G.border, backgroundColor: G.light,
    alignItems: 'center',
  },
  variantChipActive:  { backgroundColor: G.primary, borderColor: G.primary },
  variantLabel:       { fontSize: 13, fontWeight: '700', color: G.text, marginBottom: 2 },
  variantLabelActive: { color: '#fff' },
  variantPrice:       { fontSize: 12, fontWeight: '600', color: G.subtext },
  variantPriceActive: { color: 'rgba(255,255,255,0.85)' },

  qtyRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  qtyBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: G.primary, justifyContent: 'center', alignItems: 'center',
  },
  qtyBtnText:   { fontSize: 20, fontWeight: '700', color: '#fff' },
  qtyVal:       { fontSize: 20, fontWeight: '800', color: G.text, minWidth: 32, textAlign: 'center' },
  qtyPackLabel: { fontSize: 13, color: G.subtext, fontWeight: '500' },

  popupFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: G.light, borderRadius: 16, padding: 16,
  },
  popupTotalLabel: { fontSize: 12, color: G.subtext, fontWeight: '600', marginBottom: 2 },
  popupTotal:      { fontSize: 22, fontWeight: '900', color: G.primary },
  popupAddBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: G.primary, borderRadius: 14,
    paddingHorizontal: 20, paddingVertical: 14,
    elevation: 4,
    shadowColor: G.primary,
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6,
  },
  popupAddText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});

export default HomeScreen;
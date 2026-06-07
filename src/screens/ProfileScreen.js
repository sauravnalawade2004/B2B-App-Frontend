// ─────────────────────────────────────────────────────────────────────────────
// ProfileScreen.js — Green & White theme
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ScrollView, Alert, Dimensions, Image,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

const G = {
  primary:  '#2E7D32',
  primary2: '#1B5E20',
  light:    '#E8F5E9',
  accent:   '#FF6F00',
  white:    '#FFFFFF',
  text:     '#1B2A1C',
  subtext:  '#5A7A5C',
  border:   '#C8E6C9',
};

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { totalItems }   = useCart();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => { await logout(); } },
    ]);
  };

  const Row = ({ icon, label, value }) => (
    <View style={styles.credRow}>
      <View style={styles.credIcon}>
        <MaterialCommunityIcons name={icon} size={20} color={G.primary} />
      </View>
      <View style={styles.credContent}>
        <Text style={styles.credLabel}>{label}</Text>
        <Text style={styles.credValue}>{value || '—'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>My Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Avatar card */}
        <LinearGradient colors={[G.primary, G.primary2]} style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>
              {user?.fullName?.charAt(0)?.toUpperCase() || 'B'}
            </Text>
          </View>
          <Text style={styles.avatarName}>{user?.fullName || 'BAYO Customer'}</Text>
          <View style={styles.bizTypePill}>
            <Text style={styles.bizTypeText}>{user?.businessType || 'Business Partner'}</Text>
          </View>
          <Text style={styles.bizName}>{user?.businessName || ''}</Text>
        </LinearGradient>

        {/* Business credentials */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <MaterialCommunityIcons name="shield-check" size={18} color={G.primary} />
            <Text style={styles.cardTitle}>Business Credentials</Text>
          </View>
          <Row icon="phone"         label="Mobile Number" value={'+91 ' + (user?.mobile || '')} />
          <View style={styles.divider} />
          <Row icon="briefcase"     label="Business Name" value={user?.businessName} />
          <View style={styles.divider} />
          <Row icon="storefront"    label="Business Type" value={user?.businessType} />
          {user?.gstNumber ? (
            <>
              <View style={styles.divider} />
              <Row icon="file-document" label="GST Number" value={user.gstNumber} />
            </>
          ) : null}
        </View>

        {/* Delivery address */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <MaterialCommunityIcons name="map-marker" size={18} color={G.primary} />
            <Text style={styles.cardTitle}>Delivery Address</Text>
          </View>
          <Text style={styles.addressText}>
            {[user?.address, user?.city, user?.pincode].filter(Boolean).join(', ') || '—'}
          </Text>
        </View>

        {/* Account actions */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <MaterialCommunityIcons name="cog" size={18} color={G.primary} />
            <Text style={styles.cardTitle}>Account</Text>
          </View>
          {[
            { icon: 'map-marker-plus',  label: 'Saved Addresses', onPress: () => Alert.alert('Coming Soon', 'Address management will be available soon.') },
            { icon: 'help-circle-outline', label: 'Help & Support',   onPress: () => Alert.alert('Support', 'Email us at support@bayomasala.com') },
          ].map((a) => (
            <TouchableOpacity key={a.label} style={styles.actionRow} onPress={a.onPress}>
              <View style={styles.actionIcon}>
                <MaterialCommunityIcons name={a.icon} size={22} color={G.primary} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
              <MaterialIcons name="chevron-right" size={22} color="#DDD" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Promise banner */}
        <LinearGradient colors={[G.primary, G.primary2]} style={styles.promiseBanner}>
          <Text style={styles.promiseTitle}>Premium Quality. Every Batch.</Text>
          <Text style={styles.promiseDesc}>No Preservatives · No MSG · No Added Colour</Text>
        </LinearGradient>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        {[
          { label: 'Home',    icon: 'home',          screen: 'Home' },
          { label: 'Cart',    icon: 'shopping-cart',  screen: 'Cart', count: totalItems },
          { label: 'Orders',  icon: 'receipt-long',   screen: 'Orders' },
          { label: 'Profile', icon: 'person-outline', screen: 'Profile', active: true },
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: G.light },

  topBar: { backgroundColor: G.primary, paddingHorizontal: 16, paddingVertical: 14, elevation: 4 },
  topBarTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },

  avatarCard:   { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 20, marginBottom: 4 },
  avatarCircle: {
    width: width * 0.22, height: width * 0.22, borderRadius: width * 0.11,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarLetter: { fontSize: width * 0.1, fontWeight: '900', color: '#fff' },
  avatarName:   { fontSize: Math.min(width * 0.065, 26), fontWeight: '800', color: '#fff', marginBottom: 8 },
  bizTypePill:  { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 5, marginBottom: 6 },
  bizTypeText:  { fontSize: 12, fontWeight: '700', color: '#fff', letterSpacing: 1 },
  bizName:      { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },

  card: {
    backgroundColor: G.white, marginHorizontal: 12, marginTop: 12,
    borderRadius: 16, padding: 16, elevation: 2,
    shadowColor: G.primary, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 5,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  cardTitle:    { fontSize: 14, fontWeight: '800', color: G.text },

  credRow:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  credIcon:   { width: 40, height: 40, borderRadius: 10, backgroundColor: G.light, justifyContent: 'center', alignItems: 'center' },
  credContent: { flex: 1 },
  credLabel:  { fontSize: 11, color: G.subtext, fontWeight: '600', marginBottom: 2 },
  credValue:  { fontSize: 15, fontWeight: '600', color: G.text },
  divider:    { height: 1, backgroundColor: G.border, marginVertical: 12 },

  addressText: { fontSize: 14, color: '#444', lineHeight: 20 },

  actionRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: G.border },
  actionIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: G.light, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: G.text },

  promiseBanner: { marginHorizontal: 12, marginTop: 12, borderRadius: 16, padding: 20, alignItems: 'center' },
  promiseTitle:  { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 6 },
  promiseDesc:   { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },

  logoutBtn: {
    marginHorizontal: 12, marginTop: 14,
    backgroundColor: '#D32F2F', borderRadius: 14,
    paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    elevation: 4,
  },
  logoutText: { color: '#fff', fontWeight: '800', fontSize: 16 },

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

export default ProfileScreen;
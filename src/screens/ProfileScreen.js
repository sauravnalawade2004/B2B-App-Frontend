import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          await logout();
          // AppNavigator automatically shows Login when user is null
          setLoading(false);
        },
      },
    ]);
  };

  const accountActions = [
    { icon: 'map-marker', label: 'Saved Addresses', color: '#FFE4D6', onPress: () => Alert.alert('Coming Soon', 'Address management coming soon!') },
    { icon: 'help-circle', label: 'Help & Support', color: '#FFE4D6', onPress: () => Alert.alert('Support', 'Email us at support@bayomasala.com') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <MaterialIcons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bayo Masala</Text>
        <MaterialCommunityIcons name="account-circle" size={32} color="#8B4513" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Merchant Card */}
        <View style={styles.merchantCard}>
          <View style={styles.largeAvatar}>
            <MaterialCommunityIcons name="account-circle" size={90} color="#8B4513" />
            <View style={styles.checkmark}>
              <MaterialCommunityIcons name="check-circle" size={30} color="#8B4513" />
            </View>
          </View>
          <Text style={styles.statusBadge}>AUTHORIZED MERCHANT</Text>
          <Text style={styles.merchantName}>{user?.FullName || '—'}</Text>
          <Text style={styles.merchantSubtitle}>Premium Bulk Procurement Partner</Text>
        </View>

        {/* Business Credentials */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="shield-check" size={20} color="#8B4513" />
            <Text style={styles.sectionTitle}>Business Credentials</Text>
          </View>

          <View style={styles.credentialCard}>
            <View style={styles.credentialItem}>
              <View style={styles.credentialIcon}>
                <MaterialIcons name="phone" size={20} color="#8B4513" />
              </View>
              <View style={styles.credentialContent}>
                <Text style={styles.credentialLabel}>Phone Number</Text>
                <Text style={styles.credentialValue}>+91 {user?.PhoneNumber || '—'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.credentialItem}>
              <View style={styles.credentialIcon}>
                <MaterialIcons name="email" size={20} color="#8B4513" />
              </View>
              <View style={styles.credentialContent}>
                <Text style={styles.credentialLabel}>Email</Text>
                <Text style={styles.credentialValue}>{user?.Email || '—'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.credentialItem}>
              <View style={styles.credentialIcon}>
                <MaterialCommunityIcons name="briefcase" size={20} color="#8B4513" />
              </View>
              <View style={styles.credentialContent}>
                <Text style={styles.credentialLabel}>GST Number</Text>
                <Text style={styles.credentialValue}>{user?.GSTNumber || '—'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="cog" size={20} color="#8B4513" />
            <Text style={styles.sectionTitle}>Account Actions</Text>
          </View>
          {accountActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionCard} onPress={action.onPress}>
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <MaterialCommunityIcons name={action.icon} size={24} color="#8B4513" />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#ddd" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Pro Membership Banner */}
        <LinearGradient
          colors={['#8B4513', '#654d21']}
          style={styles.membershipBanner}
        >
          <Text style={styles.bannerTitle}>Elevate your procurement with Pro Membership.</Text>
          <TouchableOpacity style={styles.upgradeBtn}>
            <Text style={styles.upgradeText}>Upgrade Now</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#8B4513" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <>
                <MaterialIcons name="logout" size={20} color="#fff" />
                <Text style={styles.logoutText}>Logout</Text>
              </>
          }
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <MaterialCommunityIcons name="home" size={24} color="#999" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Cart')}>
          <MaterialIcons name="shopping-cart" size={24} color="#999" />
          <Text style={styles.navLabel}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Orders')}>
          <MaterialCommunityIcons name="calendar-check" size={24} color="#999" />
          <Text style={styles.navLabel}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="account-circle" size={24} color="#8B4513" />
          <Text style={[styles.navLabel, { color: '#8B4513' }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#8B4513' },
  content: { flex: 1 },
  merchantCard: { backgroundColor: '#f5f5f5', margin: 20, borderRadius: 15, paddingVertical: 30, paddingHorizontal: 20, alignItems: 'center' },
  largeAvatar: { position: 'relative', alignItems: 'center', justifyContent: 'center', width: 110, height: 110, borderRadius: 55, backgroundColor: '#fff', marginBottom: 12 },
  checkmark: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', borderRadius: 16 },
  statusBadge: { fontSize: 11, fontWeight: '700', color: '#8B4513', letterSpacing: 1, marginBottom: 8 },
  merchantName: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  merchantSubtitle: { fontSize: 13, color: '#666' },
  section: { marginHorizontal: 20, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  credentialCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 3 },
  credentialItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  credentialIcon: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#FFE4D6', justifyContent: 'center', alignItems: 'center' },
  credentialContent: { flex: 1 },
  credentialLabel: { fontSize: 11, color: '#999', marginBottom: 2, fontWeight: '600' },
  credentialValue: { fontSize: 15, fontWeight: '600', color: '#333' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 12 },
  actionCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 1 },
  actionIcon: { width: 46, height: 46, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: '#333' },
  membershipBanner: { marginHorizontal: 20, marginBottom: 20, borderRadius: 15, padding: 20 },
  bannerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 14 },
  upgradeBtn: { backgroundColor: '#fff', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6 },
  upgradeText: { color: '#8B4513', fontWeight: '600', fontSize: 14 },
  logoutBtn: { marginHorizontal: 20, marginBottom: 90, backgroundColor: '#8B4513', borderRadius: 12, paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 10, position: 'absolute', bottom: 0, width: '100%' },
  navItem: { alignItems: 'center', paddingVertical: 4 },
  navLabel: { fontSize: 11, marginTop: 4, color: '#999', fontWeight: '500' },
});

export default ProfileScreen;

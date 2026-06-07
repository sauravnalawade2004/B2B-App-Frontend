// ─────────────────────────────────────────────────────────────────────────────
// TrackorderScreen.js — Green & White theme
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, ScrollView, Dimensions,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

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

const TrackOrderScreen = ({ navigation }) => {
  const trackingStages = [
    { id: 1, stage: 'Order Placed',      description: 'We\'ve received your request for premium grade spices.', time: 'Oct 14, 09:30 AM', completed: true,  current: false, icon: 'check-circle' },
    { id: 2, stage: 'Approved',          description: 'Quality check passed and payment confirmed.',            time: 'Oct 14, 02:45 PM', completed: true,  current: false, icon: 'check-circle' },
    { id: 3, stage: 'Packed',            description: 'Your order is vacuum-sealed and ready for transit.',     time: 'Updated 15 mins ago', completed: true, current: true, icon: 'package-variant' },
    { id: 4, stage: 'Out for Delivery',  description: 'The courier will pick up your order shortly.',          time: null,               completed: false, current: false, icon: 'truck' },
    { id: 5, stage: 'Delivered',         description: 'Arriving at your doorstep soon.',                       time: null,               completed: false, current: false, icon: 'map-marker' },
  ];

  const shipmentDetails = {
    orderId:         '#BM-7729104',
    status:          'Your spice shipment is packed and ready for dispatch.',
    expectedDelivery: '18th Oct, 2026',
    address:         'The Spice Quarter, 42 Saffron Lane, Mumbai, MH 400001',
    packageContents: ['3x Bulk Kerala Cardamom (5kg)', '1x Kashmiri Saffron Threads (500g)'],
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <MaterialCommunityIcons name="account-circle" size={32} color="#fff" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Order header */}
        <View style={styles.orderSection}>
          <View style={styles.liveTrackingBadge}>
            <MaterialCommunityIcons name="dot-circle" size={10} color={G.accent} />
            <Text style={styles.liveTrackingText}>LIVE TRACKING</Text>
          </View>
          <Text style={styles.orderId}>{shipmentDetails.orderId}</Text>
          <Text style={styles.orderStatus}>{shipmentDetails.status}</Text>
          <View style={styles.deliveryInfo}>
            <MaterialCommunityIcons name="calendar" size={18} color={G.primary} />
            <View style={styles.deliveryInfoContent}>
              <Text style={styles.deliveryLabel}>Expected Delivery</Text>
              <Text style={styles.deliveryDate}>{shipmentDetails.expectedDelivery}</Text>
            </View>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Order Timeline</Text>
          {trackingStages.map((stage, index) => (
            <View key={stage.id} style={styles.timelineItem}>
              <View style={styles.timelineIconContainer}>
                <View style={[
                  styles.timelineIcon,
                  { backgroundColor: stage.completed ? G.primary : stage.current ? G.accent : '#E0E0E0' },
                ]}>
                  <MaterialCommunityIcons
                    name={stage.icon} size={20}
                    color={stage.completed || stage.current ? '#fff' : '#999'}
                  />
                </View>
                {index < trackingStages.length - 1 && (
                  <View style={[styles.timelineConnector, { backgroundColor: trackingStages[index + 1].completed ? G.primary : G.border }]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.stageHeader}>
                  <Text style={styles.stageName}>{stage.stage}</Text>
                  {stage.current && <Text style={styles.currentBadge}>CURRENT</Text>}
                </View>
                <Text style={styles.stageDescription}>{stage.description}</Text>
                {stage.time && <Text style={styles.stageTime}>{stage.time}</Text>}
              </View>
            </View>
          ))}
        </View>

        {/* Shipment details */}
        <View style={styles.shipmentSection}>
          <Text style={styles.sectionTitle}>Shipment Details</Text>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <MaterialCommunityIcons name="map-marker" size={20} color={G.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>DELIVERY ADDRESS</Text>
              <Text style={styles.detailValue}>{shipmentDetails.address}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <MaterialCommunityIcons name="package-variant-closed" size={20} color={G.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>PACKAGE CONTENTS</Text>
              {shipmentDetails.packageContents.map((item, idx) => (
                <Text key={idx} style={styles.detailValue}>{item}</Text>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.contactBtn} onPress={() => alert('Connecting to supplier...')}>
            <MaterialCommunityIcons name="headset" size={20} color="#fff" />
            <Text style={styles.contactBtnText}>Contact Supplier</Text>
          </TouchableOpacity>
        </View>

        {/* Map placeholder */}
        <View style={styles.mapSection}>
          <View style={styles.mapPlaceholder}>
            <MaterialCommunityIcons name="map" size={40} color="rgba(255,255,255,0.4)" />
            <Text style={styles.mapText}>Last location: Bayo Logistics Hub, Mumbai</Text>
          </View>
        </View>

      </ScrollView>

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        {[
          { label: 'Home',    icon: 'home',           screen: 'Home' },
          { label: 'Cart',    icon: 'shopping-cart',   screen: 'Cart' },
          { label: 'Orders',  icon: 'receipt-long',    screen: 'Orders', active: true },
          { label: 'Profile', icon: 'person-outline',  screen: 'Profile' },
        ].map((t) => (
          <TouchableOpacity key={t.label} style={styles.navTab} onPress={() => navigation.navigate(t.screen)}>
            <MaterialIcons name={t.icon} size={24} color={t.active ? G.primary : '#AAA'} />
            <Text style={[styles.navLabel, t.active && styles.navLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: G.light },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: G.primary, elevation: 4,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },

  content: { flex: 1 },

  orderSection: {
    backgroundColor: G.white, padding: 20,
    borderBottomWidth: 1, borderBottomColor: G.border,
  },
  liveTrackingBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12, alignSelf: 'flex-start' },
  liveTrackingText:  { fontSize: 11, fontWeight: '700', color: G.accent, letterSpacing: 1 },
  orderId:           { fontSize: 24, fontWeight: '800', color: G.text, marginBottom: 8 },
  orderStatus:       { fontSize: 14, color: G.subtext, marginBottom: 16 },
  deliveryInfo: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: G.light, padding: 12, borderRadius: 10,
  },
  deliveryInfoContent: { flex: 1 },
  deliveryLabel: { fontSize: 12, color: G.subtext, marginBottom: 4 },
  deliveryDate:  { fontSize: 16, fontWeight: '800', color: G.text },

  timelineSection: {
    paddingHorizontal: 20, paddingVertical: 20,
    backgroundColor: G.white, marginVertical: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: G.text, marginBottom: 20 },

  timelineItem:          { flexDirection: 'row', marginBottom: 20 },
  timelineIconContainer: { alignItems: 'center', marginRight: 16 },
  timelineIcon:          { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  timelineConnector:     { width: 2, height: 60, marginTop: 4 },
  timelineContent:       { flex: 1, paddingTop: 4 },
  stageHeader:           { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  stageName:             { fontSize: 15, fontWeight: '700', color: G.text },
  currentBadge: {
    fontSize: 10, fontWeight: '700', color: '#fff',
    backgroundColor: G.accent, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4,
  },
  stageDescription: { fontSize: 13, color: G.subtext, marginBottom: 6, lineHeight: 18 },
  stageTime:        { fontSize: 11, color: '#999' },

  shipmentSection: {
    backgroundColor: G.white, marginHorizontal: 12,
    marginVertical: 8, borderRadius: 16, padding: 16,
    elevation: 2, shadowColor: G.primary,
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 5,
  },
  detailItem: {
    flexDirection: 'row', gap: 12, marginBottom: 16,
    paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: G.border,
  },
  detailIcon:    { width: 40, height: 40, borderRadius: 10, backgroundColor: G.light, justifyContent: 'center', alignItems: 'center' },
  detailContent: { flex: 1 },
  detailLabel:   { fontSize: 11, fontWeight: '700', color: G.primary, marginBottom: 4, letterSpacing: 0.5 },
  detailValue:   { fontSize: 13, color: G.text, fontWeight: '500', marginBottom: 4, lineHeight: 18 },

  contactBtn: {
    backgroundColor: G.primary, borderRadius: 12, paddingVertical: 14,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    elevation: 4,
  },
  contactBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  mapSection: { marginHorizontal: 12, marginVertical: 12 },
  mapPlaceholder: {
    backgroundColor: '#263238', borderRadius: 12, height: 200,
    justifyContent: 'center', alignItems: 'center',
  },
  mapText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 10 },

  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: G.white, borderTopWidth: 1, borderTopColor: G.border,
    paddingVertical: 8, position: 'absolute', bottom: 0, width: '100%', elevation: 8,
  },
  navTab:         { alignItems: 'center', gap: 2 },
  navLabel:       { fontSize: 11, color: '#AAA', fontWeight: '500' },
  navLabelActive: { color: G.primary },
});

export default TrackOrderScreen;
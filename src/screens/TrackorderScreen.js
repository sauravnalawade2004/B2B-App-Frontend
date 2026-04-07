import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const TrackOrderScreen = ({ navigation }) => {
  const trackingStages = [
    {
      id: 1,
      stage: 'Order Placed',
      description: 'We\'ve received your request for premium grade spices.',
      time: 'Oct 14, 09:30 AM',
      completed: true,
      current: false,
      icon: 'check-circle',
    },
    {
      id: 2,
      stage: 'Approved',
      description: 'Quality check passed and payment confirmed.',
      time: 'Oct 14, 02:45 PM',
      completed: true,
      current: false,
      icon: 'check-circle',
    },
    {
      id: 3,
      stage: 'Packed',
      description: 'Your artisan selection is vacuum-sealed and ready for transit.',
      time: 'Updated 15 mins ago',
      completed: true,
      current: true,
      icon: 'package-variant',
    },
    {
      id: 4,
      stage: 'Out for Delivery',
      description: 'The courier will pick up your order shortly.',
      time: null,
      completed: false,
      current: false,
      icon: 'truck',
    },
    {
      id: 5,
      stage: 'Delivered',
      description: 'Arriving at your doorstep soon.',
      time: null,
      completed: false,
      current: false,
      icon: 'map-marker',
    },
  ];

  const shipmentDetails = {
    orderId: '#BM-7729104',
    status: 'Your spice shipment is packed and ready for dispatch.',
    expectedDelivery: '18th Oct, 2026',
    address: 'The Spice Quarter, 42 Saffron Lane, Mumbai, MH 400001',
    packageContents: [
      '3x Bulk Kerala Cardamom (5kg)',
      '1x Kashmiri Saffron Threads (500g)',
    ],
  };

  const handleContactSupplier = () => {
    alert('Connecting to supplier...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#8B4513" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bayo Masala</Text>
        <View style={styles.profilePic}>
          <MaterialCommunityIcons name="account-circle" size={32} color="#8B4513" />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Header */}
        <View style={styles.orderSection}>
          <View style={styles.liveTrackingBadge}>
            <MaterialCommunityIcons name="dot-circle" size={10} color="#FF6B6B" />
            <Text style={styles.liveTrackingText}>LIVE TRACKING</Text>
          </View>
          <Text style={styles.orderId}>{shipmentDetails.orderId}</Text>
          <Text style={styles.orderStatus}>{shipmentDetails.status}</Text>

          <View style={styles.deliveryInfo}>
            <MaterialCommunityIcons name="calendar" size={18} color="#8B4513" />
            <View style={styles.deliveryInfoContent}>
              <Text style={styles.deliveryLabel}>Expected Delivery</Text>
              <Text style={styles.deliveryDate}>{shipmentDetails.expectedDelivery}</Text>
            </View>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timelineSection}>
          {trackingStages.map((stage, index) => (
            <View key={stage.id}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View
                    style={[
                      styles.timelineIcon,
                      {
                        backgroundColor: stage.completed ? '#8B4513' : stage.current ? '#FF6B6B' : '#ddd',
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={stage.icon}
                      size={20}
                      color={stage.completed || stage.current ? '#fff' : '#999'}
                    />
                  </View>

                  {index < trackingStages.length - 1 && (
                    <View
                      style={[
                        styles.timelineConnector,
                        {
                          backgroundColor: trackingStages[index + 1].completed ? '#8B4513' : '#ddd',
                        },
                      ]}
                    />
                  )}
                </View>

                <View style={styles.timelineContent}>
                  <View style={styles.stageHeader}>
                    <Text style={styles.stageName}>{stage.stage}</Text>
                    {stage.current && (
                      <Text style={styles.currentBadge}>CURRENT STAGE</Text>
                    )}
                  </View>
                  <Text style={styles.stageDescription}>{stage.description}</Text>
                  {stage.time && <Text style={styles.stageTime}>{stage.time}</Text>}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Shipment Details */}
        <View style={styles.shipmentSection}>
          <Text style={styles.sectionTitle}>Shipment Details</Text>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#8B4513" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>DELIVERY ADDRESS</Text>
              <Text style={styles.detailValue}>{shipmentDetails.address}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <MaterialCommunityIcons name="package-variant-closed" size={20} color="#8B4513" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>PACKAGE CONTENTS</Text>
              {shipmentDetails.packageContents.map((item, idx) => (
                <Text key={idx} style={styles.detailValue}>
                  {item}
                </Text>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.contactBtn}
            onPress={handleContactSupplier}
          >
            <MaterialCommunityIcons name="headset" size={20} color="#fff" />
            <Text style={styles.contactBtnText}>Contact Supplier</Text>
          </TouchableOpacity>
        </View>

        {/* Map Section */}
        <View style={styles.mapSection}>
          <View style={styles.mapPlaceholder}>
            <MaterialCommunityIcons name="map" size={40} color="#ddd" />
            <Text style={styles.mapText}>Last location: Bayo Logistics Hub, Mumbai</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
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
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingBottom: 80,
  },
  orderSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  liveTrackingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  liveTrackingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6B6B',
    letterSpacing: 1,
  },
  orderId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  orderStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
  },
  deliveryInfoContent: {
    flex: 1,
  },
  deliveryLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  deliveryDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timelineSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginVertical: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineConnector: {
    width: 2,
    height: 60,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  stageName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  currentBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  stageDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    lineHeight: 18,
  },
  stageTime: {
    fontSize: 11,
    color: '#999',
  },
  shipmentSection: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B4513',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 18,
  },
  contactBtn: {
    backgroundColor: '#8B4513',
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  contactBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  mapSection: {
    marginHorizontal: 12,
    marginVertical: 12,
    marginBottom: 100,
  },
  mapPlaceholder: {
    backgroundColor: '#333',
    borderRadius: 12,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  mapText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 11,
    marginTop: 4,
    color: '#999',
    fontWeight: '500',
  },
});

export default TrackOrderScreen;

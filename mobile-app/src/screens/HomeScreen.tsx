import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface HomeScreenProps {
  navigation: any;
}

interface Vendor {
  _id: string;
  name: string;
  businessName: string;
  category: string;
  rating: { average: number; count: number };
  location: { city: string };
}

interface Venue {
  _id: string;
  name: string;
  description: string;
  rating: { average: number; count: number };
  location: { city: string };
  pricing: { basePrice: number; currency: string };
}

interface Stats {
  totalVendors: number;
  totalVenues: number;
  totalBookings: number;
  totalUsers: number;
}

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalVendors: 0,
    totalVenues: 0,
    totalBookings: 0,
    totalUsers: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch featured vendors
      const vendorsResponse = await fetch('http://localhost:3000/api/home/featured-vendors');
      const vendorsData = await vendorsResponse.json();
      setVendors(vendorsData.vendors || []);

      // Fetch featured venues
      const venuesResponse = await fetch('http://localhost:3000/api/home/featured-venues');
      const venuesData = await venuesResponse.json();
      setVenues(venuesData.venues || []);

      // Fetch stats
      const statsResponse = await fetch('http://localhost:3000/api/home/stats');
      const statsData = await statsResponse.json();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderVendorCard = (vendor: Vendor) => (
    <TouchableOpacity
      key={vendor._id}
      style={styles.card}
      onPress={() => navigation.navigate('VendorDetail', { vendorId: vendor._id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {vendor.businessName}
        </Text>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{vendor.rating.average}</Text>
        </View>
      </View>
      <Text style={styles.cardSubtitle}>{vendor.category}</Text>
      <Text style={styles.cardLocation}>{vendor.location.city}</Text>
    </TouchableOpacity>
  );

  const renderVenueCard = (venue: Venue) => (
    <TouchableOpacity
      key={venue._id}
      style={styles.card}
      onPress={() => navigation.navigate('VenueDetail', { venueId: venue._id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {venue.name}
        </Text>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{venue.rating.average}</Text>
        </View>
      </View>
      <Text style={styles.cardSubtitle} numberOfLines={2}>
        {venue.description}
      </Text>
      <Text style={styles.cardLocation}>{venue.location.city}</Text>
      <Text style={styles.cardPrice}>
        {venue.pricing.currency} {venue.pricing.basePrice.toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to WeddingLK</Text>
        <Text style={styles.subtitleText}>Your wedding planning journey starts here</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Search')}
        >
          <MaterialIcons name="search" size={24} color="#FF6B6B" />
          <Text style={styles.actionText}>Find Vendors</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Venues')}
        >
          <MaterialIcons name="location-on" size={24} color="#FF6B6B" />
          <Text style={styles.actionText}>Find Venues</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Planning')}
        >
          <MaterialIcons name="event" size={24} color="#FF6B6B" />
          <Text style={styles.actionText}>Planning Tools</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Packages')}
        >
          <MaterialIcons name="card-giftcard" size={24} color="#FF6B6B" />
          <Text style={styles.actionText}>Packages</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Platform Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalVendors}</Text>
            <Text style={styles.statLabel}>Vendors</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalVenues}</Text>
            <Text style={styles.statLabel}>Venues</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalBookings}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
        </View>
      </View>

      {/* Featured Vendors */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Vendors</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Vendors')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {vendors.map(renderVendorCard)}
        </ScrollView>
      </View>

      {/* Featured Venues */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Venues</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Venues')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {venues.map(renderVenueCard)}
        </ScrollView>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Start Planning?</Text>
        <Text style={styles.ctaSubtitle}>
          Create your wedding timeline and start booking vendors today
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Planning')}
        >
          <Text style={styles.ctaButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF6B6B',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statsSection: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginRight: 15,
    width: width * 0.7,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  cardLocation: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  ctaSection: {
    backgroundColor: '#FF6B6B',
    margin: 20,
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen; 
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DashboardScreenProps {
  navigation: any;
}

interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  totalSpent: number;
  upcomingEvents: number;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    activeBookings: 0,
    totalSpent: 0,
    upcomingEvents: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      // TODO: Implement actual API calls
      // For now, using mock data
      setStats({
        totalBookings: 12,
        activeBookings: 3,
        totalSpent: 250000,
        upcomingEvents: 2,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const renderStatCard = (title: string, value: string | number, icon: string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIcon}>
        <MaterialIcons name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  const renderQuickAction = (title: string, icon: string, onPress: () => void, color: string) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <MaterialIcons name={icon as any} size={24} color="#fff" />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
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
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <MaterialIcons name="account-circle" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {renderStatCard('Total Bookings', stats.totalBookings, 'bookmark', '#4CAF50')}
          {renderStatCard('Active Bookings', stats.activeBookings, 'event', '#2196F3')}
          {renderStatCard('Total Spent', `LKR ${stats.totalSpent.toLocaleString()}`, 'account-balance-wallet', '#FF9800')}
          {renderStatCard('Upcoming Events', stats.upcomingEvents, 'schedule', '#E91E63')}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {renderQuickAction('New Booking', 'add-circle', () => navigation.navigate('Booking'), '#4CAF50')}
          {renderQuickAction('Find Vendors', 'search', () => navigation.navigate('Search'), '#2196F3')}
          {renderQuickAction('Find Venues', 'location-on', () => navigation.navigate('Venues'), '#FF9800')}
          {renderQuickAction('Planning Tools', 'event', () => navigation.navigate('Planning'), '#E91E63')}
          {renderQuickAction('Messages', 'message', () => navigation.navigate('Messages'), '#9C27B0')}
          {renderQuickAction('Favorites', 'favorite', () => navigation.navigate('Favorites'), '#F44336')}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentActivitySection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Booking Confirmed</Text>
              <Text style={styles.activitySubtitle}>Perfect Photography - Wedding Day</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <MaterialIcons name="payment" size={20} color="#2196F3" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Payment Completed</Text>
              <Text style={styles.activitySubtitle}>Grand Hotel Ballroom - LKR 50,000</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <MaterialIcons name="message" size={20} color="#FF9800" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New Message</Text>
              <Text style={styles.activitySubtitle}>Elegant Designs - Quote Request</Text>
              <Text style={styles.activityTime}>2 days ago</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Upcoming Events */}
      <View style={styles.upcomingEventsSection}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <View style={styles.eventList}>
          <View style={styles.eventItem}>
            <View style={styles.eventDate}>
              <Text style={styles.eventDay}>15</Text>
              <Text style={styles.eventMonth}>DEC</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>Wedding Ceremony</Text>
              <Text style={styles.eventLocation}>Grand Hotel Ballroom</Text>
              <Text style={styles.eventTime}>2:00 PM - 6:00 PM</Text>
            </View>
            <TouchableOpacity style={styles.eventAction}>
              <MaterialIcons name="more-vert" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.eventItem}>
            <View style={styles.eventDate}>
              <Text style={styles.eventDay}>20</Text>
              <Text style={styles.eventMonth}>DEC</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>Reception</Text>
              <Text style={styles.eventLocation}>Garden Palace</Text>
              <Text style={styles.eventTime}>7:00 PM - 11:00 PM</Text>
            </View>
            <TouchableOpacity style={styles.eventAction}>
              <MaterialIcons name="more-vert" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsSection: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    width: '48%',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statIcon: {
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
  },
  quickActionsSection: {
    margin: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  recentActivitySection: {
    margin: 20,
  },
  activityList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 10,
    color: '#999',
  },
  upcomingEventsSection: {
    margin: 20,
    marginBottom: 40,
  },
  eventList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  eventDate: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 8,
    marginRight: 15,
    alignItems: 'center',
    minWidth: 50,
  },
  eventDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  eventMonth: {
    fontSize: 10,
    color: '#fff',
    opacity: 0.9,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 10,
    color: '#999',
  },
  eventAction: {
    padding: 5,
  },
});

export default DashboardScreen; 
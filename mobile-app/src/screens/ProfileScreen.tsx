import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const profileData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+94 11 123 4567',
    avatar: '/placeholder-user.jpg',
    memberSince: 'January 2024',
    totalBookings: 12,
    favoriteVendors: 8,
    savedVenues: 5,
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
    Alert.alert('Edit Profile', 'Edit profile functionality coming soon!');
  };

  const handleChangePassword = () => {
    // TODO: Navigate to change password screen
    Alert.alert('Change Password', 'Change password functionality coming soon!');
  };

  const handlePrivacySettings = () => {
    // TODO: Navigate to privacy settings screen
    Alert.alert('Privacy Settings', 'Privacy settings functionality coming soon!');
  };

  const handleHelpSupport = () => {
    // TODO: Navigate to help and support screen
    Alert.alert('Help & Support', 'Help and support functionality coming soon!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement logout logic
            navigation.navigate('Auth');
          },
        },
      ]
    );
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: profileData.avatar || 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editAvatarButton}>
          <MaterialIcons name="edit" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.profileName}>{profileData.name}</Text>
      <Text style={styles.profileEmail}>{profileData.email}</Text>
      <Text style={styles.profilePhone}>{profileData.phone}</Text>
      <Text style={styles.memberSince}>Member since {profileData.memberSince}</Text>
      
      <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
        <MaterialIcons name="edit" size={16} color="#FF6B6B" />
        <Text style={styles.editProfileButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{profileData.totalBookings}</Text>
        <Text style={styles.statLabel}>Bookings</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{profileData.favoriteVendors}</Text>
        <Text style={styles.statLabel}>Favorites</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{profileData.savedVenues}</Text>
        <Text style={styles.statLabel}>Venues</Text>
      </View>
    </View>
  );

  const renderSettingsItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        <MaterialIcons name={icon as any} size={24} color="#666" />
        <View style={styles.settingsItemText}>
          <Text style={styles.settingsItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || (
        <MaterialIcons name="chevron-right" size={24} color="#CCC" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <MaterialIcons name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        {renderProfileHeader()}

        {/* Stats */}
        {renderStats()}

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          {renderSettingsItem(
            'lock',
            'Change Password',
            'Update your account password',
            handleChangePassword
          )}
          
          {renderSettingsItem(
            'security',
            'Privacy Settings',
            'Manage your privacy preferences',
            handlePrivacySettings
          )}
          
          {renderSettingsItem(
            'notifications',
            'Notifications',
            'Manage notification preferences',
            undefined,
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E0E0E0', true: '#FF6B6B' }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          )}
          
          {renderSettingsItem(
            'dark-mode',
            'Dark Mode',
            'Switch between light and dark themes',
            undefined,
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#E0E0E0', true: '#FF6B6B' }}
              thumbColor={darkModeEnabled ? '#fff' : '#f4f3f4'}
            />
          )}
          
          {renderSettingsItem(
            'fingerprint',
            'Biometric Login',
            'Use fingerprint or face ID to login',
            undefined,
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#E0E0E0', true: '#FF6B6B' }}
              thumbColor={biometricEnabled ? '#fff' : '#f4f3f4'}
            />
          )}
        </View>

        {/* Support Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          {renderSettingsItem(
            'help',
            'Help & Support',
            'Get help and contact support',
            handleHelpSupport
          )}
          
          {renderSettingsItem(
            'info',
            'About WeddingLK',
            'App version and information'
          )}
          
          {renderSettingsItem(
            'description',
            'Terms of Service',
            'Read our terms and conditions'
          )}
          
          {renderSettingsItem(
            'privacy-tip',
            'Privacy Policy',
            'Read our privacy policy'
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FF6B6B',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  profilePhone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  editProfileButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
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
    textTransform: 'uppercase',
  },
  settingsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    padding: 20,
    paddingBottom: 10,
    backgroundColor: '#F8F9FA',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemText: {
    marginLeft: 15,
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ProfileScreen; 
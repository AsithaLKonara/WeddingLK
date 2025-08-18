import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface VenueDetailScreenProps {
  navigation: any;
  route: any;
}

interface Venue {
  _id: string;
  name: string;
  description: string;
  location: { address: string; city: string; province: string };
  capacity: { min: number; max: number };
  pricing: { basePrice: number; currency: string };
  rating: { average: number; count: number };
  amenities: string[];
  images: string[];
}

const { width } = Dimensions.get('window');

const VenueDetailScreen: React.FC<VenueDetailScreenProps> = ({ navigation, route }) => {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVenueDetails();
  }, []);

  const fetchVenueDetails = async () => {
    try {
      const venueId = route.params?.venueId;
      if (!venueId) {
        Alert.alert('Error', 'Venue ID not provided');
        return;
      }

      // TODO: Implement actual API call
      // For now, using mock data
      setVenue({
        _id: venueId,
        name: 'Grand Hotel Ballroom',
        description: 'Elegant ballroom for your special day. This stunning venue offers a perfect blend of luxury and comfort, making it ideal for weddings, receptions, and special events.',
        location: { address: '789 Luxury Blvd', city: 'Colombo', province: 'Western' },
        capacity: { min: 100, max: 300 },
        pricing: { basePrice: 50000, currency: 'LKR' },
        rating: { average: 4.7, count: 32 },
        amenities: ['Parking', 'Catering', 'Audio/Visual', 'Decoration', 'Security'],
        images: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch venue details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = () => {
    navigation.navigate('Booking', { venueId: venue?._id, venueName: venue?.name });
  };

  const handleViewGallery = () => {
    navigation.navigate('Gallery', { images: venue?.images, title: venue?.name });
  };

  const handleCheckAvailability = () => {
    navigation.navigate('VenueAvailability', { venueId: venue?._id });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!venue) {
    return (
      <View style={styles.errorContainer}>
        <Text>Venue not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <View style={styles.headerImage}>
        <Image
          source={{ uri: venue.images[0] || 'https://via.placeholder.com/400x200' }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton}>
          <MaterialIcons name="favorite-border" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Venue Info */}
      <View style={styles.venueInfo}>
        <View style={styles.venueHeader}>
          <View>
            <Text style={styles.venueName}>{venue.name}</Text>
            <Text style={styles.venueLocation}>
              {venue.location.city}, {venue.location.province}
            </Text>
          </View>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}>{venue.rating.average}</Text>
            <Text style={styles.ratingCount}>({venue.rating.count})</Text>
          </View>
        </View>

        <Text style={styles.description}>{venue.description}</Text>

        {/* Key Details */}
        <View style={styles.keyDetails}>
          <View style={styles.detailItem}>
            <MaterialIcons name="group" size={24} color="#FF6B6B" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Capacity</Text>
              <Text style={styles.detailValue}>
                {venue.capacity.min} - {venue.capacity.max} guests
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <MaterialIcons name="account-balance-wallet" size={24} color="#FF6B6B" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Starting Price</Text>
              <Text style={styles.detailValue}>
                {venue.pricing.currency} {venue.pricing.basePrice.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <MaterialIcons name="location-on" size={24} color="#FF6B6B" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{venue.location.address}</Text>
            </View>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.amenitiesSection}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {venue.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Gallery Preview */}
        <View style={styles.gallerySection}>
          <View style={styles.galleryHeader}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <TouchableOpacity onPress={handleViewGallery}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {venue.images.slice(0, 3).map((image, index) => (
              <TouchableOpacity key={index} onPress={handleViewGallery}>
                <Image
                  source={{ uri: image || 'https://via.placeholder.com/150x150' }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.availabilityButton} onPress={handleCheckAvailability}>
            <MaterialIcons name="event-available" size={20} color="#FF6B6B" />
            <Text style={styles.availabilityButtonText}>Check Availability</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
            <MaterialIcons name="event" size={20} color="#fff" />
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  venueInfo: {
    padding: 20,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  venueName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  venueLocation: {
    fontSize: 16,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  ratingCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 25,
  },
  keyDetails: {
    marginBottom: 25,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailContent: {
    marginLeft: 15,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  amenitiesSection: {
    marginBottom: 25,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  amenityText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  gallerySection: {
    marginBottom: 25,
  },
  galleryHeader: {
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
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  availabilityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
  },
  availabilityButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bookButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 15,
    marginLeft: 10,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default VenueDetailScreen; 
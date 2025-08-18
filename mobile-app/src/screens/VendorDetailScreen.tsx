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

interface VendorDetailScreenProps {
  navigation: any;
  route: any;
}

interface Vendor {
  _id: string;
  name: string;
  businessName: string;
  category: string;
  description: string;
  rating: { average: number; count: number };
  location: { address: string; city: string; province: string };
  contact: { phone: string; email: string };
  portfolio: string[];
  pricing: { basePrice: number; currency: string };
}

const { width } = Dimensions.get('window');

const VendorDetailScreen: React.FC<VendorDetailScreenProps> = ({ navigation, route }) => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVendorDetails();
  }, []);

  const fetchVendorDetails = async () => {
    try {
      const vendorId = route.params?.vendorId;
      if (!vendorId) {
        Alert.alert('Error', 'Vendor ID not provided');
        return;
      }

      // TODO: Implement actual API call
      // For now, using mock data
      setVendor({
        _id: vendorId,
        name: 'John Vendor',
        businessName: 'Perfect Photography',
        category: 'Photographer',
        description: 'Professional wedding photography services with over 10 years of experience. Specializing in capturing your special moments with creativity and style.',
        rating: { average: 4.8, count: 25 },
        location: { address: '123 Main St', city: 'Colombo', province: 'Western' },
        contact: { phone: '+94 11 123 4567', email: 'john@perfectphoto.com' },
        portfolio: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
        pricing: { basePrice: 50000, currency: 'LKR' },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch vendor details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = () => {
    Alert.alert('Contact', `Phone: ${vendor?.contact.phone}\nEmail: ${vendor?.contact.email}`);
  };

  const handleBookNow = () => {
    navigation.navigate('Booking', { vendorId: vendor?._id, vendorName: vendor?.businessName });
  };

  const handleViewPortfolio = () => {
    navigation.navigate('Gallery', { images: vendor?.portfolio, title: vendor?.businessName });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!vendor) {
    return (
      <View style={styles.errorContainer}>
        <Text>Vendor not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <View style={styles.headerImage}>
        <Image
          source={{ uri: vendor.portfolio[0] || 'https://via.placeholder.com/400x200' }}
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

      {/* Vendor Info */}
      <View style={styles.vendorInfo}>
        <View style={styles.vendorHeader}>
          <View>
            <Text style={styles.businessName}>{vendor.businessName}</Text>
            <Text style={styles.category}>{vendor.category}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}>{vendor.rating.average}</Text>
            <Text style={styles.ratingCount}>({vendor.rating.count})</Text>
          </View>
        </View>

        <Text style={styles.description}>{vendor.description}</Text>

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactItem}>
            <MaterialIcons name="phone" size={20} color="#FF6B6B" />
            <Text style={styles.contactText}>{vendor.contact.phone}</Text>
          </View>
          <View style={styles.contactItem}>
            <MaterialIcons name="email" size={20} color="#FF6B6B" />
            <Text style={styles.contactText}>{vendor.contact.email}</Text>
          </View>
          <View style={styles.contactItem}>
            <MaterialIcons name="location-on" size={20} color="#FF6B6B" />
            <Text style={styles.contactText}>
              {vendor.location.address}, {vendor.location.city}, {vendor.location.province}
            </Text>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.pricingCard}>
            <Text style={styles.pricingLabel}>Starting from</Text>
            <Text style={styles.pricingAmount}>
              {vendor.pricing.currency} {vendor.pricing.basePrice.toLocaleString()}
            </Text>
            <Text style={styles.pricingNote}>*Prices may vary based on requirements</Text>
          </View>
        </View>

        {/* Portfolio Preview */}
        <View style={styles.portfolioSection}>
          <View style={styles.portfolioHeader}>
            <Text style={styles.sectionTitle}>Portfolio</Text>
            <TouchableOpacity onPress={handleViewPortfolio}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {vendor.portfolio.slice(0, 3).map((image, index) => (
              <TouchableOpacity key={index} onPress={handleViewPortfolio}>
                <Image
                  source={{ uri: image || 'https://via.placeholder.com/150x150' }}
                  style={styles.portfolioImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
            <MaterialIcons name="phone" size={20} color="#FF6B6B" />
            <Text style={styles.contactButtonText}>Contact</Text>
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
  vendorInfo: {
    padding: 20,
  },
  vendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  category: {
    fontSize: 16,
    color: '#666',
    textTransform: 'capitalize',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  contactSection: {
    marginBottom: 25,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  pricingSection: {
    marginBottom: 25,
  },
  pricingCard: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  pricingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  pricingAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  pricingNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  portfolioSection: {
    marginBottom: 25,
  },
  portfolioHeader: {
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
  portfolioImage: {
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
  contactButton: {
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
  contactButtonText: {
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

export default VendorDetailScreen; 
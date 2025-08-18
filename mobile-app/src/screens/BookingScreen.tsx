import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface BookingScreenProps {
  navigation: any;
  route: any;
}

interface BookingForm {
  eventDate: Date;
  eventTime: string;
  guestCount: string;
  eventType: string;
  specialRequirements: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<BookingForm>({
    eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    eventTime: '18:00',
    guestCount: '',
    eventType: '',
    specialRequirements: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });

  const { vendorId, vendorName, venueId, venueName } = route.params || {};

  const handleDateChange = (text: string) => {
    // Simple date input handling
    setFormData({ ...formData, eventDate: new Date(text) });
  };

  const handleTimeChange = (text: string) => {
    // Simple time input handling
    setFormData({ ...formData, eventTime: text });
  };

  const validateForm = (): boolean => {
    if (!formData.guestCount.trim()) {
      Alert.alert('Error', 'Please enter the number of guests');
      return false;
    }

    if (!formData.eventType.trim()) {
      Alert.alert('Error', 'Please select the event type');
      return false;
    }

    if (!formData.contactName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }

    if (!formData.contactPhone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }

    if (!formData.contactEmail.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }

    if (parseInt(formData.guestCount) < 1) {
      Alert.alert('Error', 'Guest count must be at least 1');
      return false;
    }

    return true;
  };

  const handleSubmitBooking = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // TODO: Implement actual booking submission with API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Booking Submitted!',
        'Your booking request has been submitted successfully. We will contact you shortly to confirm the details.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Dashboard'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const eventTypes = [
    'Wedding Ceremony',
    'Wedding Reception',
    'Engagement Party',
    'Anniversary',
    'Birthday',
    'Corporate Event',
    'Other',
  ];

  const renderFormSection = (title: string, children: React.ReactNode) => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Now</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <MaterialIcons name="event" size={24} color="#FF6B6B" />
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceName}>
              {vendorName || venueName || 'Service'}
            </Text>
            <Text style={styles.serviceType}>
              {vendorId ? 'Vendor Service' : 'Venue Booking'}
            </Text>
          </View>
        </View>

        {/* Event Details */}
        {renderFormSection('Event Details', (
          <>
            <TextInput
              style={styles.input}
              placeholder="Event Date (MM/DD/YYYY)"
              value={formData.eventDate.toLocaleDateString()}
              onChangeText={handleDateChange}
            />

            <TextInput
              style={styles.input}
              placeholder="Event Time (HH:MM)"
              value={formData.eventTime}
              onChangeText={handleTimeChange}
            />

            <TextInput
              style={styles.input}
              placeholder="Number of guests"
              value={formData.guestCount}
              onChangeText={(text) => setFormData({ ...formData, guestCount: text })}
              keyboardType="numeric"
            />

            <View style={styles.eventTypeContainer}>
              {eventTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.eventTypeButton,
                    formData.eventType === type && styles.eventTypeButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, eventType: type })}
                >
                  <Text
                    style={[
                      styles.eventTypeButtonText,
                      formData.eventType === type && styles.eventTypeButtonTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Special requirements or requests"
              value={formData.specialRequirements}
              onChangeText={(text) => setFormData({ ...formData, specialRequirements: text })}
              multiline
              numberOfLines={4}
            />
          </>
        ))}

        {/* Contact Information */}
        {renderFormSection('Contact Information', (
          <>
            <TextInput
              style={styles.input}
              placeholder="Your full name"
              value={formData.contactName}
              onChangeText={(text) => setFormData({ ...formData, contactName: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone number"
              value={formData.contactPhone}
              onChangeText={(text) => setFormData({ ...formData, contactPhone: text })}
              keyboardType="phone-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Email address"
              value={formData.contactEmail}
              onChangeText={(text) => setFormData({ ...formData, contactEmail: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </>
        ))}

        {/* Terms and Conditions */}
        <View style={styles.termsContainer}>
          <TouchableOpacity style={styles.checkbox}>
            <MaterialIcons name="check-box-outline-blank" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I agree to the{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmitBooking}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.submitButtonText}>Submitting...</Text>
          ) : (
            <Text style={styles.submitButtonText}>Submit Booking Request</Text>
          )}
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
    padding: 20,
  },
  serviceInfo: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  serviceDetails: {
    marginLeft: 15,
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  serviceType: {
    fontSize: 14,
    color: '#666',
  },
  formSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#F8F9FA',
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  eventTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  eventTypeButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  eventTypeButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  eventTypeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  eventTypeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
    marginTop: 2,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCC',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default BookingScreen; 
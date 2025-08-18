import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SplashScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const logoAnim = new Animated.Value(0);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to next screen after delay
    const timer = setTimeout(() => {
      // TODO: Check authentication status
      // For now, navigate to auth
      navigation.replace('Auth');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background gradient overlay */}
      <View style={styles.backgroundOverlay} />
      
      {/* Logo and title */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoAnim,
            transform: [{ scale: logoAnim }],
          },
        ]}
      >
        <MaterialIcons name="favorite" size={120} color="#FF6B6B" />
      </Animated.View>

      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.title}>WeddingLK</Text>
        <Text style={styles.subtitle}>Your Wedding Planning Journey</Text>
      </Animated.View>

      {/* Loading indicator */}
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.loadingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
      </Animated.View>

      {/* Version info */}
      <Animated.View
        style={[
          styles.versionContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 107, 107, 0.9)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loadingDots: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  dot1: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  dot2: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  dot3: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  versionContainer: {
    position: 'absolute',
    bottom: 40,
  },
  versionText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
  },
});

export default SplashScreen; 
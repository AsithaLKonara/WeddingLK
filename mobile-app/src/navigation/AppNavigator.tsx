import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import VendorDetailScreen from '../screens/VendorDetailScreen';
import VenueDetailScreen from '../screens/VenueDetailScreen';
import PlanningToolsScreen from '../screens/PlanningToolsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof MaterialIcons.glyphMap = 'home'; // Default value

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Search') {
          iconName = 'search';
        } else if (route.name === 'Planning') {
          iconName = 'event';
        } else if (route.name === 'Favorites') {
          iconName = 'favorite';
        } else if (route.name === 'Profile') {
          iconName = 'person';
        }

        return <MaterialIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#FF6B6B',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={DashboardScreen} />
    <Tab.Screen name="Planning" component={PlanningToolsScreen} />
    <Tab.Screen name="Favorites" component={DashboardScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    // TODO: Check authentication status
    const checkAuth = async () => {
      // Simulate auth check
      await new Promise(resolve => setTimeout(resolve, 3000));
      setIsAuthenticated(false); // Set to true if user is authenticated
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <SplashScreen navigation={{}} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
        
        {/* Modal screens */}
        <Stack.Screen 
          name="VendorDetail" 
          component={VendorDetailScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen 
          name="VenueDetail" 
          component={VenueDetailScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 
import React, { useEffect, useState, Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Provider as PaperProvider } from 'react-native-paper';
import { ActivityIndicator, View, Text } from 'react-native';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { OfflineProvider } from './src/context/OfflineContext';
import { SyncProvider } from './src/context/SyncContext';
import { NotificationProvider } from './src/context/NotificationContext';

// 🚀 Code Splitting: Lazy load screens to reduce initial bundle size
const LoginScreen = React.lazy(() => import('./src/screens/auth/LoginScreen'));
const DashboardScreen = React.lazy(() => import('./src/screens/parent/DashboardScreen'));
const ChildrenScreen = React.lazy(() => import('./src/screens/parent/ChildrenScreen'));
const GradesScreen = React.lazy(() => import('./src/screens/parent/GradesScreen'));
const AttendanceScreen = React.lazy(() => import('./src/screens/parent/AttendanceScreen'));
const FeesScreen = React.lazy(() => import('./src/screens/parent/FeesScreen'));
const NoticesScreen = React.lazy(() => import('./src/screens/parent/NoticesScreen'));
const ProfileScreen = React.lazy(() => import('./src/screens/parent/ProfileScreen'));
const SettingsScreen = React.lazy(() => import('./src/screens/parent/SettingsScreen'));
const OfflineDataScreen = React.lazy(() => import('./src/screens/parent/OfflineDataScreen'));

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 🚀 Code Splitting: Loading fallback component
const LoadingFallback = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#2E7D32" />
    <Text style={{ marginTop: 10 }}>Loading...</Text>
  </View>
);

const ParentApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user is logged in from secure storage
      const authData = await SecureStore.getItemAsync('authData');
      if (authData) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const MainTabs = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Children':
              iconName = 'people';
              break;
            case 'Grades':
              iconName = 'school';
              break;
            case 'Attendance':
              iconName = 'event-available';
              break;
            case 'Fees':
              iconName = 'account-balance-wallet';
              break;
            case 'Notices':
              iconName = 'notifications';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" options={{ title: 'Home' }}>
        {props => (
          <Suspense fallback={<LoadingFallback />}>
            <DashboardScreen {...props} />
          </Suspense>
        )}
      </Tab.Screen>
      <Tab.Screen name="Children" options={{ title: 'My Children' }}>
        {props => (
          <Suspense fallback={<LoadingFallback />}>
            <ChildrenScreen {...props} />
          </Suspense>
        )}
      </Tab.Screen>
      <Tab.Screen name="Grades" options={{ title: 'Grades' }}>
        {props => (
          <Suspense fallback={<LoadingFallback />}>
            <GradesScreen {...props} />
          </Suspense>
        )}
      </Tab.Screen>
      <Tab.Screen name="Attendance" options={{ title: 'Attendance' }}>
        {props => (
          <Suspense fallback={<LoadingFallback />}>
            <AttendanceScreen {...props} />
          </Suspense>
        )}
      </Tab.Screen>
      <Tab.Screen name="Fees" options={{ title: 'Fees' }}>
        {props => (
          <Suspense fallback={<LoadingFallback />}>
            <FeesScreen {...props} />
          </Suspense>
        )}
      </Tab.Screen>
      <Tab.Screen name="Notices" options={{ title: 'Notices' }}>
        {props => (
          <Suspense fallback={<LoadingFallback />}>
            <NoticesScreen {...props} />
          </Suspense>
        )}
      </Tab.Screen>
      <Tab.Screen name="Profile" options={{ title: 'Profile' }}>
        {props => (
          <Suspense fallback={<LoadingFallback />}>
            <ProfileScreen {...props} />
          </Suspense>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );

  const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {props => (
          <Suspense fallback={<LoadingFallback />}>
            <LoginScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );

  const MainStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Settings" options={{ headerShown: true, title: 'Settings' }}>
            {props => (
              <Suspense fallback={<LoadingFallback />}>
                <SettingsScreen {...props} />
              </Suspense>
            )}
          </Stack.Screen>
          <Stack.Screen name="OfflineData" options={{ headerShown: true, title: 'Offline Data' }}>
            {props => (
              <Suspense fallback={<LoadingFallback />}>
                <OfflineDataScreen {...props} />
              </Suspense>
            )}
          </Stack.Screen>
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={{ marginTop: 10 }}>Loading Smart Panda...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <ThemeProvider>
        <AuthProvider>
          <OfflineProvider>
            <SyncProvider>
              <NotificationProvider>
                <NavigationContainer>
                  <MainStack />
                </NavigationContainer>
              </NotificationProvider>
            </SyncProvider>
          </OfflineProvider>
        </AuthProvider>
      </ThemeProvider>
    </PaperProvider>
  );
};

export default ParentApp;

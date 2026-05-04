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
import { AssignmentProvider } from './src/context/AssignmentContext';
import { QuizProvider } from './src/context/QuizContext';

// 🚀 Code Splitting: Lazy load screens to reduce initial bundle size
const LoginScreen = React.lazy(() => import('./src/screens/auth/LoginScreen'));
const DashboardScreen = React.lazy(() => import('./src/screens/student/DashboardScreen'));
const AssignmentsScreen = React.lazy(() => import('./src/screens/student/AssignmentsScreen'));
const AssignmentDetailScreen = React.lazy(() => import('./src/screens/student/AssignmentDetailScreen'));
const QuizScreen = React.lazy(() => import('./src/screens/student/QuizScreen'));
const QuizDetailScreen = React.lazy(() => import('./src/screens/student/QuizDetailScreen'));
const QuestionPapersScreen = React.lazy(() => import('./src/screens/student/QuestionPapersScreen'));
const QuestionPaperDetailScreen = React.lazy(() => import('./src/screens/student/QuestionPaperDetailScreen'));
const ResultsScreen = React.lazy(() => import('./src/screens/student/ResultsScreen'));
const FeesScreen = React.lazy(() => import('./src/screens/student/FeesScreen'));
const PollsScreen = React.lazy(() => import('./src/screens/student/PollsScreen'));
const TimetableScreen = React.lazy(() => import('./src/screens/student/TimetableScreen'));
const ProfileScreen = React.lazy(() => import('./src/screens/student/ProfileScreen'));
const SettingsScreen = React.lazy(() => import('./src/screens/student/SettingsScreen'));
const SubmissionScreen = React.lazy(() => import('./src/screens/student/SubmissionScreen'));
const OfflineDataScreen = React.lazy(() => import('./src/screens/student/OfflineDataScreen'));
const NotificationsScreen = React.lazy(() => import('./src/screens/student/NotificationsScreen'));

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 🚀 Code Splitting: Loading fallback component
const LoadingFallback = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#2E7D32" />
    <Text style={{ marginTop: 10 }}>Loading...</Text>
  </View>
);

const StudentApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
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
            case 'Assignments':
              iconName = 'assignment';
              break;
            case 'Quizzes':
              iconName = 'quiz';
              break;
            case 'QuestionPapers':
              iconName = 'description';
              break;
            case 'Results':
              iconName = 'school';
              break;
            case 'Fees':
              iconName = 'account-balance-wallet';
              break;
            case 'Polls':
              iconName = 'poll';
              break;
            case 'Timetable':
              iconName = 'schedule';
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
      <Tab.Screen name="Assignments" options={{ title: 'Assignments' }}>
        {props => (
          <Suspense fallback={<LoadingFallback />}>
            <AssignmentsScreen {...props} />
          </Suspense>
        )}
      </Tab.Screen>
      <Tab.Screen name="Quizzes" options={{ title: 'Quizzes' }}>
        {props => (
          <Suspense fallback={<LoadingFallback />}>
            <QuizScreen {...props} />
          </Suspense>
        )}
      </Tab.Screen>
      <Tab.Screen name="QuestionPapers" options={{ title: 'Question Papers' }}>
        {props => (
          <Suspense fallback={<LoadingFallback />}>
            <QuestionPapersScreen {...props} />
          </Suspense>
        )}
      </Tab.Screen>
      <Tab.Screen name="Results" options={{ title: 'Results' }}>
        {props => (
          <Suspense fallback={<LoadingFallback />}>
            <ResultsScreen {...props} />
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
      <Tab.Screen name="Polls" options={{ title: 'Polls' }}>
        {props => (
          <Suspense fallback={<LoadingFallback />}>
            <PollsScreen {...props} />
          </Suspense>
        )}
      </Tab.Screen>
      <Tab.Screen name="Timetable" options={{ title: 'Timetable' }}>
        {props => (
          <Suspense fallback={<LoadingFallback />}>
            <TimetableScreen {...props} />
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
          <Stack.Screen name="AssignmentDetail" options={{ headerShown: true, title: 'Assignment Details' }}>
            {props => (
              <Suspense fallback={<LoadingFallback />}>
                <AssignmentDetailScreen {...props} />
              </Suspense>
            )}
          </Stack.Screen>
          <Stack.Screen name="QuizDetail" options={{ headerShown: true, title: 'Quiz Details' }}>
            {props => (
              <Suspense fallback={<LoadingFallback />}>
                <QuizDetailScreen {...props} />
              </Suspense>
            )}
          </Stack.Screen>
          <Stack.Screen name="QuestionPaperDetail" options={{ headerShown: true, title: 'Question Paper' }}>
            {props => (
              <Suspense fallback={<LoadingFallback />}>
                <QuestionPaperDetailScreen {...props} />
              </Suspense>
            )}
          </Stack.Screen>
          <Stack.Screen name="Submission" options={{ headerShown: true, title: 'Submit Assignment' }}>
            {props => (
              <Suspense fallback={<LoadingFallback />}>
                <SubmissionScreen {...props} />
              </Suspense>
            )}
          </Stack.Screen>
          <Stack.Screen name="Notifications" options={{ headerShown: true, title: 'Notifications' }}>
            {props => (
              <Suspense fallback={<LoadingFallback />}>
                <NotificationsScreen {...props} />
              </Suspense>
            )}
          </Stack.Screen>
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
        <Text style={{ marginTop: 10 }}>Loading Smart Panda Student...</Text>
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
                <AssignmentProvider>
                  <QuizProvider>
                    <NavigationContainer>
                      <MainStack />
                    </NavigationContainer>
                  </QuizProvider>
                </AssignmentProvider>
              </NotificationProvider>
            </SyncProvider>
          </OfflineProvider>
        </AuthProvider>
      </ThemeProvider>
    </PaperProvider>
  );
};

export default StudentApp;

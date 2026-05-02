import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

// Layout Components
import { Layout } from './components/Layout/Layout';
import { MobileLayout } from './components/Layout/MobileLayout';

// Page Components
import ExecutiveDashboard from './pages/Dashboard/ExecutiveDashboard';
import StudentDashboard from './pages/Mobile/StudentDashboard';
import ParentDashboard from './pages/Mobile/ParentDashboard';
import TeacherDashboard from './pages/Mobile/TeacherDashboard';
import { AIAnalytics } from './pages/AI/AIAnalytics';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { NotFound } from './pages/NotFound';
import { ModuleCatalog } from './pages/Modules/ModuleCatalog';
import { ModuleDetail } from './pages/Modules/ModuleDetail';
import EventsManagementView from './pages/Modules/Views/EventsManagementView';
import TransportManagementView from './pages/Modules/Views/TransportManagementView';
import HostelManagementView from './pages/Modules/Views/HostelManagementView';
import HealthManagementView from './pages/Modules/Views/HealthManagementView';
import ClinicManagementView from './pages/Modules/Views/ClinicManagementView';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { VoiceProvider } from './contexts/VoiceContext';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useIsMobile } from './hooks/useIsMobile';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function AppRoutes() {
  const { user, isLoading } = useAuth();
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Mobile Routes
  if (isMobile) {
    return (
      <MobileLayout>
        <Routes>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/ai" element={<AIAnalytics />} />
          <Route path="/modules" element={<ModuleCatalog />} />
          <Route path="/modules/:moduleSlug" element={<ModuleDetail />} />
          <Route path="/operations/events-management" element={<EventsManagementView />} />
          <Route path="/operations/transport-management" element={<TransportManagementView />} />
          <Route path="/operations/hostel-management" element={<HostelManagementView />} />
          <Route path="/operations/health-management" element={<HealthManagementView />} />
          <Route path="/operations/clinic-management" element={<ClinicManagementView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MobileLayout>
    );
  }

  // Desktop Routes
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ExecutiveDashboard />} />
        <Route path="/dashboard" element={<ExecutiveDashboard />} />
        <Route path="/analytics" element={<AIAnalytics />} />
        <Route path="/modules" element={<ModuleCatalog />} />
        <Route path="/modules/:moduleSlug" element={<ModuleDetail />} />
        <Route path="/operations/events-management" element={<EventsManagementView />} />
        <Route path="/operations/transport-management" element={<TransportManagementView />} />
        <Route path="/operations/hostel-management" element={<HostelManagementView />} />
        <Route path="/operations/health-management" element={<HealthManagementView />} />
        <Route path="/operations/clinic-management" element={<ClinicManagementView />} />
        <Route path="/mobile/student" element={<StudentDashboard />} />
        <Route path="/mobile/parent" element={<ParentDashboard />} />
        <Route path="/mobile/teacher" element={<TeacherDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <VoiceProvider>
              <Router>
                <div className="App">
                  <AppRoutes />
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: 'var(--toast-bg)',
                        color: 'var(--toast-color)',
                        border: '1px solid var(--toast-border)',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      },
                      success: {
                        iconTheme: {
                          primary: '#22c55e',
                          secondary: '#ffffff',
                        },
                      },
                      error: {
                        iconTheme: {
                          primary: '#ef4444',
                          secondary: '#ffffff',
                        },
                      },
                    }}
                  />
                </div>
              </Router>
            </VoiceProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, LinearProgress } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import './i18n';
import theme from './theme';

// Error Boundary
import ErrorBoundary from './components/ErrorBoundary';

// Regular imports for critical components
import Navigation from './components/layout/Navigation';
import PrivateRoute from './components/auth/PrivateRoute';

// Lazy load pages for better performance
const HomeOptimized = lazy(() => import('./pages/HomeOptimized'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const Jobs = lazy(() => import('./pages/Jobs'));
const Workers = lazy(() => import('./pages/Workers'));
const Profile = lazy(() => import('./pages/Profile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PostJob = lazy(() => import('./pages/PostJob'));
const JobDetails = lazy(() => import('./pages/JobDetails'));
const WorkerProfile = lazy(() => import('./pages/WorkerProfile'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
const PageLoader = () => (
  <Box sx={{ width: '100%', position: 'fixed', top: 0, zIndex: 9999 }}>
    <LinearProgress color="primary" />
  </Box>
);

function App() {
  // Check if we should use the optimized home page
  const useOptimizedHome = process.env.REACT_APP_USE_OPTIMIZED_HOME !== 'false';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navigation />
              <Box component="main" sx={{ flex: 1 }}>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={useOptimizedHome ? <HomeOptimized /> : <Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/jobs/:id" element={<JobDetails />} />
                    <Route path="/workers" element={<Workers />} />
                    <Route path="/workers/:id" element={<WorkerProfile />} />
                    
                    {/* Protected Routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/post-job"
                      element={
                        <PrivateRoute requiredRole="employer">
                          <PostJob />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/onboarding"
                      element={
                        <PrivateRoute>
                          <Onboarding />
                        </PrivateRoute>
                      }
                    />
                    
                    {/* 404 Page */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </Box>
            </Box>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;

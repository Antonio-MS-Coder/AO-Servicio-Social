import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import './i18n';
import theme from './theme';

import Navigation from './components/layout/Navigation';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Jobs from './pages/Jobs';
import Workers from './pages/Workers';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import JobDetails from './pages/JobDetails';
import WorkerProfile from './pages/WorkerProfile';
import Onboarding from './pages/Onboarding';

import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navigation />
            <Box component="main" sx={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
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
                
                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

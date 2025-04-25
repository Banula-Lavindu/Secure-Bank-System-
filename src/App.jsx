import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeContext } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/Login';
import OtpVerification from './pages/OtpVerification';
import Dashboard from './pages/Dashboard';
import TransactionHistory from './pages/TransactionHistory';
import FundTransfer from './pages/FundTransfer';
import Profile from './pages/Profile';
import Statements from './pages/Statements';
import Notifications from './pages/Notifications';
import Support from './pages/Support';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import SessionExpired from './pages/SessionExpired';
import AdminDashboard from './pages/admin/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // In a real app, you would check authentication status from context
  const isAuthenticated = localStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  // In a real app, you would check if user has admin role
  const isAuthenticated = localStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');
  const isAdmin = userData ? JSON.parse(userData).role === 'admin' : false;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/forbidden" replace />;
  }
  
  return children;
};

function App() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute>
                <TransactionHistory />
              </ProtectedRoute>
            } />
            <Route path="/transfer" element={
              <ProtectedRoute>
                <FundTransfer />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/statements" element={
              <ProtectedRoute>
                <Statements />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/support" element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            } />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          {/* Error Pages */}
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="/session-expired" element={<SessionExpired />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
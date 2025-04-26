import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeContext } from './contexts/ThemeContext';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/Login';
import OtpVerification from './pages/OtpVerification';
import Dashboard from './pages/Dashboard';
import TransactionHistory from './pages/TransactionHistory';
import FundTransfer from './pages/FundTransfer';
import Beneficiaries from './pages/Beneficiaries';
import Profile from './pages/Profile';
import Statements from './pages/Statements';
import Notifications from './pages/Notifications';
import Support from './pages/Support';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import SessionExpired from './pages/SessionExpired';
import AdminDashboard from './pages/admin/AdminDashboard';

// Protected Route Component using context
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>; // You could create a proper loading component
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Route Component using context
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>; // You could create a proper loading component
  }
  
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
        <NotificationProvider>
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
              <Route path="/beneficiaries" element={
                <ProtectedRoute>
                  <Beneficiaries />
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
                <MainLayout />
              </AdminRoute>
            }>
              <Route index element={<AdminDashboard />} />
              {/* Add other admin routes here */}
            </Route>

            {/* Error Pages */}
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="/session-expired" element={<SessionExpired />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
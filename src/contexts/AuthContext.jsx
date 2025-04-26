import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
        
        // Verify token validity with backend (optional)
        try {
          const profile = await authService.getUserProfile();
          // Update user data with latest from the server
          setUser(profile);
        } catch (error) {
          console.error('Token validation error:', error);
          // If token is invalid, logout user
          logout();
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      // Check if the response has the expected structure
      if (!response) {
        console.error('Empty login response');
        throw new Error('Empty response from server. Please try again.');
      }
      
      // Check for token in either token or access field
      const token = response.token || response.access;
      
      if (!token) {
        console.error('No token in login response:', response);
        throw new Error('Authentication token not provided. Please try again.');
      }
      
      // Store token and user data
      localStorage.setItem('authToken', token);
      
      if (response.user) {
        localStorage.setItem('userData', JSON.stringify(response.user));
        setUser(response.user);
      } else {
        console.warn('User data missing from login response');
      }
      
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call the logout API endpoint
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API result
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = async (newUserData) => {
    try {
      // Call the update profile API
      const response = await authService.updateUserProfile(newUserData);
      
      // Update local storage with new user data
      const updatedUser = { ...user, ...response };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return response;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated,
      isAdmin,
      loading,
      login, 
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading,
      login, 
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
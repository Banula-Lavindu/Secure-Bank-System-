import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  response => response, // Return the full response object, not just data
  error => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Clear stored auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Redirect to session expired page if not already there
      if (window.location.pathname !== '/session-expired' && 
          window.location.pathname !== '/login') {
        window.location.href = '/session-expired';
      }
    }
    
    // Handle forbidden access
    if (error.response && error.response.status === 403) {
      if (window.location.pathname !== '/forbidden') {
        window.location.href = '/forbidden';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;